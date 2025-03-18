import { AfterViewInit, HostListener, Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { RadioSearchHighChartService, RadioSearchService } from './radiosearch.service'; // Import the service
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HonorCodePopupService } from '../shared/honor-code-popup/honor-code-popup.service';
import { HonorCodeChartService } from '../shared/honor-code-popup/honor-code-chart.service';
import { FittingResult } from './radiosearch.service.util';
import { RadioSearchDataDict } from './radiosearch.service.util';
import { BehaviorSubject } from 'rxjs';
import { getDateString } from "../shared/charts/utils";
import * as fitsjs from 'fitsjs';
import { image } from 'html2canvas/dist/types/css/types/image';

@Component({
  selector: 'app-radiosearch',
  templateUrl: './radiosearch.component.html',
  styleUrls: ['./radiosearch.component.scss', '../shared/interface/tools.scss'],
})
export class RadioSearchComponent implements AfterViewInit {
  fitsFileName: string | undefined;
  ra: number | undefined;
  dec: number | undefined;
  width: number | undefined;
  height: number | undefined;

  sliderXOffset: number = 0;
  sliderYOffset: number = 0;
  canvasXOffset: number = 0;
  canvasYOffset: number = 0;
  scaledWidth: number = 0;
  scaledHeight: number = 0;
  scale: number = 1;

  naxis1: number = 100;
  naxis2: number = 100;
  rccords: string | undefined;
  pixelOffset: number = 0;

  fitsLoaded = false;
  canvas: HTMLCanvasElement | null = null;
  displayData: ImageData | null = null;
  scaledData: any;
  maxValue: number = 0.5;
  targetFreq: number = 1.5;
  lowerFreq: number = 1.4;
  upperFreq: number = 1.6;
  private averageFluxSubject = new BehaviorSubject<any>(null);
  averageFlux$ = this.averageFluxSubject.asObservable();
  zoomLevel: number = 100;
  zoomScale: number = 1;
  beamWidth: number = 1;
  arrayBuffer: ArrayBuffer | null = null;
  header: fitsjs.astro.FITS.Header | null = null;

  dataSource = new MatTableDataSource<any>([]);  // Initialize the data source
  results: any = [];
  hiddenResults: any = [];
  private selectedSourceSubject = new BehaviorSubject<any>(null); // Replace `any` with the actual type.
  selectedSource$ = this.selectedSourceSubject.asObservable();
  wcsInfo: { crpix1: number, crpix2: number, crval1: number, crval2: number, cdelt1: number, cdelt2: number } | null = null;
  currentCoordinates: { ra: number, dec: number } | null = null;
  selectedCoordinates: { ra: number, dec: number} | null = null;
  params: { targetFreq: number, catalog: string, identifier: string }[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fitsCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileDropZone', { static: false }) fileDropZoneRef!: ElementRef<HTMLDivElement>;
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.confirmExit);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.canvas = this.canvasRef.nativeElement;

    if (!this.canvas) {
      console.error('Canvas element is not found.');
    }

    if (this.canvas) {
      this.canvas.addEventListener('click', (event: MouseEvent) => {
        this.grabCoordinatesOnClick(event);
      });
    }

    this.canvas.addEventListener('mousemove', (event) => {
      this.displayCoordinates(event);
    });

