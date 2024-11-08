import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { RadioSearchHighChartService, RadioSearchService } from './radiosearch.service'; // Import the service
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HonorCodePopupService } from '../shared/honor-code-popup/honor-code-popup.service';
import { HonorCodeChartService } from '../shared/honor-code-popup/honor-code-chart.service';
import { FITSHeaderParser } from '../shared/data/FitsParser/FitsParser';
import { HiddenResults } from './storage/radiosearch-storage.service.util';
import { FittingResult } from './storage/radiosearch-storage.service.util';
import { RadioSearchDataDict } from './radiosearch.service.util';
import * as Highcharts from 'highcharts';
import * as fitsjs from 'fitsjs';

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
  beams: number | undefined;
  beamsangle: number | undefined;

  xOffset: number = 0;
  yOffset: number = 0;

  naxis1: number = 100;
  naxis2: number = 100;
  bitpix: number | undefined;

  fitsLoaded = false;
  canvas: HTMLCanvasElement | null = null;
  displayData: ImageData | null = null;
  scaledData: any;
  maxValue: number = 0.5;
  targetFreq: number = 1.5;

  displayedColumns: string[] = ['name', 'ra', 'dec'];  // Define the columns
  dataSource = new MatTableDataSource<any>([]);  // Initialize the data source
  results: any = [];
  hiddenResults: any = [];
  selectedSource: any = null; // Store the selected source
  wcsInfo: { crpix1: number, crpix2: number, crval1: number, crval2: number, cdelt1: number, cdelt2: number } | null = null;
  currentCoordinates: { ra: number, dec: number } | null = null;
  // Define the structure of the source object in hiddenResults


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fitsCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileDropZone', { static: false }) fileDropZoneRef!: ElementRef<HTMLDivElement>;
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  ngAfterViewInit() {
    // Bind the MatSort to the dataSource
    this.dataSource.sort = this.sort;

    // Initialize the canvas element after the view has been fully rendered
    this.canvas = this.canvasRef.nativeElement;

    if (!this.canvas) {
      console.error('Canvas element is not found.');
    } else {
      console.log('Canvas element successfully initialized.');
    }

    if (this.canvas) {
      this.canvas.addEventListener('click', (event: MouseEvent) => this.grabCoordinatesOnClick(event));
    }

    // Add mouse move listener to display RA/Dec on hover
    this.canvas.addEventListener('mousemove', (event) => {
    this.displayCoordinates(event);
    });

    // Add drag-and-drop listeners to the drop zone
    this.fileDropZoneRef.nativeElement.addEventListener('dragenter', () => this.onDragEnter());
    this.fileDropZoneRef.nativeElement.addEventListener('dragleave', () => this.onDragLeave());
    this.fileDropZoneRef.nativeElement.addEventListener('drop', (event: DragEvent) => this.onFileDrop(event));
  }

  constructor(
    private service: RadioSearchService, // Inject the service
    private hcservice: RadioSearchHighChartService,
    private honorCodeService: HonorCodePopupService,
    private chartService: HonorCodeChartService,
    public dialog: MatDialog,
  ) {}

  // Handle row click
  onRowClicked(row: any): void {
    const index = this.dataSource.data.indexOf(row);
    this.selectedSource = this.hiddenResults[index]; // Use the index to match the hidden results
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
    event.preventDefault();
    this.onFileSelected(event); // Call existing file processing method
    this.fileDropZoneRef.nativeElement.classList.remove('shake'); // Stop shaking
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
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
    if (!this.canvas) return;

    // Get the canvas' bounding rectangle to calculate relative positions
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const worldCoordinates = this.getWorldCoordinates(x - this.xOffset, y - this.yOffset);
    const mouseRA = worldCoordinates?.ra;
    const mouseDec = worldCoordinates?.dec;

    if (worldCoordinates) {
      const raList = this.results.map((source: any) => source.ra);
      const decList = this.results.map((source: any) => source.dec);
      const radius = 0.5; // Example radius
      
      if (this.canvas) {
        const context = this.canvas.getContext('2d');
        if (context) {
          for (let i = 0; i < raList.length; i++) {
            const sourceRA = raList[i];
            const sourceDec = decList[i];
      
            // Calculate the Euclidean distance between the source and the mouse coordinates
            const distance = Math.sqrt(
              Math.pow(sourceRA - mouseRA!, 2) + Math.pow(sourceDec - mouseDec!, 2)
            );
      
            if (distance <= radius) {
              const pixelCoordinates = this.getPixelCoordinates(raList[i], decList[i]);
              this.redrawCircles();
      
              // Find the source object for the current RA
              const source = this.results.find((s: any) => s.ra === sourceRA && s.dec === sourceDec);
      
              if (source) {
                const scatterData = this.getScatterData(source.id);
                
                // Perform the log fitting to get the slope and intercept
                const fit = this.performLogFitting(this.hiddenResults, i);
                const slope = fit?.slope;
                const intercept = fit?.intercept;

                if (slope !== undefined && intercept !== undefined) {
                    // Loop through scatterData and calculate flux_fit based on slope and intercept
                    for (let j = 0; j < scatterData.length; j++) {
                        const frequency = scatterData[j].frequency;
                        if (frequency !== null) {
                            // Calculate flux_fit using the linear equation
                          scatterData[j].flux_fit = parseFloat((slope * frequency + intercept).toFixed(3));
                        }
                    }

                    // Update the chart data with the modified scatterData
                    this.hcservice.setData(scatterData);
                }

                // Set the chart title
                this.hcservice.setChartTitle('Results for Radio Source ' + source.threeC);
                // Draw a hollow ring at the transformed coordinates
                if (pixelCoordinates) {
                  context.beginPath();
                  context.arc(
                    pixelCoordinates.x + this.xOffset,
                    pixelCoordinates.y + this.yOffset,
                    25, 0, 2 * Math.PI
                  );
                  context.strokeStyle = '#ff0000'; // Set ring color using hex code
                  context.lineWidth = 4; // Adjust the thickness of the ring outline
                  context.stroke(); // Draw the outline (ring)
                  context.closePath();
                }
              }
            }
          }
        }
      }
    }
  }


  displayCoordinates(event: MouseEvent): void {
    if (!this.canvas) return;
  
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    const worldCoordinates = this.getWorldCoordinates(x, y);
  
    if (worldCoordinates) {
      // Display the RA and Dec (you can update the UI or a tooltip here)
      // console.log(`RA: ${worldCoordinates.ra.toFixed(4)}, Dec: ${worldCoordinates.dec.toFixed(4)}`);
      this.currentCoordinates = worldCoordinates;
    }
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
  
    // Step 2: Redraw the FITS image by calling your displayFitsImage function
    this.displayFitsImage(this.scaledData,  this.naxis1, this.naxis2);
  
    // Step 3: Redraw the circles by calling your drawCircles function
    this.drawCircles(this.results);
  }
  

  getWorldCoordinates(x: number, y: number): { ra: number, dec: number } | null {
    if (!this.wcsInfo) {
      console.error('WCS information not available');
      return null;
    }
  
    const canvas = this.canvasRef.nativeElement;
    const { crpix1, crpix2, crval1, crval2, cdelt1, cdelt2 } = this.wcsInfo;
  
    // Get the displayed canvas dimensions (CSS dimensions)
    const canvasRect = canvas.getBoundingClientRect();
    const displayWidth = canvasRect.width;
    const displayHeight = canvasRect.height;
  
    // Scale the canvas (x, y) to the corresponding image pixel coordinates
    const scaleX = this.naxis1 / displayWidth;  // Use display width for scaling
    const scaleY = this.naxis2 / displayHeight; // Use display height for scaling
  
    const imageX = x * scaleX;
    const imageY = y * scaleY;
  
    // Apply WCS linear transformation to convert image coordinates to RA/Dec
    const ra = crval1 + (imageX - crpix1) * cdelt1;
    const dec = crval2 + (imageY - crpix2) * cdelt2;
  
    return { ra, dec };
  }  


  getPixelCoordinates(ra: number, dec: number): { x: number, y: number } | null {
    if (!this.wcsInfo) {
      console.error('WCS information not available');
      return null;
    }
  
    const { crpix1, crpix2, crval1, crval2, cdelt1, cdelt2 } = this.wcsInfo;
  
    // Calculate pixel coordinates based on the inverse of the WCS transformation equations
    const x = crpix1 + (ra - crval1) / cdelt1;
    const y = crpix2 + (dec - crval2) / cdelt2;
  
    return { x, y };
  }
  

  processFitsFile(file: File): Promise<void> {
    return new Promise((resolve) => {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (arrayBuffer) {
          try {
            // Initialize the DataUnit and parse the header
            const dataUnit = new fitsjs.astro.FITS.DataUnit(null, arrayBuffer);
            const block = new TextDecoder().decode(dataUnit.buffer!.slice(0, 2880));
            const header = new fitsjs.astro.FITS.Header(block);
  
            // Retrieve relevant header values
            this.naxis1 = header.get('NAXIS1');
            this.naxis2 = header.get('NAXIS2');
            this.ra = header.get('CENTERRA');
            this.dec = header.get('CENTERDE');
            const bitpix = header.get('BITPIX');
            const bscale = header.get('BSCALE') || 1;
            const bzero = header.get('BZERO') || 0;
            this.targetFreq = header.get('FREQ')
  
            if (!this.naxis1 || !this.naxis2 || !bitpix) {
              throw new Error('Invalid or missing header values for NAXIS1, NAXIS2, or BITPIX.');
            }
  
            const bytesPerPixel = Math.abs(bitpix) / 8;
            const rowLength = this.naxis1 * bytesPerPixel;
            const dataOffset = 2880;
  
            const dataView = new DataView(arrayBuffer, dataOffset);
            const pixelArray = new Array(this.naxis1 * this.naxis2);
  
            // Use endian swap method if needed
            const swapEndian = fitsjs.astro.FITS.DataUnit.swapEndian;
            let readMethod: (byteOffset: number, littleEndian?: boolean) => number;
  
            switch (bitpix) {
              case 8:
                for (let y = 0; y < this.naxis2; y++) {
                  const rowOffset = y * rowLength;
                  for (let x = 0; x < this.naxis1; x++) {
                    const index = y * this.naxis1 + x;
                    pixelArray[index] = dataView.getUint8(rowOffset + x);
                  }
                }
                break;
  
              case 16:
                readMethod = dataView.getInt16.bind(dataView);
                for (let y = 0; y < this.naxis2; y++) {
                  const rowOffset = y * rowLength;
                  for (let x = 0; x < this.naxis1; x++) {
                    const index = y * this.naxis1 + x;
                    pixelArray[index] = swapEndian.I(readMethod(rowOffset + x * 2, false));
                  }
                }
                break;
  
              case 32:
                readMethod = dataView.getInt32.bind(dataView);
                for (let y = 0; y < this.naxis2; y++) {
                  const rowOffset = y * rowLength;
                  for (let x = 0; x < this.naxis1; x++) {
                    const index = y * this.naxis1 + x;
                    pixelArray[index] = swapEndian.J(readMethod(rowOffset + x * 4, false));
                  }
                }
                break;
  
              case -32:
                readMethod = dataView.getFloat32.bind(dataView);
                for (let y = 0; y < this.naxis2; y++) {
                  const rowOffset = y * rowLength;
                  for (let x = 0; x < this.naxis1; x++) {
                    const index = y * this.naxis1 + x;
                    pixelArray[index] = readMethod(rowOffset + x * 4, false); // No swap needed for floats
                  }
                }
                break;
  
              case -64:
                readMethod = dataView.getFloat64.bind(dataView);
                for (let y = 0; y < this.naxis2; y++) {
                  const rowOffset = y * rowLength;
                  for (let x = 0; x < this.naxis1; x++) {
                    const index = y * this.naxis1 + x;
                    pixelArray[index] = readMethod(rowOffset + x * 8, false); // No swap needed for floats
                  }
                }
                break;
  
              default:
                throw new Error(`Unsupported BITPIX value: ${bitpix}`);
            }
  
            // Scale pixel values using BSCALE and BZERO
            this.scaledData = pixelArray.map((value) => (isNaN(value) ? 0 : bscale * value + bzero));

            this.fitsLoaded = true;
            this.displayFitsImage(this.scaledData, this.naxis1, this.naxis2); // Display the image
            this.drawCircles(this.results); // Draw annotations on the image
  
            // WCS extraction
            this.wcsInfo = {
              crpix1: parseFloat(header.get('CRPIX1')) || 0,
              crpix2: parseFloat(header.get('CRPIX2')) || 0,
              crval1: parseFloat(header.get('CRVAL1')) || 0,
              crval2: parseFloat(header.get('CRVAL2')) || 0,
              cdelt1: parseFloat(header.get('CDELT1')) || 1,
              cdelt2: parseFloat(header.get('CDELT2')) || 1,
            };
  
            this.width = Math.abs(this.wcsInfo.cdelt1) * this.naxis1;
            this.height = Math.abs(this.wcsInfo.cdelt2) * this.naxis2;

            this.searchCatalog(); // Initiate a catalog search based on the data
  
          } catch (error) {
            console.error('Error processing FITS file:', error);
          }
        }
        resolve();
      };
  
      reader.readAsArrayBuffer(file);
    });
  }


  updateFitsImage() {
    // Assuming you have access to imageData, width, and height from your FITS file
    this.displayFitsImage(this.scaledData, this.naxis1, this.naxis2);
    this.drawCircles(this.results);
  }


  drawCircles(results: any): void {
    const raList = results.map((source: any) => source.ra);
    const decList = results.map((source: any) => source.dec);
    if (this.canvas) {
      const context = this.canvas.getContext('2d');
      if (context) {
        for (let i = 0; i < raList.length; i++) {
          const pixelCoordinates = this.getPixelCoordinates(raList[i], decList[i]);
          // Draw a hollow rings at the transformed coordinates
          if (pixelCoordinates) {
            context.beginPath();
            context.arc(pixelCoordinates.x + this.xOffset, pixelCoordinates.y + this.yOffset, 25, 0, 2 * Math.PI);
            context.strokeStyle = '#ffffff'; // Set ring color using hex code
            context.lineWidth = 4; // Adjust the thickness of the ring outline
            context.stroke(); // Draw the outline (ring)
            context.closePath();
          }
        }
      }
    }
  }


  displayFitsImage(imageData: number[], width: number, height: number): void {
    const canvas = this.canvasRef.nativeElement;
    if (!canvas) {
      console.error('Canvas element is not initialized.');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Failed to get canvas context.');
      return;
    }

    // Use the dynamic maxValue from the slider
    const max = 1e5;
    const min = 0;

    // Apply the inverse hyperbolic sine scaling and normalize to [0, 255]
    const transformedData = imageData.map((value) => {
      // Replace NaN or values larger than max with 0
      if (isNaN(value) || value > max) {
        return 0;
      }
      // Apply asinh transformation
      return Math.asinh(value);
    });

    // Get the maximum transformed value for normalization
    const maxTransformed = Math.max(...transformedData);

    // Normalize the transformed data to [0, 255]
    const normalizedData = transformedData.map((value) => {
      return Math.floor((value / maxTransformed) * 255);
    });

    const imageDataArray = new Uint8ClampedArray(width * height * 4);

    // Scale factor for the asinh transformation
    const scaleFactor = Math.asinh(Math.max(...normalizedData));

    // Turbo colormap
    function turboColormap(value: number): [number, number, number] {
      const turboRGB: [number, number, number][] = [
        [48, 18, 59], [50, 57, 144], [31, 138, 176], [53, 191, 111],
        [200, 228, 47], [255, 180, 1], [249, 111, 1], [181, 45, 5]
      ];

      value = Math.max(0, Math.min(1, value));  // Clamp between 0 and 1
      const index = Math.floor(value * (turboRGB.length - 1));

      return turboRGB[index];
    }

    // Apply the turbo colormap and create the image data array
    for (let i = 0; i < normalizedData.length; i++) {
      const intensity = normalizedData[i];

      // Scale intensity using the inverse hyperbolic sine function
      const scaledIntensity = (Math.asinh(intensity) / scaleFactor) * 1.3 * this.maxValue;

      // Get the RGB values from the Turbo colormap
      const [r, g, b] = (turboColormap(scaledIntensity));

      // Assign the RGB values to the image data array
      const index = i * 4;
      imageDataArray[index] = r;     // R
      imageDataArray[index + 1] = g; // G
      imageDataArray[index + 2] = b; // B
      imageDataArray[index + 3] = 255; // A (opacity)
    }

    // Create ImageData object and render it on the canvas
    const imageDataObject = new ImageData(imageDataArray, width, height);
    canvas.width = width;
    canvas.height = height;
    context.putImageData(imageDataObject, 0, 0);
  }
  
  
  searchCatalog(): void {
    if (this.ra && this.dec && this.width && this.height) {
      this.service.fetchRadioCatalog(this.ra, this.dec, this.width, this.height).subscribe(
        (response: any) => {
          const results = response.objects.map((source: any) => ({
            name: source.SIMBAD || 'Unknown',
            id: source.id,
            ra: source.ra,
            dec: source.dec,
            threeC: source.threeC || 'Unknown',
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



          const raList = results.map((source: any) => source.ra);
          const decList = results.map((source: any) => source.dec);
          if (this.canvas) {
            const context = this.canvas.getContext('2d');
            if (context) {
              for (let i = 0; i < raList.length; i++) {
                const pixelCoordinates = this.getPixelCoordinates(raList[i], decList[i]);
                // Draw a hollow rings at the transformed coordinates
                if (pixelCoordinates) {
                  context.beginPath();
                  context.arc(pixelCoordinates.x, pixelCoordinates.y, 25, 0, 2 * Math.PI); // Radius is 10, can be adjusted
                  context.strokeStyle = '#ffffff'; // Set ring color using hex code (blue in this case)
                  context.lineWidth = 4; // Adjust the thickness of the ring outline
                  context.stroke(); // Draw the outline (ring)
                  context.closePath();
                }
              }
            }
          }

          this.dataSource.data = results;
          this.results = results;
          this.hiddenResults = hidden_results;
          console.log(results)
        },
        (error: any) => {
          console.error('Error during radio catalog search:', error);
        }
      );
    } else {
      console.error('RA, Dec, Width, and Height are required!');
    }
  }


  /**
   * Performs logarithmic fitting to the data and returns the slope and intercept.
   * @param hiddenResults Array of data points (Source) with known frequency fluxes.
   * @returns FittingResult | null
   */
  performLogFitting(hiddenResults: any[], sourceIndex: number): FittingResult | null {
    const frequencies: number[] = [38, 159, 178, 750, 1400, 2695, 5000, 8400];
    const logFrequencies: number[] = [];
    const logFluxes: number[] = [];
  
    // Check if the sourceIndex is within bounds
    if (sourceIndex < 0 || sourceIndex >= hiddenResults.length) {
      console.error('Source index out of bounds');
      return null;
    }
  
    // Get the specific source based on the provided index
    const source = hiddenResults[sourceIndex];
  
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
        logFrequencies.push(Math.log10(frequencies[index]));
        logFluxes.push(Math.log10(flux));
      }
    });
  
    if (logFrequencies.length > 1 && logFluxes.length > 1) {
      const n = logFrequencies.length;
      const sumX = logFrequencies.reduce((a, b) => a + b, 0);
      const sumY = logFluxes.reduce((a, b) => a + b, 0);
      const sumXY = logFrequencies.reduce((sum, x, i) => sum + x * logFluxes[i], 0);
      const sumX2 = logFrequencies.reduce((sum, x) => sum + x * x, 0);
  
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
  
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
            frequency: Number(Math.log10(frequencies[index]).toFixed(3)),  // Round frequency to 1 decimal place
            flux: Number(Math.log10(flux).toFixed(3)),                     // Round flux to 1 decimal place
            flux_fit: Number(Math.log10(flux).toFixed(3))  
          });
        }
      });

      const newFrequency = this.targetFreq * 1000; // Set your target frequency in Hz

      // Find the closest lower and upper indices relative to newFrequency
      let lowerIndex = -1;
      let upperIndex = -1;
      
      for (let i = 0; i < frequencies.length; i++) {
        if (frequencies[i] < newFrequency) {
          lowerIndex = i; // Update lowerIndex whenever we find a lower frequency
        } else if (frequencies[i] > newFrequency) {
          upperIndex = i; // Set upperIndex to the first frequency greater than newFrequency
          break; // Stop as soon as we find the first higher frequency
        }
      }
      
      // Check if we found valid indices for both lower and upper frequencies
      if (lowerIndex !== -1 && upperIndex !== -1 && fluxes[lowerIndex] !== null && fluxes[upperIndex] !== null) {
        // Calculate the average flux between the two neighboring points
        const averageFlux = (fluxes[lowerIndex]! + fluxes[upperIndex]!) / 2;
        // Add the new point
        scatterData.push({
          frequency: Number(Math.log10(newFrequency).toFixed(3)), // Log of the new frequency
          flux: Number(Math.log10(averageFlux).toFixed(3)),        // Log of the average flux
          flux_fit: Number(Math.log10(averageFlux).toFixed(3)),  
          highlight: true
        });
      }      
    }

    return scatterData;
  }


  /**
   * Generates the fitted line data points based on slope and intercept.
   * @param slope The slope of the fitted line.
   * @param intercept The intercept of the fitted line.
   * @returns An array of [log frequency, log flux] pairs for the fitted line.
   */
  getFittedLineData(slope: number, intercept: number): [number, number][] {
    const frequencies: number[] = [38, 159, 178, 750, 1400, 2695, 5000, 8400];
    const fittedData: [number, number][] = [];
  
    // For each frequency, calculate the corresponding fitted log flux value
    frequencies.forEach((frequency: number) => {
      const logFreq = Math.log10(frequency);
      const logFlux = slope * logFreq + intercept; // Calculate log(flux) from the fitted line
      fittedData.push([logFreq, logFlux]); // Convert log frequency back to linear scale for plotting
    });
  
    return fittedData;
  }
  

  deleteFITS(): void {
    // Reset properties to their initial values
    this.fitsFileName = undefined;
    this.ra = undefined;
    this.dec = undefined;
    this.width = undefined;
    this.height = undefined;
    this.beams = undefined;
    this.beamsangle = undefined;

    this.xOffset = 0;
    this.yOffset = 0;

    this.naxis1 = 100;
    this.naxis2 = 100;
    this.bitpix = undefined;

    this.fitsLoaded = false;
    this.displayData = null;
    this.scaledData = undefined;
    this.maxValue = 0.5;
    this.targetFreq = 1.5;

    this.dataSource = new MatTableDataSource<any>([]);  // Clear data source
    this.results = [];
    this.hiddenResults = [];
    this.selectedSource = null;
    this.wcsInfo = null;
    this.currentCoordinates = null;

    // Call resetData() on the service if it handles other reset logic
    this.hcservice.resetData();
  }

  

  async downloadCanvas(): Promise<void> {
    const canvas = this.canvas;  // Reference the canvas element
    if (!canvas) {
      console.error('Canvas element not found!');
      return;
    }
  
    // Check for File System Access API support
    if ('showSaveFilePicker' in window) {
      try {
        // Open "Save As" dialog
        const options = {
          types: [
            {
              description: 'PNG Image',
              accept: { 'image/png': ['.png'] },
            },
          ],
        };
        const fileHandle = await (window as any).showSaveFilePicker(options);
  
        // Convert canvas to blob (PNG format)
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((blob) => resolve(blob), 'image/png');
        });
  
        if (blob) {
          const writable = await fileHandle.createWritable();
          await writable.write(blob);  // Write to file
          await writable.close();  // Close file after writing
        } else {
          console.error('Blob creation failed!');
        }
      } catch (error) {
        console.error('Error during file save:', error);
      }
    } else {
      console.warn('File System Access API not supported, using fallback');
  
      // Fallback to traditional download
      const image = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = image;
      downloadLink.download = 'canvas-image.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }  
  

  getResults(jobId: number): void {
    this.service.getRadioCatalogResults(jobId)?.subscribe((result: any) => {
      console.log('Catalog results:', result);
    });
  }
}
