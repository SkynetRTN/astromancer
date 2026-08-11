import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

import { RadioSearchHighChartService, RadioSearchService } from './radiosearch.service';
import { DialogContent } from './dialogContent.component';
import { HonorCodePopupService } from '../shared/honor-code-popup/honor-code-popup.service';
import { HonorCodeChartService } from '../shared/honor-code-popup/honor-code-chart.service';
import {
  CatalogSource,
  RadioCatalogResponse,
  RadioSearchParamDataDict,
  SourceFluxes,
} from './radiosearch.service.util';
import {
  decodeHeaderText,
  decodePrimaryHeader,
  encodeHeaderText,
  findDataOffset,
  normalizeRadioHeader,
  rewriteHeaderCard,
  WcsInfo,
} from './fitsHeader';
import { readScaledPixels } from './fitsPixels';
import {
  COLOR_MAP_OPTIONS,
  getColorFromMap,
  getStretch,
  percentile,
  STRETCH_OPTIONS,
} from './colorMaps';
import { applyFitToSeries, buildScatterSeries, extractFluxes, fitSpectralIndex } from './radioFlux';
import * as fitsjs from 'fitsjs';

/** Radius of a source ring, in image pixels before display scaling. */
const SOURCE_RING_RADIUS = 22;

/** Percentile cuts used to normalize the raster, guarding against bright outliers. */
const LOW_CUT = 0.01;
const HIGH_CUT = 0.995;

/** Half-length of the crosshair arms, in screen pixels (constant regardless of zoom). */
const MARKER_ARM = 8;

/** Pointer travel below which a drag still counts as a click, in screen pixels. */
const CLICK_SLOP = 3;

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 20;

interface SkyCoordinates {
  ra: number;
  dec: number;
}

/** A point on the image raster, in unscaled pixel coordinates. */
interface ImagePoint {
  x: number;
  y: number;
}

@Component({
  selector: 'app-radiosearch',
  templateUrl: './radiosearch.component.html',
  styleUrls: ['./radiosearch.component.scss', '../shared/interface/tools.scss'],
})
export class RadioSearchComponent implements AfterViewInit, OnDestroy {
  // --- Loaded file -----------------------------------------------------------
  fitsFileName: string | undefined;
  fitsLoaded = false;
  arrayBuffer: ArrayBuffer | null = null;
  header: fitsjs.astro.FITS.Header | null = null;

  // --- Map geometry ----------------------------------------------------------
  /** Map centre longitude: RA, or galactic longitude when rccords is 'galactic'. */
  ra: number | undefined;
  /** Map centre latitude: Dec, or galactic latitude. */
  dec: number | undefined;
  /** Angular extent of the map in degrees. */
  width: number | undefined;
  height: number | undefined;
  naxis1: number = 100;
  naxis2: number = 100;
  /** BITPIX of the loaded image; the single-layer save needs the byte width. */
  bitpix: number = -64;
  rccords: string | undefined;
  /** WCS projection code from CTYPE1 ('TAN', 'SFL', ... or '' on the oldest files). */
  projection: string = '';
  wcsInfo: WcsInfo | null = null;

  // --- Canvas display state --------------------------------------------------
  canvas: HTMLCanvasElement | null = null;
  /** BSCALE/BZERO-corrected pixel values, row-major, FITS bottom-up order. */
  scaledData: Float64Array | undefined;
  /** Scale at which the whole image just fits the canvas, before zoom. */
  private baseScale: number = 1;
  scale: number = 1;
  scaledWidth: number = 0;
  scaledHeight: number = 0;
  canvasXOffset: number = 0;
  canvasYOffset: number = 0;
  /** Pan offset in canvas pixels, applied on top of the centring offsets. */
  panX: number = 0;
  panY: number = 0;

  /**
   * Offscreen copy of the coloured image at native resolution.
   *
   * Rebuilt only when pixel appearance changes; pan and zoom just re-blit it.
   * Exactly one is retained - see the memory note on scaledData.
   */
  private rasterCanvas: HTMLCanvasElement | null = null;
  private rasterDirty = true;
  /** Percentile cuts, which depend only on the pixel data. */
  private cuts: { minCut: number; maxCut: number } | null = null;

  /** Clicked point, held in image-raster coordinates so it survives pan/zoom. */
  private marker: ImagePoint | null = null;
  /** Index into `results` of the highlighted source, or -1. */
  private selectedSourceIndex = -1;

  // --- Bound to the template controls ---------------------------------------
  sliderXOffset: number = 0;
  sliderYOffset: number = 0;
  maxValue: number = 0.5;
  zoomLevel: number = 100;
  zoomScale: number = 1;
  selectedColorMap: string = 'turbo';
  selectedStretch: string = 'asinh';
  selectedLayer: string = 'full';

  readonly colorMapOptions = COLOR_MAP_OPTIONS;
  readonly stretchOptions = STRETCH_OPTIONS;

  // --- Observation metadata --------------------------------------------------
  targetFreq: number = 1.5;
  lowerFreq: number = 1.4;
  upperFreq: number = 1.6;
  beamWidth: number = 1;

  // --- Catalogue results -----------------------------------------------------
  /** Sky positions, used for the canvas overlay. Index-aligned with sourceFluxes. */
  results: CatalogSource[] = [];
  /** Survey fluxes, index-aligned with results. */
  hiddenResults: SourceFluxes[] = [];
  currentCoordinates: SkyCoordinates | null = null;
  selectedCoordinates: SkyCoordinates | null = null;
  params: RadioSearchParamDataDict[] = [];