    this.fileDropZoneRef.nativeElement.addEventListener('dragenter', () => this.onDragEnter());
    this.fileDropZoneRef.nativeElement.addEventListener('dragleave', () => this.onDragLeave());
    this.fileDropZoneRef.nativeElement.addEventListener('drop', (event: DragEvent) => this.onFileDrop(event));
  }

  constructor(
    private service: RadioSearchService, 
    private hcservice: RadioSearchHighChartService,
    private honorCodeService: HonorCodePopupService,
    private chartService: HonorCodeChartService,
    private dialog: MatDialog
  ) {}


  @HostListener('window:beforeunload', ['$event'])
  confirmExit(event: BeforeUnloadEvent): void {
    if (this.fitsLoaded) { 
      event.preventDefault();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent): void {
    if (this.scaledData) {
      this.displayFitsImage(this.scaledData, this.naxis1, this.naxis2);
    }
  }




  // Handle drag enter event (adds shake class)
  onDragEnter(): void {
    this.fileDropZoneRef.nativeElement.classList.add('shake');
  }

  
  // Handle drag leave event (removes shake class)
  onDragLeave(): void {
    this.fileDropZoneRef.nativeElement.classList.remove('shake');
  }


  onFileDrop(event: DragEvent): void {
    this.deleteFITS();
    event.preventDefault();
    this.fileDropZoneRef.nativeElement.classList.remove('shake');

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.fitsFileName = file.name;
      this.processFitsFile(file);
    }
  }


  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Required to allow dropping
    event.stopPropagation(); // Prevents bubbling issues
    this.fileDropZoneRef.nativeElement.classList.add('shake'); // Keep shake active
  }


  onFileSelected(event: Event): void {
    this.fitsLoaded = true;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fitsFileName = file.name;
      this.processFitsFile(file);
    }
  }


  onFileUnselected(event: Event): void {
    this.fitsLoaded = false;
  }


  // Function to grab the x and y coordinates when the mouse is clicked
  grabCoordinatesOnClick(event: MouseEvent): void {
    if (!this.canvas || !this.wcsInfo) return;

    // Get the bounding box of the canvas (CSS size)
    const rect = this.canvas.getBoundingClientRect();

    // Normalize mouse coordinates from CSS size to actual size
    const scaleX = this.canvas.width / rect.width;  // Scale factor in X
    const scaleY = this.canvas.height / rect.height; // Scale factor in Y
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    // Adjust for image centering inside the canvas
    const adjustedX = mouseX - this.canvasXOffset;
    const adjustedY = mouseY - this.canvasYOffset;

    // Use WCS info for RA/Dec conversion
    const { crpix1, crpix2, crval1, crval2, cdelt1, cdelt2 } = this.wcsInfo;

    // Map mouse position to world coordinates
    const unscaledX = adjustedX / this.scale;
    const unscaledY = adjustedY / this.scale;

    const flippedY = this.naxis2 - unscaledY - 1; // Flip Y-axis for FITS image storage

    // Loop through sources to check if the click is inside any circle
    let selectedSource: any = null;

    let raList: number[] = [];
    let decList: number[] = [];

    // Handle equatorial or galactic coordinates
    if (this.rccords === 'equatorial') {
        raList = this.results.map((source: any) => source.ra);
        decList = this.results.map((source: any) => source.dec);
    } else if (this.rccords === 'galactic') {
        raList = this.results.map((source: any) => source.galLong);
        decList = this.results.map((source: any) => source.galLat);
    }

    // Circle radius in pixels
    const radius = this.scale * 22;

    this.redrawCircles();
    this.results.forEach((source: any, i: number) => {
        let sourceRA = raList[i];
        let sourceDec = decList[i];

        let pixelX = 1;
        let pixelY = 1;
        if (crval1 > 360 && sourceRA < 180) {
          pixelX = ((sourceRA + 360 - (crval1)) / cdelt1) + crpix1;
          pixelY = ((crval2 - sourceDec) / cdelt2) + crpix2;
        } else {
          pixelX = ((sourceRA - (crval1)) / cdelt1) + crpix1;
          pixelY = ((crval2 - sourceDec) / cdelt2) + crpix2;
        }

        // Convert slider offsets from degrees to pixels using WCS scale
        const pixelXOffset = (this.sliderXOffset / Math.abs(cdelt1)) * this.zoomScale; // Degrees to pixels (X-axis)
        const pixelYOffset = this.sliderYOffset / Math.abs(cdelt2); // Degrees to pixels (Y-axis)

        // Apply scaling and offsets for image centering
        let scaledX = (pixelX) * this.scale + this.canvasXOffset;
        let scaledY = (pixelY - pixelYOffset) * this.scale + this.canvasYOffset;

        scaledX = (this.canvas!.width / 2) + (scaledX - (this.canvas!.width / 2)) * Math.cos((source.galLat * Math.PI) / 180) + pixelXOffset;

        // Calculate distance from mouse to circle center
        const distance = Math.sqrt(
            Math.pow(mouseX - scaledX, 2) + Math.pow(mouseY - scaledY, 2)
        );

        if (distance <= radius && this.canvas !== null) {
            selectedSource = this.results[i];
            this.selectedSourceSubject.next(selectedSource.identifier);

            const context = this.canvas.getContext('2d');
            if (context) {
                // Redraw all circles first
                this.redrawCircles();

                // Highlight the selected circle
                context.beginPath();
                context.arc(
                    scaledX,
                    scaledY,
                    radius,
                    0,
                    2 * Math.PI
                );
                context.strokeStyle = '#ff0000';
                context.lineWidth = 1 + (3 - 1) * ((this.zoomScale - 0.1) / (1 - 0.1));
                context.stroke();
                context.closePath();
            }

            // Perform source processing
            const scatterData = this.getScatterData(selectedSource.id);
            const fit = this.performFitting(this.hiddenResults, i);
            const slope = fit?.slope;
            const intercept = fit?.intercept;

            if (slope !== undefined && intercept !== undefined) {
                scatterData.forEach((dataPoint: any) => {
                    const frequency = dataPoint.frequency;
                    if (frequency !== null) {
                        const logFrequency = Math.log10(frequency);
                        const logFluxFit = slope * logFrequency + intercept;
                        dataPoint.flux_fit = Math.pow(10, logFluxFit);
                    }
                });
            }

            this.params = [{ targetFreq: this.targetFreq, catalog: selectedSource.catalog, identifier: selectedSource.identifier}];
            this.hcservice.setParams(this.params);
            this.hcservice.setData(scatterData);
            this.hcservice.setChartTitle('Results for Radio Source ' + selectedSource.catalog + selectedSource.identifier);
        }
    });

    const context = this.canvas.getContext('2d');
    this.selectedCoordinates = this.currentCoordinates;
    if (context) {
        const crossSize = 10 * this.zoomScale;

        context.beginPath();
        context.strokeStyle = '#ff0000';
        context.lineWidth = 2;

        context.moveTo(mouseX - crossSize, mouseY);
        context.lineTo(mouseX + crossSize, mouseY);

        context.moveTo(mouseX, mouseY - crossSize);
        context.lineTo(mouseX, mouseY + crossSize);

        context.stroke();
        context.closePath();
    }
  }


  queryCoordinatesOnClick(event: MouseEvent): void {
    if (!this.canvas || !this.wcsInfo) return;

    // Get the bounding box of the canvas (CSS size)
    const rect = this.canvas.getBoundingClientRect();

    // Normalize mouse coordinates from CSS size to actual size
    const scaleX = this.canvas.width / rect.width; 
    const scaleY = this.canvas.height / rect.height;
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    const crossSize = 10 * this.zoomScale;

    this.displayFitsImage(this.scaledData, this.naxis1, this.naxis2);
    this.selectedCoordinates = this.currentCoordinates;

    const context = this.canvas.getContext('2d');
    if (context) {
      context.beginPath();
      context.strokeStyle = '#ff0000';
      context.lineWidth = 2;

      context.moveTo(mouseX - crossSize, mouseY);
      context.lineTo(mouseX + crossSize, mouseY);

      context.moveTo(mouseX, mouseY - crossSize);
      context.lineTo(mouseX, mouseY + crossSize);

      context.stroke();
      context.closePath();
    }
  }


  querySIMBAD() {
    if (this.selectedCoordinates && this.wcsInfo) {
      if (this.rccords === "equatorial") {
        const url = `https://simbad.cds.unistra.fr/simbad/sim-coo?Coord=${this.selectedCoordinates.ra}d${this.selectedCoordinates.dec}d&CooFrame=Ecl&CooEpoch=2000&CooEqui=2000&CooDefinedFrames=ICRS-J2000&Radius=${0.30 * this.beamWidth * 60}&Radius.unit=arcmin&submit=submit+query&CoordList=`;
        window.open(url, "_blank");
      } else if (this.rccords === "galactic") {
        const url = `https://simbad.cds.unistra.fr/simbad/sim-coo?Coord=${this.selectedCoordinates.ra}d${this.selectedCoordinates.dec}d&CooFrame=Gal&CooEpoch=2000&CooEqui=2000&CooDefinedFrames=none&Radius=${0.30 * this.beamWidth * 60}&Radius.unit=arcmin&submit=submit+query&CoordList=`;
        window.open(url, "_blank");
      }
    }
  }
  

  convertCoordinates(ra: number, dec: number, isGalactic: string, useBreak: boolean = true): string {
    const separator = useBreak ? '<br>' : ', ';
    
    if (isGalactic == 'galactic') {
      // Convert Galactic Latitude and Longitude to degrees (no further conversion needed since they're already in degrees)
      return `Glon: ${ra.toFixed(2)}°${separator}Glat: ${dec.toFixed(2)}°`;
    } else {

      const raHMS = this.service.convertToHMS(ra);
      const decDMS = this.service.convertToDMS(dec); 

      return `RA: ${raHMS}${separator}Dec: ${decDMS}`;
    }
  }


  drawCircles(results: any[], scale: number, offsetX: number, offsetY: number): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (!context || !canvas || !this.wcsInfo) {
        console.error('Canvas context or WCS info is not initialized.');
        return;
    }

    // Use WCS information from wcsInfo
    const { crpix1, crpix2, crval1, crval2, cdelt1, cdelt2 } = this.wcsInfo;

    // Convert slider offsets from degrees to pixels using WCS scale
    let pixelXOffset = (this.sliderXOffset / Math.abs(cdelt1)) * this.zoomScale; // Degrees to pixels (X-axis)
    let pixelYOffset = this.sliderYOffset / Math.abs(cdelt2); // Degrees to pixels (Y-axis)

    // Iterate through each source
    results.forEach(source => {
        let ra: number, dec: number;
  
        // Determine coordinate system
        if (this.rccords === 'equatorial') {
            ra = source.ra%360;       // Equatorial coordinates
            dec = source.dec;
        } else if (this.rccords === 'galactic') {
            ra = source.galLong%360;
            dec = source.galLat;
        } else {
            console.error('Unknown coordinate system:', this.rccords);
            return;
        }
        
        let pixelX = 1;
        let pixelY = 1;
        if (crval1 > 360 && ra < 180) {
          pixelX = ((ra + 360 - (crval1)) / cdelt1) + crpix1;
          pixelY = ((crval2 - dec) / cdelt2) + crpix2;
        } else {
          pixelX = ((ra - (crval1)) / cdelt1) + crpix1;
          pixelY = ((crval2 - dec) / cdelt2) + crpix2;
        }

        // Apply scaling and offsets (use pixel offsets from degrees!)
        let scaledX = (pixelX) * scale + this.canvasXOffset; // Degrees applied
        let scaledY = (pixelY - pixelYOffset) * scale + this.canvasYOffset; // Degrees applied

        scaledX = (canvas.width / 2) + (scaledX - (canvas.width / 2)) * Math.cos((source.galLat * Math.PI) / 180) + pixelXOffset;
        console.log(scaledX,scaledY);
        // Draw the circle
        context.beginPath();
        context.arc(
            scaledX,
            scaledY,
            scale * 22, // Radius of the circle
            0,
            2 * Math.PI
        );
        context.strokeStyle = '#ffffff'; // Ring color
        context.lineWidth = 1 + (3 - 1) * ((this.zoomScale - 0.1) / (1 - 0.1));
        context.stroke();
        context.closePath();
    });
  }  


  // Redraw the image and then the circles without clearing the image
  redrawCircles(): void {
    if (!this.canvas) {
        console.error('Canvas element is not available.');
        return;
    }

    const context = this.canvas.getContext('2d');
    if (!context) {
        console.error('Canvas context is not available.');
        return;
    }

    // Step 1: Clear the entire canvas
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Step 2: Redraw the FITS image
    this.displayFitsImage(this.scaledData, this.naxis1, this.naxis2);
  }


  displayCoordinates(event: MouseEvent): void {
    if (!this.canvas || !this.wcsInfo) return;

    const rect = this.canvas.getBoundingClientRect(); // Get bounding rectangle

    const scaleX = this.canvas.width / rect.width;  // Scale factor in X
    const scaleY = this.canvas.height / rect.height; // Scale factor in Y
    
    // Normalize mouse coordinates from CSS size to actual size
    const x = (event.clientX - rect.left) * scaleX;
    
    // **Invert Y-axis** relative to the canvas height
    const y = (this.canvas.height - (event.clientY - rect.top) * scaleY);
    
    // Adjust for image centering inside the canvas
    const adjustedX = x - this.canvasXOffset; // Remove horizontal centering offset
    const adjustedY = y - this.canvasYOffset; // Remove vertical centering offset

    const worldCoordinates = this.getWorldCoordinates(adjustedX, adjustedY, this.scale);

    if (worldCoordinates) {
        worldCoordinates.dec -= this.sliderYOffset;

        if (worldCoordinates.ra > 360) {
          worldCoordinates.ra %= 360;
        }

        worldCoordinates.ra = ((worldCoordinates.ra - this.ra! + this.sliderXOffset) / (Math.cos((Math.PI * worldCoordinates.dec) / 180))) + (this.ra!);

        this.currentCoordinates = worldCoordinates;

    } else {
        console.warn('Coordinates out of bounds');
    }
  }


  getWorldCoordinates(x: number, y: number, scale: number): { ra: number, dec: number } | null {
    // Ensure WCS information is available
    if (!this.wcsInfo) {
        console.error('WCS information not available');
        return null;
    }

    // Extract WCS information
    const { crpix1, crpix2, crval1, crval2, cdelt1, cdelt2 } = this.wcsInfo;

    const unscaledX = x / scale; 
    const unscaledY = y / scale;

    // Step 2: Flip Y-axis to match FITS image orientation (bottom-to-top storage)
    const flippedY = this.naxis2 - unscaledY - 1;

    // Step 3: Convert unscaled pixel coordinates to RA and Dec
    let ra = cdelt1 * (unscaledX - crpix1) + crval1;
    let dec = crval2 - cdelt2 * (flippedY - crpix2);

    // Return the calculated RA and Dec
    return { ra, dec }; 
  }


  processFitsFile(file: File): Promise<void> {
    return new Promise((resolve) => {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        this.arrayBuffer = e.target?.result as ArrayBuffer;
        if (!this.arrayBuffer) {
          console.error('Failed to read file as ArrayBuffer.');
          resolve();
          return;
        }
  
        try {
          // Parse FITS header
          const dataUnit = new fitsjs.astro.FITS.DataUnit(null, this.arrayBuffer);
          const headerBlock = new TextDecoder().decode(dataUnit.buffer!.slice(0, 5760));
          this.header = new fitsjs.astro.FITS.Header(headerBlock);
  
          // Extract header values
          this.naxis1 = this.header.get('NAXIS1');
          this.naxis2 = this.header.get('NAXIS2');
          this.rccords = this.header.get('RCCORDS');
          this.ra = this.header.get('CENTERRA');
          this.ra! %= 360;

          this.dec = this.header.get('CENTERDE');
          const bitpix = this.header.get('BITPIX');
          const bscale = this.header.get('BSCALE') || 1;
          const bzero = this.header.get('BZERO') || 0;
          this.lowerFreq = this.header.get('RCMINFQ');
          this.upperFreq = this.header.get('RCMAXFQ');
          this.targetFreq = ((this.lowerFreq + this.upperFreq) / 2);
          this.beamWidth = this.header.get('BEAM');

          if (!this.naxis1 || !this.naxis2 || !bitpix) {
            throw new Error('Invalid or missing header values (NAXIS1, NAXIS2, BITPIX).');
          }
  
          // Calculate data offset and pixel array size
          const headerLength = this.service.getHeaderLength(this.arrayBuffer) + 2880;
          const dataOffset = headerLength;
          const bytesPerPixel = Math.abs(bitpix) / 8;
          const rowLength = this.naxis1 * bytesPerPixel;
  
          const dataView = new DataView(this.arrayBuffer, dataOffset);
          const pixelArray = new Float64Array(this.naxis1 * this.naxis2);
  
          // Read pixel data based on BITPIX
          const swapEndian = fitsjs.astro.FITS.DataUnit.swapEndian;
          let readMethod: (byteOffset: number, littleEndian?: boolean) => number;
  
          switch (bitpix) {
            case 8:
              for (let y = 0; y < this.naxis2; y++) {
                const rowOffset = y * rowLength;
                for (let x = 0; x < this.naxis1; x++) {
                  pixelArray[y * this.naxis1 + x] = dataView.getUint8(rowOffset + x);
                }
              }
              break;
  
            case 16:
              readMethod = dataView.getInt16.bind(dataView);
              for (let y = 0; y < this.naxis2; y++) {
                const rowOffset = y * rowLength;
                for (let x = 0; x < this.naxis1; x++) {
                  pixelArray[y * this.naxis1 + x] = swapEndian.I(readMethod(rowOffset + x * 2, false));
                }
              }
              break;
  
            case 32:
              readMethod = dataView.getInt32.bind(dataView);
              for (let y = 0; y < this.naxis2; y++) {
                const rowOffset = y * rowLength;
                for (let x = 0; x < this.naxis1; x++) {
                  pixelArray[y * this.naxis1 + x] = swapEndian.J(readMethod(rowOffset + x * 4, false));
                }
              }
              break;
  
            case -32:
              readMethod = dataView.getFloat32.bind(dataView);
              for (let y = 0; y < this.naxis2; y++) {
                const rowOffset = y * rowLength;
                for (let x = 0; x < this.naxis1; x++) {
                  pixelArray[y * this.naxis1 + x] = readMethod(rowOffset + x * 4, false);
                }
              }
              break;
  
            case -64:
              readMethod = dataView.getFloat64.bind(dataView);
              for (let y = 0; y < this.naxis2; y++) {
                const rowOffset = y * rowLength;
                for (let x = 0; x < this.naxis1; x++) {
                  pixelArray[y * this.naxis1 + x] = readMethod(rowOffset + x * 8, false);
                }
              }
              break;
  
            default:
              throw new Error(`Unsupported BITPIX value: ${bitpix}`);
          }
  
          // Scale pixel values using BSCALE and BZERO
          this.scaledData = pixelArray.map((value) => (isNaN(value) ? 0 : bscale * value + bzero));
          this.fitsLoaded = true;
  
          // Extract WCS (World Coordinate System) info
          this.wcsInfo = {
            crpix1: parseFloat(this.header.get('CRPIX1')) || 0,
            crpix2: parseFloat(this.header.get('CRPIX2')) || 0,
            crval1: parseFloat(this.header.get('CRVAL1')) || 0,
            crval2: parseFloat(this.header.get('CRVAL2')) || 0,
            cdelt1: parseFloat(this.header.get('CDELT1')) || 1,
            cdelt2: parseFloat(this.header.get('CDELT2')) || 1,
          };
  
          this.width = Math.abs(this.wcsInfo.cdelt1) * this.naxis1;
          this.height = Math.abs(this.wcsInfo.cdelt2) * this.naxis2;
  
          this.searchCatalog(); // Start a catalog search
  
        } catch (error) {
          console.error('Error processing FITS file:', error);
          this.deleteFITS();
        }
  
        resolve();
      };
  
      reader.readAsArrayBuffer(file);
    });
  }  


  saveModifiedFITS(): void {
    try {
      if (this.arrayBuffer && this.header && this.ra && this.dec && this.wcsInfo) {
        let updatedHeader = this.header.block
          .replace(/CENTERRA= *[\d.-]+/, `CENTERRA= ${String(this.ra + this.sliderXOffset).padStart(20)}`)
          .replace(/CENTERDE= *[\d.-]+/, `CENTERDE= ${String(this.dec - this.sliderYOffset).padStart(20)}`)
          .replace(/CRVAL1  = *[\d.-]+/, `CRVAL1  = ${String(this.wcsInfo.crval1 + this.sliderXOffset).padStart(20)}`)
          .replace(/CRVAL2  = *[\d.-]+/, `CRVAL2  = ${String(this.wcsInfo.crval2 - this.sliderYOffset).padStart(20)}`);

        const headerLength = updatedHeader.length;
  
        const paddingSize = 2880 - (headerLength % 2880);
        updatedHeader = updatedHeader.padEnd(headerLength + paddingSize, ' ');

        const newBuffer = new ArrayBuffer(this.arrayBuffer.byteLength);
        const newView = new Uint8Array(newBuffer);
  
        newView.set(new TextEncoder().encode(updatedHeader), 0);

        const originalView = new Uint8Array(this.arrayBuffer);
        newView.set(
          originalView.slice(updatedHeader.length),
          updatedHeader.length                      
        );

        const fitsBlob = new Blob([newBuffer], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(fitsBlob);
        link.download = 'modified_file.fits';
        link.click();
      }
    } catch (error) {
      console.error('Error saving modified FITS file:', error);
    }
  }  


  searchCatalog(): void {
    if (this.rccords && this.ra && this.dec && this.width && this.height) {
      this.service.fetchRadioCatalog(this.rccords, this.ra, this.dec, this.width, this.height).subscribe(
        (response: any) => {
          const results = response.objects.map((source: any) => ({
            name: source.SIMBAD || 'Unknown',
            id: source.id,
            ra: source.ra,
            dec: source.dec,
            galLat: source.galLat,
            galLong: source.galLong,
            catalog: source.catalog,
            identifier: source.identifier
          }));

          const hidden_results = response.objects.map((source: any) => ({
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

          this.dataSource.data = results;
          this.results = results;

          this.hiddenResults = hidden_results;
          this.displayFitsImage(this.scaledData, this.naxis1, this.naxis2); // Render image
        },
        (error: any) => {
          
          this.displayFitsImage(this.scaledData, this.naxis1, this.naxis2); // Render image
        } 
      );
    } else {
      console.error('RA, Dec, Width, and Height are required!');
      this.deleteFITS();
    }
  }


  updateFitsImage() {
    this.zoomScale = this.zoomLevel / 100;
    this.displayFitsImage(this.scaledData, this.naxis1, this.naxis2);
  }



  displayFitsImage(imageData: number[], width: number, height: number): void {
    const canvas = this.canvasRef.nativeElement;
    if (!canvas) {
        console.error('Canvas element is not initialized.');
        return;
    }

    // Calculate the image's aspect ratio
    const imageAspectRatio = width / height;
    const canvasAspectRatio = canvas.width / canvas.height;

    // Set the canvas size to be square
    const canvasSize = Math.min(canvas.clientWidth, canvas.clientHeight);
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const context = canvas.getContext('2d');
    if (!context) {
        console.error('Failed to get canvas context.');
        return;
    }

    // Calculate scaled width and height to maintain aspect ratio
    let initialScale: number;
    if (imageAspectRatio > canvasAspectRatio) {
        initialScale = canvas.width / width;
    } else {
        initialScale = canvas.height / height;
    }

    // Apply zoom relative to initial scale
    this.scale = initialScale * this.zoomScale;

    // Calculate scaled dimensions
    this.scaledWidth = width * this.scale;
    this.scaledHeight = height * this.scale;

    // Calculate offsets to center the image
    this.canvasXOffset = (canvas.width - this.scaledWidth) / 2;
    this.canvasYOffset = (canvas.height - this.scaledHeight) / 2;

    // Use the dynamic maxValue from the slider
    const max = 1e5;
    const min = 0;

    // Apply the inverse hyperbolic sine scaling and normalize to [0, 255]
    const transformedData = imageData.map((value) => {
        if (isNaN(value) || value > max) return 1;
        return Math.asinh(value); // Apply asinh transformation
    });

    // Normalize the transformed data to [0, 255]
    const normalizedData = transformedData.map((value) => {
        return Math.floor(value * 255);
    });

    const imageDataArray = new Uint8ClampedArray(width * height * 4);

    // Turbo colormap
    function turboColormap(value: number): [number, number, number] {
        const turboRGB: [number, number, number][] = [
            [48, 18, 59], [50, 57, 144], [31, 138, 176], [53, 191, 111],
            [200, 228, 47], [255, 180, 1], [249, 111, 1], [181, 45, 5]
        ];

        value = Math.max(0, Math.min(1, value)); // Clamp between 0 and 1
        const index = Math.floor(value * (turboRGB.length - 1));

        return turboRGB[index];
    }

    // Apply the turbo colormap and create the image data array
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // FITS data is stored bottom-to-top; flip it for canvas
        const flippedY = height - y - 1; // Reverse the row order

        // Calculate the index in the FITS data
        const srcIndex = flippedY * width + x; // FITS source index

        let r, g, b;

        // Handle zero values as white
        if (imageData[srcIndex] === 0) {
            r = 255;
            g = 255;
            b = 255;
        } else {
            // Scale intensity using the inverse hyperbolic sine function
            const intensity = normalizedData[srcIndex];
            const scaledIntensity = (Math.asinh(intensity) / Math.asinh(255)) * this.maxValue;

            // Get the RGB values from the Turbo colormap
            [r, g, b] = turboColormap(scaledIntensity);
        }

        // Assign the RGB values to the image data array
        const dstIndex = (y * width + x) * 4; // Destination index for the canvas
        imageDataArray[dstIndex] = r;         // R
        imageDataArray[dstIndex + 1] = g;     // G
        imageDataArray[dstIndex + 2] = b;     // B
        imageDataArray[dstIndex + 3] = 255;   // A (opacity)
      }
    }

    // Create ImageData object and scale it to preserve aspect ratio
    const imageDataObject = new ImageData(imageDataArray, width, height);

    // Create a temporary canvas to scale the image properly
    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d')!;
    tempCanvas.width = width;
    tempCanvas.height = height;

    tempContext.putImageData(imageDataObject, 0, 0);

    // Draw scaled and centered image onto the main canvas
    context.clearRect(0, 0, canvasSize, canvasSize); // Clear the canvas
    context.drawImage(
        tempCanvas,
        0, 0, width, height,        // Source image
        this.canvasXOffset, this.canvasYOffset,           // Destination position
        this.scaledWidth, this.scaledHeight   // Destination size
    );

    this.drawCircles(this.results, this.scale, this.sliderXOffset + this.canvasXOffset, this.sliderYOffset + this.canvasYOffset);
  }


  performFitting(hiddenResults: any[], sourceIndex: number): FittingResult | null {
    const frequencies: number[] = [38, 159, 178, 750, 1400, 2695, 5000, 8400];

    // Check if the sourceIndex is within bounds
    if (sourceIndex < 0 || sourceIndex >= hiddenResults.length) {
        console.error('Source index out of bounds');
        return null;
    }

    // Get the specific source based on the provided index
    const source = hiddenResults[sourceIndex];

    // Extract fluxes
    const rawFluxes: (number | null)[] = [
        source.MHz38 !== 'Unknown' ? source.MHz38 : null,
        source.MHz159 !== 'Unknown' ? source.MHz159 : null,
        source.MHz178 !== 'Unknown' ? source.MHz178 : null,
        source.MHz750 !== 'Unknown' ? source.MHz750 : null,
        source.L1400 !== 'Unknown' ? source.L1400 : null,
        source.S2695 !== 'Unknown' ? source.S2695 : null,
        source.C5000 !== 'Unknown' ? source.C5000 : null,
        source.X8400 !== 'Unknown' ? source.X8400 : null
    ];

    // Prepare arrays for valid log-log points
    const logFrequencies: number[] = [];
    const logFluxes: number[] = [];

    // Filter valid data points and convert to log-log space
    rawFluxes.forEach((flux: number | null, index: number) => {
        if (flux !== null) {
            logFrequencies.push(Math.log10(frequencies[index])); // Log10 frequency
            logFluxes.push(Math.log10(flux));                    // Log10 flux
        }
    });

    // Perform linear fitting in log-log space
    if (logFrequencies.length > 1 && logFluxes.length > 1) {
        const n = logFrequencies.length;

        // Compute sums required for regression
        const sumX = logFrequencies.reduce((a, b) => a + b, 0);
        const sumY = logFluxes.reduce((a, b) => a + b, 0);
        const sumXY = logFrequencies.reduce((sum, x, i) => sum + x * logFluxes[i], 0);
        const sumX2 = logFrequencies.reduce((sum, x) => sum + x * x, 0);

        // Calculate slope and intercept
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Return results in log-log space
        return { slope, intercept };
    } else {
        console.error('Not enough data for linear fitting');
        return null;
    }
  }


  getScatterData(sourceId: number): RadioSearchDataDict[] {
    const frequencies: number[] = [38, 159, 178, 750, 1400, 2695, 5000, 8400];
    const scatterData: RadioSearchDataDict[] = [];

    // Find the specific source by ID
    const source = this.hiddenResults.find((src: any) => src.id === sourceId);

    if (source) {
        // Create fluxes array from source
        const fluxes: (number | null)[] = [
            source.MHz38 !== 'Unknown' ? source.MHz38 : null,
            source.MHz159 !== 'Unknown' ? source.MHz159 : null,
            source.MHz178 !== 'Unknown' ? source.MHz178 : null,
            source.MHz750 !== 'Unknown' ? source.MHz750 : null,
            source.L1400 !== 'Unknown' ? source.L1400 : null,
            source.S2695 !== 'Unknown' ? source.S2695 : null,
            source.C5000 !== 'Unknown' ? source.C5000 : null,
            source.X8400 !== 'Unknown' ? source.X8400 : null
        ];

        fluxes.forEach((flux: number | null, index: number) => {
            if (flux !== null) {
                scatterData.push({
                    frequency: Number((frequencies[index]).toFixed(3)), // Log frequency
                    flux: Number((flux).toFixed(3)),                   // Log flux
                    flux_fit: Number((flux).toFixed(3))
                });
            }
        });

        const newFrequency = this.targetFreq; // Set your target frequency in Hz

        // Find the closest lower and upper indices relative to newFrequency
        let lowerIndex = -1;
        let upperIndex = -1;

        for (let i = 0; i < frequencies.length; i++) {
          if (fluxes[i] !== null) { // Only consider indices where fluxes are not null
              if (frequencies[i] < newFrequency) {
                  lowerIndex = i; // Update lowerIndex whenever we find a valid lower frequency
              } else if (frequencies[i] >= newFrequency) {
                  upperIndex = i; // Set upperIndex to the first valid frequency greater than or equal to newFrequency
                  break; // Stop as soon as we find the first higher or equal frequency
              }
          }
        }

        // Check if we found valid indices for both lower and upper frequencies
        if (lowerIndex !== -1 && upperIndex !== -1 && fluxes[lowerIndex] !== null && fluxes[upperIndex] !== null) {
            const fluxLower = fluxes[lowerIndex]!;
            const fluxUpper = fluxes[upperIndex]!;
            const freqLower = frequencies[lowerIndex];
            const freqUpper = frequencies[upperIndex];

            // Calculate weights in linear space
            const freqDiff = freqUpper - freqLower; // Difference in linear space
            const weightUpper = (newFrequency - freqLower) / freqDiff;
            const weightLower = 1 - weightUpper;

            // Calculate the average flux in linear space
            const averageFluxLinear = fluxLower * weightLower + fluxUpper * weightUpper;
            this.averageFluxSubject.next(averageFluxLinear.toFixed(3));

            // Add the new point
            scatterData.push({
                frequency: Number((newFrequency).toFixed(3)), // Log of the new frequency
                flux: Number((averageFluxLinear).toFixed(3)), // Log of the averaged flux
                flux_fit: Number((averageFluxLinear).toFixed(3)),
                highlight: true
            });
        }
        else {
          const averageFluxLinear = null;
          this.averageFluxSubject.next(averageFluxLinear);
        }
    }

    return scatterData;
  }
  

  noUpload(): void {
    this.dialog.open(DialogContent, {
      data: { message: "Please upload a Radio Cartographer FITS file!" },
      width: '300px',
    });
  }


  deleteFITS(): void {
    if (this.fitsLoaded == false) { 

    }
    
    this.fitsFileName = undefined;
    this.ra = undefined;
    this.dec = undefined;
    this.width = undefined;
    this.height = undefined;

    this.sliderXOffset = 0;
    this.sliderYOffset = 0;
    this.canvasXOffset = 0;
    this.canvasYOffset = 0;
    this.scaledWidth = 0;
    this.scaledHeight = 0;
    this.scale = 1;

    this.naxis1 = 100;
    this.naxis2 = 100;
    this.pixelOffset = 0;

    this.fitsLoaded = false;
    this.displayData = null;
    this.scaledData = undefined;
    this.maxValue = 0.5;
    this.targetFreq = 1.5;
    this.lowerFreq = 1.4;
    this.upperFreq = 1.6;
    this.zoomLevel = 100;
    this.zoomScale = 1;

    this.dataSource = new MatTableDataSource<any>([]);  // Clear data source
    this.results = [];
    this.hiddenResults = [];
    this.selectedSourceSubject.next(null);
  
    this.wcsInfo = null;
    this.currentCoordinates = null;
    this.selectedCoordinates = null;

    this.hcservice.resetData();
    this.hcservice.resetChartInfo();
    this.hcservice.setChartTitle('Results for Radio Source');
  }
  

  saveCanvas() {
    if (this.canvas) {
      this.zoomLevel = 100;
      this.zoomScale = 1;
      this.displayFitsImage(this.scaledData, this.naxis1, this.naxis2);
      this.honorCodeService.honored().subscribe((name: string) => {
        if (this.canvas) {
          this.chartService.saveCanvasOffline(this.canvas, "radio-search", name);
        }
      })
    }
  }
  

  saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageHighChartOffline(this.hcservice.getHighChart(), "radio-search", name);
    })
  }


  getResults(jobId: number): void {
    this.service.getRadioCatalogResults(jobId)?.subscribe((result: any) => {
    });
  }
}


@Component({
  selector: 'app-dialog-content',
  template: `
    <h1 mat-dialog-title class="warning-title">Warning!</h1>
    <div mat-dialog-content class="warning-content">{{ data.message }}</div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="closeDialog()"
        color="primary" 
        style="border-radius: 3px" 
        mat-raised-button>OK</button>
    </div>
  `,
  styles: [`
    .warning-title {
      text-align: center;
      color: rgb(143, 143, 143);
    }
    .warning-content {
      font-size: 16px;
      padding: 2px;
      justify-content: center; 
      color: rgb(143, 143, 143);
    }
    .dialog-actions {
      display: flex;
      justify-content: center; 
      padding: 7px;
    }
  `]
})
export class DialogContent {
  constructor(
    public dialogRef: MatDialogRef<DialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}