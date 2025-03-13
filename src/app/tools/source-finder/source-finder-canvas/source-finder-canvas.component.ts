import { HostListener, Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import * as fitsjs from 'fitsjs';
import { getNormalizedDate } from 'handsontable/helpers';
import { BehaviorSubject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-source-finder-canvas',
  templateUrl: './source-finder-canvas.component.html',
  styleUrls: ['./source-finder-canvas.component.scss']
})
export class SourceFinderCanvasComponent {
  formGroup: FormGroup;
  private averageFluxSubject = new BehaviorSubject<any>(null);
  averageFlux$ = this.averageFluxSubject.asObservable();

  dataSource = new MatTableDataSource<any>([]); 

  @ViewChild('fitsCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileDropZone', { static: false }) fileDropZoneRef!: ElementRef<HTMLDivElement>;

  constructor() {
    this.formGroup = new FormGroup({
      fitsLoaded: new FormControl(false),
      fitsFileName: new FormControl(null),

      width: new FormControl(null),
      height: new FormControl(null),
      sliderXOffset: new FormControl(0),
      sliderYOffset: new FormControl(0),
      maxValue: new FormControl(0.5),
      scale: new FormControl(1),
      zoomLevel: new FormControl(100),
      zoomScale: new FormControl(1),

      canvasXOffset: new FormControl(0),
      canvasYOffset: new FormControl(0),
      scaledWidth: new FormControl(0),
      scaledHeight: new FormControl(0),

      arrayBuffer: new FormControl(null),
      header: new FormControl(null),
      displayData: new FormControl(null),
      scaledData: new FormControl(null),

      results: new FormArray([]),
    });
  }