  private readonly averageFluxSubject = new BehaviorSubject<string | null>(null);
  readonly averageFlux$ = this.averageFluxSubject.asObservable();
  private readonly selectedSourceSubject = new BehaviorSubject<string | null>(null);
  readonly selectedSource$ = this.selectedSourceSubject.asObservable();

  private readonly destroy$ = new Subject<void>();

  @ViewChild('fitsCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileDropZone', { static: false }) fileDropZoneRef!: ElementRef<HTMLDivElement>;

  // Pointer-drag bookkeeping. A press that travels less than CLICK_SLOP is
  // treated as a click (select a source); anything further is a pan.
  private pointerDownAt: { x: number; y: number } | null = null;
  private panStart: { x: number; y: number } | null = null;
  private isPanning = false;

  // Canvas listeners are attached imperatively because the template binds no
  // events on <canvas>; keep the references so they can be detached again.
  private readonly onCanvasPointerDown = (event: PointerEvent) => this.handlePointerDown(event);
  private readonly onCanvasPointerMove = (event: PointerEvent) => this.handlePointerMove(event);
  private readonly onCanvasPointerUp = (event: PointerEvent) => this.handlePointerUp(event);
  private readonly onCanvasWheel = (event: WheelEvent) => this.handleWheel(event);

  constructor(
    private service: RadioSearchService,
    private hcservice: RadioSearchHighChartService,
    private honorCodeService: HonorCodePopupService,
    private chartService: HonorCodeChartService,
    private dialog: MatDialog,
  ) {}

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;

    if (!this.canvas) {
      console.error('Canvas element is not found.');
      return;
    }

    this.canvas.addEventListener('pointerdown', this.onCanvasPointerDown);
    this.canvas.addEventListener('pointermove', this.onCanvasPointerMove);
    this.canvas.addEventListener('pointerup', this.onCanvasPointerUp);
    this.canvas.addEventListener('pointercancel', this.onCanvasPointerUp);
    this.canvas.addEventListener('wheel', this.onCanvasWheel, { passive: false });