  onDragEnter(): void {
    this.fileDropZoneRef.nativeElement.classList.add('shake');
  }

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
      this.formGroup.patchValue({fitsFileName: file.name});
      this.processFitsFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Required to allow dropping
    event.stopPropagation(); // Prevents bubbling issues
    this.fileDropZoneRef.nativeElement.classList.add('shake'); // Keep shake active
  }

  onFileSelected(event: Event): void {
    this.formGroup.patchValue({fitsLoaded: true});
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.formGroup.patchValue({fitsFileName: file.name});
      this.processFitsFile(file);
    }
  }

  onFileUnselected(event: Event): void {
    this.formGroup.patchValue({fitsLoaded: false});
  }


  processFitsFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      this.formGroup.patchValue({arrayBuffer: e.target?.result as ArrayBuffer});
      if (this.formGroup.('arrayBuffer')?.value) {
        console.error('Failed to read file as ArrayBuffer.');
        return;
      }

      try {
        const dataUnit = new fitsjs.astro.FITS.DataUnit(null, this.formGroup.value('arrayBuffer'));
        const headerBlock = new TextDecoder().decode(dataUnit.buffer!.slice(0, 5760));
        const headerInstance = new fitsjs.astro.FITS.Header(headerBlock);
        this.formGroup.patchValue({header: headerInstance});

        const headerLength = this.service.getHeaderLength(this.formGroup.value('arrayBuffer')) + 2880;
        const bytesPerPixel = Math.abs(headerInstance.get('BITPIX')) / 8;
        const rowLength = headerInstance.get('NAXIS1') * bytesPerPixel;

        const dataView = new DataView(this.formGroup.value('arrayBuffer'), headerLength);
        const pixelArray = new Float64Array(headerInstance.get('NAXIS1') * headerInstance.get('NAXIS2'));

        const swapEndian = fitsjs.astro.FITS.DataUnit.swapEndian;
        let readMethod: (byteOffset: number, littleEndian?: boolean) => number;

        // assume pixel array is now defined

        this.formGroup.patchValue({scaledData: pixelArray.map((value) => (isNaN(value) ? 0 : headerInstance.get('BSCALE') * value + headerInstance.get('BZERO')))});
        this.formGroup.patchValue({width: Math.abs(headerInstance.get('CDELT1')) * headerInstance.get('NAXIS1')});
        this.formGroup.patchValue({height: Math.abs(headerInstance.get('CDELT2')) * headerInstance.get('NAXIS2')});

        this.formGroup.patchValue({fitsLoaded: true});

        this.searchCatalog();
        this.displayFitsImage();
        this.drawCircles();

      } catch (error) {
        console.error('Error processing FITS file:', error);
        this.deleteFITS();
      }
    }
  }


  searchCatalog(): void {
    if (this.formGroup.value('fitsLoaded')) {
      const headerInstance = this.formGroup.value('header');
      this.service.fetchRadioCatalog(
        headerInstance.get('RCCORDS'), 
        headerInstance.get('CENTERRA'), 
        headerInstance.get('CENTERDE'), 
        this.formGroup.value('width'), 
        this.formGroup.value('height')
      .subscribe(
        (response: any) => {
          const results = response.objects.map((source: any) => ({
            catalog: source.catalog,
            identifier: source.identifier,
            ra: source.ra,
            dec: source.dec,
            l: source.l,
            b: source.b,

            MHz38: source.MHz38,
            MHz80: source.MHz80,
            MHz159: source.MHz159,
            MHz178: source.MHz178,
            MHz408: source.MHz408,
            MHz635: source.MHz635,
            MHz750: source.MHz750,
            MHz1400: source.MHz1400,
            MHz1410: source.MHz1410,
            MHz2695: source.MHz2695,
            MHz2700: source.MHz2700,
            MHz5000: source.MHz500,
            MHz8400: source.MHz8400,
            MHz22000: source.MHz22000
          }));

          this.formGroup.patchValue({results: results});
        },
      ));
    }
  }


  displayFitsImage(): void {
    const canvas = this.canvasRef.nativeElement

    const imageData = this.formGroup.value('scaledData');
    const width = this.formGroup.value('width');
    const height = this.formGroup.value('height');

    const imageAspectRatio = width / height;
    const canvasAspectRatio = canvas.width / canvas.height;

    const canvasSize = Math.min(canvas.clientWidth, canvas.clientHeight);
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const context = canvas.getContext('2d');
    
    let initialScale: number;
    if (imageAspectRatio > canvasAspectRatio) {
        initialScale = canvas.width / width;
    } else {
        initialScale = canvas.height / height;
    }

    const scale = initialScale * this.formGroup.value('zoomScale');
    this.formGroup.patchValue({scale: scale});

    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    const canvasXOffset = (canvas.width - scaledWidth) / 2;
    const canvasYOffset = (canvas.height - scaledHeight) / 2;
    this.formGroup.patchValue({canvasXOffset: canvasXOffset});
    this.formGroup.patchValue({canvasYOffset: canvasYOffset});

    const max = 1e5;

    const transformedData = imageData.map((value) => {
      return Math.floor(value * 255);
    });

    const normalizedData = transformedData.map((value) => {
      return Math.floor(value * 255);
    });

    const imageDataArray = new Uint8ClampedArray(width * height * 4);

    function turboColormap(value: number): [number, number, number] {
      const turboRGB: [number, number, number][] = [
          [48, 18, 59], [50, 57, 144], [31, 138, 176], [53, 191, 111],
          [200, 228, 47], [255, 180, 1], [249, 111, 1], [181, 45, 5]
      ];

      value = Math.max(0, Math.min(1, value)); 
      const index = Math.floor(value * (turboRGB.length - 1));

      return turboRGB[index];
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const flippedY = height - y - 1;
        const srcIndex = flippedY * width + x;

        let r, g, b;

        if (imageData[srcIndex] === 0) {
          r = 255;
          g = 255;
          b = 255;
        } else {
          const intensity = normalizedData[srcIndex];
          const scaledIntensity = (Math.asinh(intensity) / Math.asinh(255)) * this.formGroup.value('maxValue');

          [r, g, b] = turboColormap(scaledIntensity);
        }

        const dstIndex = (y * width + x) * 4;
        imageDataArray[dstIndex] = r;
        imageDataArray[dstIndex + 1] = g;
        imageDataArray[dstIndex + 2] = b;
        imageDataArray[dstIndex + 3] = 255;
      }
    }

    const imageDataObject = new ImageData(imageDataArray, width, height);

    const tempCanvas = document.createElement('canvas');
    const tempContext = tempCanvas.getContext('2d');
    tempCanvas.width = width;
    tempCanvas.height = height;

    tempContext?.putImageData(imageDataObject, 0, 0);

    context!.clearRect(0, 0, canvasSize, canvasSize);
    context!.drawImage(
        tempCanvas,
        0, 0, width, height,        
        canvasXOffset, canvasYOffset,         
        scaledWidth, scaledHeight   
    );
  }


  drawCircles(): void {
    const results = this.formGroup.value('results');
    const scale = this.formGroup.value('scale');
    const offsetX = this.formGroup.value('sliderXOffset') + this.formGroup.value('canvasXOffset');
    const offsetY = this.formGroup.value('sliderYOffset') + this.formGroup.value('canvasYOffset');

    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');

    const headerInstance = this.formGroup.value('header');
    const crpix1 = headerInstance.get('CRPIX1');
    const crpix2 = headerInstance.get('CRPIX2');
    const crval1 = headerInstance.get('CRVAL1');
    const crval2 = headerInstance.get('CRVAL2');
    const cdelt1 = headerInstance.get('CDELT1');
    const cdelt2 = headerInstance.get('CDELT2');

    const pixelXOffset = this.formGroup.value('sliderXOffset') / Math.abs(cdelt1);
    const pixelYOffset = this.formGroup.value('sliderYOffset') / Math.abs(cdelt2);
    
    results.forEach(source => {
      let x: number, y: number;

      if (headerInstance.get('RCCORDS') === 'equatorial') {
        x = source.ra;
        y = source.dec;
      } else if (headerInstance.get('RCCORDS') === 'galactic') {
        x = source.l;
        y = source.b;
      } else {
        console.error('Unknown coordinate system');
        return;
      }

      const pixelX = ((x - crval1) / cdelt1) + crpix1;
      const pixelY = ((crval2 - y) / cdelt2) + crpix2;

      const scaledX = (pixelX + pixelXOffset) * scale + this.formGroup.value('canvasXOffset');
      const scaledY = (pixelY - pixelYOffset) * scale + this.formGroup.value('canvasYOffset');

      context!.beginPath();
      context!.arc(
          scaledX,
          scaledY,
          scale * 22, // Radius of the circle
          0,
          2 * Math.PI
      );
      context!.strokeStyle = '#ffffff'; // Ring color
      context!.lineWidth = 1 + (3 - 1) * ((this.formGroup.value('zoomScale') - 0.1) / (1 - 0.1));
      context!.stroke();
      context!.closePath();
    });
  }


  updateFitsImage() {
    this.formGroup.patchValue({zoomScale: this.formGroup.value('zoomLevel') / 100});
    this.displayFitsImage();
  }
}