    // The drop zone's dragenter/dragleave/drop handlers are bound in the
    // template. They were *also* attached here with addEventListener, so every
    // drop ran onFileDrop twice - parsing the file and querying the catalogue
    // twice per drop. The template bindings are the ones Angular cleans up, so
    // the duplicates are gone rather than the bindings.
  }

  ngOnDestroy(): void {
    this.canvas?.removeEventListener('pointerdown', this.onCanvasPointerDown);
    this.canvas?.removeEventListener('pointermove', this.onCanvasPointerMove);
    this.canvas?.removeEventListener('pointerup', this.onCanvasPointerUp);
    this.canvas?.removeEventListener('pointercancel', this.onCanvasPointerUp);
    this.canvas?.removeEventListener('wheel', this.onCanvasWheel);
    this.destroy$.next();
    this.destroy$.complete();
  }

  // beforeunload is wired by the HostListener decorator below — Angular
  // attaches and detaches it on the component lifecycle, so an explicit
  // removeEventListener (which would target a different function reference
  // anyway) is unnecessary.
  @HostListener('window:beforeunload', ['$event'])
  confirmExit(event: BeforeUnloadEvent): void {
    if (this.fitsLoaded) {
      // Modern browsers ignore preventDefault on beforeunload unless
      // returnValue is also set (assignment is what triggers the prompt;
      // the value itself is discarded by the browser).
      event.preventDefault();
      event.returnValue = '';
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.scaledData) {
      this.composeFrame();
    }
  }

  // ---------------------------------------------------------------------------
  // File input
  // ---------------------------------------------------------------------------

  onDragEnter(): void {
    this.fileDropZoneRef.nativeElement.classList.add('shake');
  }

  onDragLeave(): void {
    this.fileDropZoneRef.nativeElement.classList.remove('shake');
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Required to allow dropping
    event.stopPropagation(); // Prevents bubbling issues
    this.fileDropZoneRef.nativeElement.classList.add('shake'); // Keep shake active
  }

  onFileDrop(event: DragEvent): void {
    this.deleteFITS();
    event.preventDefault();
    this.fileDropZoneRef.nativeElement.classList.remove('shake');

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.fitsFileName = file.name;
      this.processFitsFile(file);
    }
  }

  onFileSelected(event: Event): void {
    // Don't flip fitsLoaded until processFitsFile actually succeeds.
    // Setting it true upfront would hide the drop zone (*ngIf="!fitsLoaded")
    // even when the parse later fails, leaving the user with no obvious way
    // to retry. processFitsFile sets fitsLoaded = true on success and
    // deleteFITS() on error, mirroring the onFileDrop path.
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.fitsFileName = file.name;
      this.processFitsFile(file);
    }
  }

  // ---------------------------------------------------------------------------
  // FITS loading
  // ---------------------------------------------------------------------------

  processFitsFile(file: File): Promise<void> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onerror = () => {
        console.error('Failed to read file:', reader.error);
        this.failLoad(`Could not read "${file.name}".`);
        resolve();
      };

      reader.onload = (e) => {
        this.arrayBuffer = e.target?.result as ArrayBuffer;
        if (!this.arrayBuffer) {
          this.failLoad(`Could not read "${file.name}".`);
          resolve();
          return;
        }

        try {
          this.readFits(this.arrayBuffer);
          this.searchCatalog();
        } catch (error) {
          console.error('Error processing FITS file:', error);
          const detail = error instanceof Error ? error.message : String(error);
          this.failLoad(`Could not read "${file.name}" as a Radio Cartographer FITS file.\n\n${detail}`);
        }

        resolve();
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Parse the header and pixel data of a Radio Cartographer map.
   *
   * Header dialects are normalized in fits-header.ts; the whole header is
   * decoded however many 2880-byte blocks it occupies.
   */
  private readFits(buffer: ArrayBuffer): void {
    this.header = decodePrimaryHeader(buffer);
    const meta = normalizeRadioHeader(this.header);

    this.naxis1 = meta.naxis1;
    this.naxis2 = meta.naxis2;
    this.bitpix = meta.bitpix;
    this.rccords = meta.coordSystem;
    this.projection = meta.projection;
    this.ra = meta.centerLon;
    this.dec = meta.centerLat;
    this.lowerFreq = meta.lowerFreq;
    this.upperFreq = meta.upperFreq;
    this.targetFreq = meta.targetFreq;
    this.beamWidth = meta.beamWidth;
    this.wcsInfo = meta.wcs;

    this.scaledData = readScaledPixels(buffer, meta, findDataOffset(buffer));
    this.cuts = null;
    this.rasterDirty = true;
    this.fitsLoaded = true;

    this.width = Math.abs(meta.wcs.cdelt1) * meta.naxis1;
    this.height = Math.abs(meta.wcs.cdelt2) * meta.naxis2;
  }

  /**
   * Abandon a load and tell the user why.
   *
   * The image only ever lives in memory, so having it silently vanish - which
   * is what a bare console.error plus deleteFITS() did - is expensive for the
   * user. Failures now surface through the same dialog as "please upload a file".
   */
  private failLoad(message: string): void {
    this.deleteFITS();
    this.dialog.open(DialogContent, {
      data: { message },
      width: '400px',
    });
  }

  deleteFITS(): void {
    this.fitsFileName = undefined;
    this.fitsLoaded = false;
    this.arrayBuffer = null;

    this.ra = undefined;
    this.dec = undefined;
    this.width = undefined;
    this.height = undefined;
    this.naxis1 = 100;
    this.naxis2 = 100;
    this.bitpix = -64;
    this.rccords = undefined;
    this.projection = '';
    this.wcsInfo = null;

    this.scaledData = undefined;
    this.scale = 1;
    this.scaledWidth = 0;
    this.scaledHeight = 0;
    this.canvasXOffset = 0;
    this.canvasYOffset = 0;
    this.panX = 0;
    this.panY = 0;

    this.rasterCanvas = null;
    this.rasterDirty = true;
    this.cuts = null;
    this.marker = null;
    this.selectedSourceIndex = -1;

    this.sliderXOffset = 0;
    this.sliderYOffset = 0;
    this.maxValue = 0.5;
    this.zoomLevel = 100;
    this.zoomScale = 1;
    this.selectedStretch = 'asinh';

    this.targetFreq = 1.5;
    this.lowerFreq = 1.4;
    this.upperFreq = 1.6;

    this.results = [];
    this.hiddenResults = [];
    this.currentCoordinates = null;
    this.selectedCoordinates = null;
    this.selectedSourceSubject.next(null);

    this.hcservice.resetData();
    this.hcservice.resetChartInfo();
    this.hcservice.setChartTitle('Results for Radio Source');
  }

  // ---------------------------------------------------------------------------
  // FITS saving
  // ---------------------------------------------------------------------------

  saveFITS(): void {
    if (this.selectedLayer == 'full') {
      this.saveFullFITS();
    } else if (this.selectedLayer == 'single') {
      this.saveSingleLayerFITS();
    }
  }

  /** Save the whole file, header corrections applied. */
  saveFullFITS(): void {
    this.downloadCorrectedFits(false);
  }

  /** Save only the primary image plane, header corrections applied. */
  saveSingleLayerFITS(): void {
    this.downloadCorrectedFits(true);
  }

  /**
   * Rewrite the header with the current slider offsets and download the result.
   *
   * @param singleLayer keep only the primary image plane instead of the whole file.
   */
  private downloadCorrectedFits(singleLayer: boolean): void {
    try {
      if (!this.arrayBuffer || this.ra === undefined || this.dec === undefined || !this.wcsInfo) {
        return;
      }

      const dataOffset = findDataOffset(this.arrayBuffer);
      const raShift = this.sliderXOffset / Math.cos((Math.PI * this.dec) / 180);
      const wrapLongitude = (deg: number) => ((deg % 360) + 360) % 360;

      // Each card is rewritten whole, so the header length is preserved by
      // construction. CENTERRA/CENTERDE are simply absent from newer files and
      // are left alone there.
      //
      // CTYPE1/CTYPE2 are deliberately NOT touched. The old code tried to
      // overwrite them with bare 'RA'/'DEC', which would strip the projection
      // code from a modern header (CTYPE1 = 'RA---SFL'); it only ever appeared
      // harmless because the numeric-value regex never matched a quoted string.
      let header = decodeHeaderText(this.arrayBuffer);
      header = rewriteHeaderCard(header, 'CENTERRA', wrapLongitude(this.ra + raShift));
      header = rewriteHeaderCard(header, 'CENTERDE', this.dec - this.sliderYOffset);
      header = rewriteHeaderCard(header, 'CRVAL1', wrapLongitude(this.wcsInfo.crval1 + raShift));
      header = rewriteHeaderCard(header, 'CRVAL2', this.wcsInfo.crval2 - this.sliderYOffset);

      const headerBytes = encodeHeaderText(header);
      if (headerBytes.length !== dataOffset) {
        // Refuse to write rather than emit a file whose cards are misaligned.
        throw new Error(
          `Header rewrite changed length (${headerBytes.length} vs ${dataOffset} bytes); aborting save.`,
        );
      }

      const originalView = new Uint8Array(this.arrayBuffer);
      let newBuffer: ArrayBuffer;

      if (singleLayer) {
        // Keep the primary image plane only, dropping the extensions that
        // follow it. Byte width comes from BITPIX rather than assuming float64.
        const planeBytes = this.naxis1 * this.naxis2 * (Math.abs(this.bitpix) / 8);
        const unpadded = dataOffset + planeBytes;
        // Pad to a whole 2880 block - but do not add a spurious empty block
        // when the length already lands on a boundary.
        const totalLength = unpadded + ((2880 - (unpadded % 2880)) % 2880);

        newBuffer = new ArrayBuffer(totalLength);
        const newView = new Uint8Array(newBuffer);
        newView.set(headerBytes, 0);
        newView.set(originalView.subarray(dataOffset, dataOffset + planeBytes), dataOffset);
      } else {
        // Everything after the primary header is copied verbatim, extensions
        // included.
        newBuffer = new ArrayBuffer(this.arrayBuffer.byteLength);
        const newView = new Uint8Array(newBuffer);
        newView.set(headerBytes, 0);
        newView.set(originalView.subarray(dataOffset), dataOffset);
      }

      const prefix = singleLayer ? 'corrected_sl_' : 'corrected_';
      const fitsBlob = new Blob([newBuffer], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(fitsBlob);
      link.download = prefix + this.fitsFileName;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error saving FITS file:', error);
      this.dialog.open(DialogContent, {
        data: { message: 'Could not save the FITS file. The image is unchanged.' },
        width: '400px',
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Catalogue query
  // ---------------------------------------------------------------------------

  searchCatalog(): void {
    // Use explicit undefined checks: a source on the celestial equator has
    // Dec === 0 (and RA can be 0 too after the `%= 360` normalization).
    // Plain truthy checks would reject those valid values and call deleteFITS,
    // wiping the freshly-loaded image with a misleading console error.
    if (this.rccords === undefined ||
        this.ra === undefined || this.dec === undefined ||
        this.width === undefined || this.height === undefined) {
      console.error('RA, Dec, Width, and Height are required!');
      this.deleteFITS();
      return;
    }

    this.service
      .fetchRadioCatalog(this.rccords, this.ra, this.dec, this.width, this.height)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: RadioCatalogResponse) => {
          this.results = response.objects.map((source) => ({
            name: source.SIMBAD || 'Unknown',
            id: source.id,
            ra: source.ra,
            dec: source.dec,
            galLat: source.galLat,
            galLong: source.galLong,
            catalog: source.catalog,
            identifier: source.identifier,
          }));

          this.hiddenResults = response.objects.map((source) => ({
            name: source.SIMBAD || 'Unknown',
            id: source.id || 'Unknown',
            MHz38: source.MHz38 || 'Unknown',
            MHz159: source.MHz159 || 'Unknown',
            MHz178: source.MHz178 || 'Unknown',
            MHz750: source.MHz750 || 'Unknown',
            L1400: source.L || 'Unknown',
            S2695: source.S || 'Unknown',
            C5000: source.C || 'Unknown',
            X8400: source.X || 'Unknown',
          }));

          this.composeFrame();
        },
        error: (error: unknown) => {
          console.error('Radio catalog query failed:', error);
          this.composeFrame();
        },
      });
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  /** Re-render after a control that changes geometry only (RA/Dec offsets). */
  updateFitsImage(): void {
    this.zoomScale = this.zoomLevel / 100;
    this.composeFrame();
  }

  /** Re-render after a control that changes pixel appearance (colour map, stretch, scale). */
  onAppearanceChange(): void {
    this.rasterDirty = true;
    this.composeFrame();
  }

  /**
   * Rebuild the offscreen raster if anything affecting pixel colour changed.
   *
   * This is the expensive half of rendering - one pass over every pixel - so it
   * is kept off the pan/zoom path, which only needs to re-blit the result.
   * Exactly one raster is cached at a time; the source images are large enough
   * that keeping a set per colour map would be careless.
   */
  private rebuildRaster(): void {
    const imageData = this.scaledData;
    if (!imageData) {
      this.rasterCanvas = null;
      return;
    }

    const width = this.naxis1;
    const height = this.naxis2;

    // Percentile cuts depend only on the pixel data, so they outlive colour map
    // and stretch changes and are computed once per loaded file.
    if (!this.cuts) {
      this.cuts = this.computeCuts(imageData);
    }
    if (!this.cuts) {
      console.error('No valid finite image data found.');
      this.rasterCanvas = null;
      return;
    }

    const raster = this.rasterize(imageData, width, height, this.cuts.minCut, this.cuts.maxCut);

    if (!this.rasterCanvas) {
      this.rasterCanvas = document.createElement('canvas');
    }
    this.rasterCanvas.width = width;
    this.rasterCanvas.height = height;

    const rasterContext = this.rasterCanvas.getContext('2d');
    if (!rasterContext) {
      console.error('Failed to get offscreen canvas context.');
      this.rasterCanvas = null;
      return;
    }

    rasterContext.putImageData(raster, 0, 0);
    this.rasterDirty = false;
  }

  /**
   * Draw the current view: raster, source rings, crosshair.
   *
   * Cheap enough to call on every pointer move while dragging. The canvas
   * backing store is forced square while its CSS box is not, so the browser
   * stretches the result horizontally; every mouse-to-sky calculation
   * compensates via getBoundingClientRect. Changing the canvas CSS aspect ratio
   * changes both the rendered geometry and the click mapping.
   */
  composeFrame(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) {
      console.error('Canvas element is not initialized.');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Failed to get canvas context.');
      return;
    }

    if (!this.scaledData) {
      return;
    }

    const width = this.naxis1;
    const height = this.naxis2;

    // Match the backing store to the element's box so image pixels stay square.
    // This previously forced a square backing store inside a non-square box,
    // which made the browser stretch the raster horizontally.
    //
    // Only assign when the size actually changed - assigning clears the canvas
    // and resets context state, and this runs on every pointermove while
    // dragging.
    const boxWidth = canvas.clientWidth;
    const boxHeight = canvas.clientHeight;
    if (boxWidth === 0 || boxHeight === 0) {
      return;
    }
    if (canvas.width !== boxWidth || canvas.height !== boxHeight) {
      canvas.width = boxWidth;
      canvas.height = boxHeight;
    }

    // Fit the whole image inside the box at a single scale, so one image pixel
    // is a square on screen and the map is letterboxed rather than distorted.
    const initialScale = Math.min(canvas.width / width, canvas.height / height);

    this.baseScale = initialScale;
    this.scale = initialScale * this.zoomScale;
    this.scaledWidth = width * this.scale;
    this.scaledHeight = height * this.scale;
    this.canvasXOffset = (canvas.width - this.scaledWidth) / 2 + this.panX;
    this.canvasYOffset = (canvas.height - this.scaledHeight) / 2 + this.panY;

    if (this.rasterDirty || !this.rasterCanvas) {
      this.rebuildRaster();
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (this.rasterCanvas) {
      context.drawImage(
        this.rasterCanvas,
        0, 0, width, height,
        this.canvasXOffset, this.canvasYOffset, this.scaledWidth, this.scaledHeight,
      );
    }

    this.drawCircles();
    this.refreshMarker(canvas, context);
  }

  /** Percentile clip limits, so one bright outlier can't saturate the frame. */
  private computeCuts(imageData: Float64Array): { minCut: number; maxCut: number } | null {
    const validData = Array.from(imageData).filter((value) => Number.isFinite(value));
    if (validData.length === 0) {
      return null;
    }

    const sortedData = validData.sort((a, b) => a - b);

    let minCut = percentile(sortedData, LOW_CUT);
    let maxCut = percentile(sortedData, HIGH_CUT);

    // Safety fallback.
    if (!Number.isFinite(minCut) || !Number.isFinite(maxCut) || maxCut <= minCut) {
      minCut = sortedData[0];
      maxCut = sortedData[sortedData.length - 1];
    }

    // Flat image safety.
    if (!Number.isFinite(minCut) || !Number.isFinite(maxCut) || maxCut <= minCut) {
      maxCut = minCut + 1;
    }

    return { minCut, maxCut };
  }

  /**
   * Convert pixel values to RGBA.
   *
   * NaN and exact-zero pixels are painted white without going through
   * normalization, so blanked regions stay blank rather than reading as the
   * bottom of the colour scale.
   */
  private rasterize(
    imageData: Float64Array,
    width: number,
    height: number,
    minCut: number,
    maxCut: number,
  ): ImageData {
    const rgba = new Uint8ClampedArray(width * height * 4);
    const stretch = getStretch(this.selectedStretch);
    const brightness = this.maxValue;
    const colorMap = this.selectedColorMap;
    const span = maxCut - minCut;

    for (let y = 0; y < height; y++) {
      // FITS is stored bottom-to-top relative to the canvas.
      const srcRow = (height - y - 1) * width;
      const dstRow = y * width;

      for (let x = 0; x < width; x++) {
        const rawValue = imageData[srcRow + x];
        const dstIndex = (dstRow + x) * 4;

        let r: number;
        let g: number;
        let b: number;

        if (!Number.isFinite(rawValue) || rawValue === 0) {
          r = 255;
          g = 255;
          b = 255;
        } else {
          const clampedValue = Math.min(maxCut, Math.max(minCut, rawValue));
          const normalized = (clampedValue - minCut) / span;
          [r, g, b] = getColorFromMap(stretch(normalized, brightness), colorMap);
        }

        rgba[dstIndex] = r;
        rgba[dstIndex + 1] = g;
        rgba[dstIndex + 2] = b;
        rgba[dstIndex + 3] = 255;
      }
    }

    return new ImageData(rgba, width, height);
  }

  /** Repaint the view. Kept for callers that only care about the overlay. */
  redrawCircles(): void {
    this.composeFrame();
  }

  // ---------------------------------------------------------------------------
  // Source overlay and projection
  // ---------------------------------------------------------------------------

  /**
   * CSS-pixel to backing-store scale factors for the canvas.
   *
   * The backing store is square while the CSS box is not, so these differ.
   */
  private canvasScaleFactors(canvas: HTMLCanvasElement): { scaleX: number; scaleY: number } {
    const rect = canvas.getBoundingClientRect();
    return { scaleX: canvas.width / rect.width, scaleY: canvas.height / rect.height };
  }

  /** Ring stroke width, interpolated across the zoom range. */
  private get ringLineWidth(): number {
    return 1 + (3 - 1) * ((this.zoomScale - 0.1) / (1 - 0.1));
  }

  /**
   * Project a catalogue source onto canvas coordinates.
   *
   * Extracted unchanged from the two copies that previously lived in
   * drawCircles and grabCoordinatesOnClick.
   *
   * Two things here are empirically tuned rather than derived, and are
   * preserved verbatim pending the separate geometry pass:
   *  - the `crval1 > 360` wrap branch;
   *  - the cos(galLat) horizontal compression, which is applied regardless of
   *    whether the map is galactic or equatorial (on an equatorial map the
   *    factor should be cos(dec)).
   * The X and Y slider offsets are also scaled asymmetrically: X picks up
   * zoomScale, Y does not.
   */
  private projectSource(
    lon: number,
    lat: number,
    galLat: number,
    canvas: HTMLCanvasElement,
    scaleX: number,
    scaleY: number,
  ): { x: number; y: number } {
    const { crpix1, crpix2, crval1, crval2, cdelt1, cdelt2 } = this.wcsInfo!;

    const pixelX = crval1 > 360 && lon < 180
      ? ((lon + 360 - crval1) / cdelt1) + crpix1
      : ((lon - crval1) / cdelt1) + crpix1;
    const pixelY = ((crval2 - lat) / cdelt2) + crpix2;

    const pixelXOffset = (this.sliderXOffset / Math.abs(cdelt1)) * this.zoomScale * scaleX;
    const pixelYOffset = (this.sliderYOffset / Math.abs(cdelt2)) * scaleY;

    const centredX = pixelX * this.scale + this.canvasXOffset;
    const halfWidth = canvas.width / 2;

    return {
      x: halfWidth + (centredX - halfWidth) * Math.cos((galLat * Math.PI) / 180) + pixelXOffset,
      y: (pixelY - pixelYOffset) * this.scale + this.canvasYOffset,
    };
  }

  /** Longitude/latitude of a source in whichever frame the map uses. */
  private sourcePosition(source: CatalogSource): { lon: number; lat: number } | null {
    if (this.rccords === 'equatorial') {
      return { lon: source.ra, lat: source.dec };
    }
    if (this.rccords === 'galactic') {
      return { lon: source.galLong, lat: source.galLat };
    }
    console.error('Unknown coordinate system:', this.rccords);
    return null;
  }

  drawCircles(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (!context || !this.wcsInfo) {
      return;
    }

    const { scaleX, scaleY } = this.canvasScaleFactors(canvas);
    const radius = this.scale * SOURCE_RING_RADIUS;
    const lineWidth = this.ringLineWidth;

    this.results.forEach((source, i) => {
      const position = this.sourcePosition(source);
      if (!position) {
        return;
      }

      // Retained from the original: drawCircles wraps longitude into [0, 360)
      // before projecting, the hit test does not. Identical for catalogue
      // values, which are already in range.
      const { x, y } = this.projectSource(
        position.lon % 360, position.lat, source.galLat, canvas, scaleX, scaleY,
      );

      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.strokeStyle = i === this.selectedSourceIndex ? '#ff3b30' : '#ffffff';
      context.lineWidth = lineWidth;
      context.stroke();
      context.closePath();
    });
  }

  /**
   * Draw the click marker, and refresh the sky coordinates it reports.
   *
   * The marker is stored in image space, so re-deriving its canvas position
   * here is what makes it stick through pan, zoom and resize. Re-deriving the
   * coordinates also keeps the Query readout honest when the RA/Dec sliders
   * move, which previously left it stale.
   */
  private refreshMarker(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
    if (!this.marker) {
      return;
    }

    const x = this.canvasXOffset + this.marker.x * this.scale;
    const y = this.canvasYOffset + this.marker.y * this.scale;

    this.selectedCoordinates = this.skyFromCanvas(x, y);

    context.beginPath();
    context.moveTo(x - MARKER_ARM, y);
    context.lineTo(x + MARKER_ARM, y);
    context.moveTo(x, y - MARKER_ARM);
    context.lineTo(x, y + MARKER_ARM);

    // Black underlay then white on top, so the marker reads against both a
    // bright source and a blank (white) region of the map.
    context.lineCap = 'round';
    context.strokeStyle = '#000000';
    context.lineWidth = 3.5;
    context.stroke();
    context.strokeStyle = '#ffffff';
    context.lineWidth = 1.5;
    context.stroke();
    context.closePath();
  }

  // ---------------------------------------------------------------------------
  // Pointer interaction: pan, zoom, select
  // ---------------------------------------------------------------------------

  /** Pointer position in canvas backing-store coordinates. */
  private pointerToCanvas(event: MouseEvent, canvas: HTMLCanvasElement): ImagePoint {
    const rect = canvas.getBoundingClientRect();
    const { scaleX, scaleY } = this.canvasScaleFactors(canvas);
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  private handlePointerDown(event: PointerEvent): void {
    if (!this.canvas || !this.fitsLoaded) {
      return;
    }

    this.pointerDownAt = this.pointerToCanvas(event, this.canvas);
    this.panStart = { x: this.panX, y: this.panY };
    this.isPanning = false;
    this.canvas.setPointerCapture(event.pointerId);
  }

  private handlePointerMove(event: PointerEvent): void {
    if (!this.canvas) {
      return;
    }

    if (this.pointerDownAt && this.panStart) {
      const current = this.pointerToCanvas(event, this.canvas);
      const dx = current.x - this.pointerDownAt.x;
      const dy = current.y - this.pointerDownAt.y;

      if (this.isPanning || Math.hypot(dx, dy) > CLICK_SLOP) {
        this.isPanning = true;
        this.panX = this.panStart.x + dx;
        this.panY = this.panStart.y + dy;
        this.composeFrame();
      }
    }

    // Read the coordinates *after* any pan has been applied. Reading first used
    // the previous frame's offsets, so the readout drifted while dragging even
    // though panning does not move the image relative to the sky - only the
    // RA/Dec sliders do that.
    this.displayCoordinates(event);
  }

  private handlePointerUp(event: PointerEvent): void {
    if (!this.canvas || !this.pointerDownAt) {
      return;
    }

    this.canvas.releasePointerCapture?.(event.pointerId);

    const wasPanning = this.isPanning;
    const pressedAt = this.pointerDownAt;

    this.pointerDownAt = null;
    this.panStart = null;
    this.isPanning = false;

    if (!wasPanning) {
      this.selectAt(pressedAt.x, pressedAt.y);
    }
  }

  /** Wheel zooms about the pointer, so the feature under the cursor stays put. */
  private handleWheel(event: WheelEvent): void {
    if (!this.canvas || !this.fitsLoaded) {
      return;
    }

    event.preventDefault();

    const canvas = this.canvas;
    const pointer = this.pointerToCanvas(event, canvas);

    // Image point currently under the cursor.
    const imgX = (pointer.x - this.canvasXOffset) / this.scale;
    const imgY = (pointer.y - this.canvasYOffset) / this.scale;

    const factor = Math.exp(-event.deltaY * 0.0015);
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.zoomScale * factor));
    if (nextZoom === this.zoomScale) {
      return;
    }

    this.zoomScale = nextZoom;
    this.zoomLevel = nextZoom * 100;

    // Solve for the pan that keeps (imgX, imgY) under the cursor.
    const nextScale = this.baseScale * nextZoom;
    this.panX = pointer.x - imgX * nextScale - (canvas.width - this.naxis1 * nextScale) / 2;
    this.panY = pointer.y - imgY * nextScale - (canvas.height - this.naxis2 * nextScale) / 2;

    this.composeFrame();
  }

  /** Return to the initial framing. */
  resetView(): void {
    this.panX = 0;
    this.panY = 0;
    this.zoomLevel = 100;
    this.zoomScale = 1;
    this.composeFrame();
  }

  /** Select the source at a canvas point, if any, and place the marker. */
  private selectAt(mouseX: number, mouseY: number): void {
    if (!this.canvas || !this.wcsInfo) {
      return;
    }

    const canvas = this.canvas;
    const { scaleX, scaleY } = this.canvasScaleFactors(canvas);
    const radius = this.scale * SOURCE_RING_RADIUS;

    let matchIndex = -1;

    this.results.forEach((source, i) => {
      const position = this.sourcePosition(source);
      if (!position) {
        return;
      }

      const { x, y } = this.projectSource(
        position.lon, position.lat, source.galLat, canvas, scaleX, scaleY,
      );

      const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));
      if (distance <= radius) {
        matchIndex = i;
      }
    });

    // Remember where the user clicked in image space, so the marker survives
    // pan, zoom and resize rather than being wiped by the next repaint.
    this.marker = {
      x: (mouseX - this.canvasXOffset) / this.scale,
      y: (mouseY - this.canvasYOffset) / this.scale,
    };

    if (matchIndex >= 0) {
      this.selectSource(this.results[matchIndex], matchIndex);
    } else {
      this.clearSelection();
    }

    this.composeFrame();
  }

  private selectSource(source: CatalogSource, index: number): void {
    this.selectedSourceSubject.next(source.identifier);
    this.selectedSourceIndex = index;

    // results and hiddenResults are built from the same response array, so the
    // index is the reliable join. (getScatterData used to look the fluxes up by
    // id while the fit used the index; they agree except when a source's id is
    // falsy, where the id lookup silently found nothing.)
    const sourceFluxes = this.hiddenResults[index];
    if (!sourceFluxes) {
      return;
    }

    const fluxes = extractFluxes(sourceFluxes);
    const series = buildScatterSeries(fluxes, this.targetFreq);
    applyFitToSeries(series.points, fitSpectralIndex(fluxes));

    this.averageFluxSubject.next(series.averageFlux === null ? null : series.averageFlux.toFixed(3));

    this.params = [{
      targetFreq: this.targetFreq,
      catalog: source.catalog,
      identifier: source.identifier,
    }];
    this.hcservice.setParams(this.params);
    this.hcservice.setData(series.points);
    this.hcservice.setChartTitle('Results for Radio Source' + source.catalog + source.identifier);
  }

  private clearSelection(): void {
    this.selectedSourceIndex = -1;
    this.averageFluxSubject.next(null);
    this.selectedSourceSubject.next(null);
    this.params = [{ targetFreq: null, catalog: '', identifier: '' }];
    this.hcservice.setParams(this.params);
    this.hcservice.setChartTitle('Results for Radio Source');
    this.hcservice.resetData();
    this.hcservice.resetChartInfo();
  }


  // ---------------------------------------------------------------------------
  // Coordinate readout
  // ---------------------------------------------------------------------------

  /**
   * Sky coordinates for a point in canvas backing-store space.
   *
   * Goes through the image row/column rather than canvas Y, which is what makes
   * the result independent of pan: the same image pixel reports the same
   * coordinates no matter where it has been dragged to. Only the RA/Dec sliders
   * are meant to move the coordinate grid relative to the image.
   *
   * This used to invert canvas Y before subtracting canvasYOffset, while pan was
   * added to that offset in un-inverted space - so a vertical drag of d moved
   * the Dec argument by 2d instead of leaving it alone.
   */
  private skyFromCanvas(canvasX: number, canvasY: number): SkyCoordinates | null {
    if (!this.canvas) {
      return null;
    }

    const world = this.getWorldCoordinates(
      canvasX - this.canvasXOffset,
      canvasY - this.canvasYOffset,
      this.scale,
    );

    if (!world) {
      return null;
    }

    world.dec -= this.sliderYOffset;
    world.ra += this.sliderXOffset;
    if (world.ra > 360) {
      world.ra %= 360;
    }
    world.ra = ((world.ra - this.ra!) / Math.cos((Math.PI * world.dec) / 180)) + this.ra!;

    return world;
  }

  displayCoordinates(event: MouseEvent): void {
    if (!this.canvas || !this.wcsInfo) {
      return;
    }

    const point = this.pointerToCanvas(event, this.canvas);
    const worldCoordinates = this.skyFromCanvas(point.x, point.y);

    if (!worldCoordinates) {
      console.warn('Coordinates out of bounds');
      return;
    }

    this.currentCoordinates = worldCoordinates;
  }

  /**
   * Sky coordinates for an offset from the drawn image's top-left corner.
   *
   * @param x  canvas x minus canvasXOffset
   * @param y  canvas y minus canvasYOffset (NOT pre-inverted)
   * @param scale  display scale, canvas pixels per image pixel
   *
   * The `- 1` on the row is not a fudge: it is what the previous
   * invert-then-flip-again formulation evaluates to once the algebra is worked
   * through at zero pan, so the reported values are unchanged at the default
   * view. Keeping it means this fix does not silently move the readout.
   */
  getWorldCoordinates(x: number, y: number, scale: number): SkyCoordinates | null {
    if (!this.wcsInfo) {
      console.error('WCS information not available');
      return null;
    }

    const { crpix1, crpix2, crval1, crval2, cdelt1, cdelt2 } = this.wcsInfo;

    // Column and row of the drawn raster, top-down. Both are pan-invariant
    // because the offsets they subtract carry the pan.
    const imageColumn = x / scale;
    const imageRow = y / scale;

    return {
      ra: cdelt1 * (imageColumn - crpix1) + crval1,
      dec: crval2 - cdelt2 * ((imageRow - 1) - crpix2),
    };
  }

  convertCoordinates(ra: number, dec: number, isGalactic: string, useBreak: boolean = true): string {
    const separator = useBreak ? '<br>' : ', ';

    if (isGalactic == 'galactic') {
      // Already in degrees; no conversion needed.
      return `Glon: ${ra.toFixed(2)}°${separator}Glat: ${dec.toFixed(2)}°`;
    }

    return `RA: ${this.service.convertToHMS(ra)}${separator}Dec: ${this.service.convertToDMS(dec)}`;
  }

  querySIMBAD(): void {
    if (!this.selectedCoordinates || !this.wcsInfo) {
      return;
    }

    const frame = this.rccords === 'equatorial' ? 'Ecl' : this.rccords === 'galactic' ? 'Gal' : null;
    if (frame === null) {
      return;
    }

    const definedFrames = frame === 'Ecl' ? 'ICRS-J2000' : 'none';
    const searchRadius = Math.ceil(0.50 * this.beamWidth * 60);

    const url = `https://simbad.cds.unistra.fr/simbad/sim-coo?Coord=${this.selectedCoordinates.ra}d${this.selectedCoordinates.dec}d`
      + `&CooFrame=${frame}&CooEpoch=2000&CooEqui=2000&CooDefinedFrames=${definedFrames}`
      + `&Radius=${searchRadius}&Radius.unit=arcmin&submit=submit+query&CoordList=`;

    window.open(url, '_blank');
  }

  // ---------------------------------------------------------------------------
  // Export
  // ---------------------------------------------------------------------------

  noUpload(): void {
    this.dialog.open(DialogContent, {
      data: { message: 'Please upload a Radio Cartographer FITS file!' },
      width: '300px',
    });
  }

  saveCanvas(): void {
    if (!this.canvas) {
      return;
    }

    // Reset to the default framing before capture, so the export is not
    // cropped by whatever pan/zoom the user happens to be inspecting with.
    this.resetView();

    this.honorCodeService.honored()
      .pipe(takeUntil(this.destroy$))
      .subscribe((name: string) => {
        if (this.canvas) {
          this.chartService.saveCanvasOffline(this.canvas, 'radio-search', name);
        }
      });
  }

  saveGraph(): void {
    this.honorCodeService.honored()
      .pipe(takeUntil(this.destroy$))
      .subscribe((name: string) => {
        this.chartService.saveImageHighChartOffline(this.hcservice.getHighChart(), 'radio-search', name);
      });
  }
}
