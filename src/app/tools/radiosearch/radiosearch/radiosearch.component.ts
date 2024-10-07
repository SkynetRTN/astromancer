import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { RadioSearchService } from '../radiosearch.service'; // Import the service
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { astro } from 'fitsjs';
import { MatDialog } from '@angular/material/dialog';
import { HonorCodePopupService } from '../../shared/honor-code-popup/honor-code-popup.service';
import { HonorCodeChartService } from '../../shared/honor-code-popup/honor-code-chart.service';
import { FITSHeaderParser } from '../../shared/data/FitsParser/FitsParser';
import { HiddenResults } from '../storage/radiosearch-storage.service.util';

@Component({
  selector: 'app-radiosearch',
  templateUrl: './radiosearch.component.html',
  styleUrls: ['./radiosearch.component.scss', '../../shared/interface/tools.scss'],
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

    // Bind the MatSort to the dataSource
    this.dataSource.sort = this.sort;

    // Initialize the canvas element after the view has been fully rendered
    this.canvas = this.canvasRef.nativeElement;

    if (!this.canvas) {
      console.error('Canvas element is not found.');
      return;
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
      this.processFitsFile(file).then(() => {
        this.getHeader(file); // Called after processFitsFile resolves
      });
    }
  }

  onFileUnselected(event: Event): void {
    this.fitsLoaded = false;
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
    if (this.canvas) {
    const context = this.canvas.getContext('2d');
    if (context && this.displayData) {
      // Redraw the image on the canvas first
      context.putImageData(this.displayData, 0, 0);

      // Draw circles with offsets
      const raList = this.results.map((source: any) => source.ra);
      const decList = this.results.map((source: any) => source.dec);

      for (let i = 0; i < raList.length; i++) {
        const pixelCoordinates = this.getPixelCoordinates(raList[i], decList[i]);
        // Draw a hollow rings at the transformed coordinates
        if (pixelCoordinates) {
          context.beginPath();
          context.arc(
            pixelCoordinates.x + this.xOffset, // Apply xOffset
            pixelCoordinates.y + this.yOffset, // Apply yOffset
            25, 0, 2 * Math.PI
          );
          context.strokeStyle = '#be1951'; // Set ring color using hex code (blue in this case)
          context.lineWidth = 4; // Adjust the thickness of the ring outline
          context.stroke(); // Draw the outline (ring)
          context.closePath();
        }
      }
    }
    }
  }


  // Converts canvas pixel coordinates to RA and Dec based on WCS info
  getWorldCoordinates(x: number, y: number): { ra: number, dec: number } | null {
    if (!this.wcsInfo) {
      console.error('WCS information not available');
      return null;
    }

    const canvas = this.canvasRef.nativeElement;
    const { crpix1, crpix2, crval1, crval2, cdelt1, cdelt2 } = this.wcsInfo;

    // Normalize x and y to fit the image pixel coordinates (if canvas and image sizes differ)
    const imageX = (x / canvas.width) * this.naxis1; // x mapped to image pixel scale
    const imageY = (y / canvas.height) * this.naxis2; // y mapped to image pixel scale

    // Calculate RA and Dec using the WCS linear transformation equations
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
          // Create the DataUnit object from the arrayBuffer
          const dataUnit = new astro.FITS.DataUnit(null, arrayBuffer);
  
          // Decode the header block and parse the header
          const block = new TextDecoder().decode(dataUnit.buffer!.slice(0, 2880));
          const header = new astro.FITS.Header(block);
          
          // Retrieve important header values
          this.naxis1 = header.get('NAXIS1');
          this.naxis2 = header.get('NAXIS2');
          const bitpix = header.get('BITPIX');
  
          if (!this.naxis1 || !this.naxis2 || !bitpix) {
            throw new Error('Invalid or missing header values for NAXIS1, NAXIS2, or BITPIX.');
          }
  
          // Determine BSCALE and BZERO with default values
          let bscale = header.get('BSCALE') || 1;
          let bzero = header.get('BZERO') || 0;
  
          // Calculate the length of the data and its byte offset
          const bytesPerPixel = Math.abs(bitpix) / 8;
          const expectedDataLength = this.naxis1 * this.naxis2 * bytesPerPixel;
          const dataOffset = 0; // Skip the header
  
          // Check if the buffer is large enough
          if (dataOffset + expectedDataLength > arrayBuffer.byteLength) {
            throw new Error(
              `Insufficient data in buffer. Expected: ${dataOffset + expectedDataLength}, Found: ${arrayBuffer.byteLength}`
            );
          }
          
          console.log('Expected Data Length', expectedDataLength, 'Array Buffer', arrayBuffer, 'Data Offset', dataOffset);
          // Create a DataView for precise data access
          const dataView = new DataView(arrayBuffer, dataOffset, expectedDataLength);
  
          // Array to hold pixel values
          const pixelArray = new Array(this.naxis1 * this.naxis2);
  
          // Read pixel values based on BITPIX
          let readMethod: (byteOffset: number, littleEndian?: boolean) => number;
  
          switch (bitpix) {
            case 8:
              // Unsigned 8-bit integers (no endianness consideration needed)
              for (let i = 0; i < pixelArray.length; i++) {
                pixelArray[i] = dataView.getUint8(i);
              }
              break;
  
            case 16:
              // Signed 16-bit integers (big-endian)
              readMethod = dataView.getInt16.bind(dataView);
              for (let i = 0; i < pixelArray.length; i++) {
                pixelArray[i] = readMethod(i * 2, false);
              }
              break;
  
            case 32:
              // Signed 32-bit integers (big-endian)
              readMethod = dataView.getInt32.bind(dataView);
              for (let i = 0; i < pixelArray.length; i++) {
                pixelArray[i] = readMethod(i * 4, false);
              }
              break;
  
            case -32:
              // 32-bit floating point (big-endian)
              readMethod = dataView.getFloat32.bind(dataView);
              for (let i = 0; i < pixelArray.length; i++) {
                pixelArray[i] = readMethod(i * 4, false);
              }
              break;
  
            case -64:
              // 64-bit floating point (big-endian)
              readMethod = dataView.getFloat64.bind(dataView);
              
              // Populate pixelArray with correct values
              for (let i = 0; i < pixelArray.length; i++) {
                pixelArray[i] = readMethod(i * 8, false);
              }
            
              break;
  
            default:
              throw new Error(`Unsupported BITPIX value: ${bitpix}`);
          }
          
          // Check for any NaN values in pixelArray
          const nanCount = pixelArray.filter((value) => isNaN(value)).length;
          if (nanCount > 0) {
            console.warn('Detected NaN values in pixel data. Count:', nanCount);
          }
  
          // Scale the pixel values using BSCALE and BZERO
          const scaledData = pixelArray.map((value) => (isNaN(value) ? 0 : bscale * value + bzero));
  
          console.log('Scaled Data (first 10 values):', scaledData.slice(0, 10));
  
          // Create a FITS Image using the header and the entire buffer
          const fitsImage = new astro.FITS.Image(header, arrayBuffer);
  
          console.log('FITS Image created:', fitsImage);

          this.fitsLoaded = true;
          this.displayFitsImage(scaledData, this.naxis1, this.naxis2); // Display the image
          
        } catch (error) {
          console.error('Error processing FITS file:', error);
        }

        const dataUnit = new astro.FITS.DataUnit(null, arrayBuffer);
        const block = new TextDecoder().decode(dataUnit.buffer!.slice(0, 2880));
        const header = new astro.FITS.Header(block);

        // Extract WCS information from the header
        this.wcsInfo = {
          crpix1: parseFloat(header.get('CRPIX1')) || 0,
          crpix2: parseFloat(header.get('CRPIX2')) || 0,
          crval1: parseFloat(header.get('CRVAL1')) || 0,
          crval2: parseFloat(header.get('CRVAL2')) || 0,
          cdelt1: parseFloat(header.get('CDELT1')) || 1,
          cdelt2: parseFloat(header.get('CDELT2')) || 1,
        };


        const { crpix1, crpix2, crval1, crval2, cdelt1, cdelt2 } = this.wcsInfo;

        // Calculate the total RA range spanned by the image in degrees
        this.width = Math.abs(cdelt1) * this.naxis1;
        // Calculate the total Dec range spanned by the image in degrees
        this.height = Math.abs(cdelt2) * this.naxis2;

        console.log("True Width:", this.width, "True Height:", this.height)
      }
      resolve();
    };
  
    reader.readAsArrayBuffer(file);
  });
  }


  getHeader(file: File): void {
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (arrayBuffer) {
        // Use FITSHeaderParser to parse the header
        const headerParser = new FITSHeaderParser(arrayBuffer);
        const header = headerParser.parseHeader();

        // Extract RA and Dec from the parsed header
        let raString = header["CENTERRA"];
        let raParts = raString.split('/');
        let raNumber = parseFloat(raParts[0].trim());
        this.ra = raNumber;
  
        let decString = header["CENTERDE"];
        let decParts = decString.split('/');
        let decNumber = parseFloat(decParts[0].trim());
        this.dec = decNumber;
  
        let beamString = header["BGSCALE"];
        let beamParts = beamString.split('/'); // Split by '/'
        let cleanedBeamString = beamParts[0].replace(/'/g, '').trim(); // Remove quotes and trim spaces
        let beamNumber = parseFloat(cleanedBeamString); // Convert to number
        this.beams = beamNumber;

        let beamangleString = header["BEAM"];
        let beamangleParts = beamangleString.split('/'); // Split by '/'
        let cleanedString = beamangleParts[0].replace(/'/g, '').trim(); // Remove quotes and trim spaces
        let beamangleNumber = parseFloat(cleanedString); // Convert to number
        this.beamsangle = beamangleNumber;

        // this.width = (this.beams * this.beamsangle); 
        // this.height = (this.beams * this.beamsangle);  
  
        console.log('Parsed FITS header:', header);
        console.log('CenterRA:', this.width, 'CenterDec:', this.height)
  
        // Trigger the catalog search with the parsed RA, Dec, width, and height
        this.searchCatalog();
      }
    };
  
    reader.readAsArrayBuffer(file);
  }

  
  displayFitsImage(imageData: number[], width: number, height: number): void {
    if (!this.canvas) {
      console.error('Canvas element is not initialized.');
      return;
    }
  
    const context = this.canvas.getContext('2d');
    if (!context) {
      console.error('Failed to get canvas context.');
      return;
    }
    
    // Function to roll image horizontally
    function rollImageHorizontally(data: number[], width: number, height: number, shiftAmount: number): number[] {
      const rolledData = new Array(data.length);
      
      // For each row in the image
      for (let row = 0; row < height; row++) {
        const start = row * width;
        const end = start + width;
  
        // Extract the current row
        const rowData = data.slice(start, end);
  
        // Roll the row by shiftAmount pixels
        const rolledRow = rowData.slice(-shiftAmount).concat(rowData.slice(0, -shiftAmount));
  
        // Copy the rolled row back into the rolledData array
        for (let col = 0; col < width; col++) {
          rolledData[start + col] = rolledRow[col];
        }
      }
  
      return rolledData;
    }
  
    // Determine the amount to shift # 2.5 for maps file
    // const shiftAmount = Math.floor(width / 2.5);
    const shiftAmount = 0;
  
    // Roll the image data horizontally
    const rolledImageData = rollImageHorizontally(imageData, width, height, shiftAmount);
  
        // Apply the inverse hyperbolic sine scaling and normalize to the range [0, 255]
    const min = 0;
    const max = 1e5; // Adjust this based on the max value range you expect
    console.log('Data Before Normalization:', rolledImageData);

    // Apply the asinh transformation first
    const transformedData = rolledImageData.map((value) => {
      // Check for NaN or excessively large values and replace them with 0
      if (isNaN(value) || value > max) {
        return 0;
      }

      // Apply asinh transformation
      return Math.asinh(value);
    });

    // Find the maximum asinh-transformed value for normalization
    const maxTransformed = Math.max(...transformedData);

    // Normalize the asinh-transformed data to the range [0, 255]
    const normalizedData = transformedData.map((value) => {
      // Normalize the transformed value to [0, 255]
      return Math.floor((value / maxTransformed) * 255);
    });

    console.log('Data After Normalization:', normalizedData);
    console.log('Maximum value:', Math.max(...normalizedData));
    
    const imageDataArray = new Uint8ClampedArray(width * height * 4);

    
    // Find the max intensity in the normalized data to scale after asinh
    const maxIntensity = Math.max(...normalizedData);
    const scaleFactor = Math.asinh(maxIntensity);  // Use this to normalize the asinh result

    
    function turboColormap(value: number): [number, number, number] {
      // Explicitly type turboRGB as an array of tuples [number, number, number]
      const turboRGB: [number, number, number][] = [
        [48, 18, 59], [50, 57, 144], [31, 138, 176], [53, 191, 111],
        [200, 228, 47], [255, 180, 1], [249, 111, 1], [181, 45, 5]
      ];
    
      // Clamp value between 0 and 1
      value = Math.max(0, Math.min(1, value));
    
      // Map the normalized value to an index in the colormap
      const index = Math.floor(value * (turboRGB.length - 1));
    
      // Return the corresponding RGB values
      return turboRGB[index];
    }    
    

    for (let i = 0; i < normalizedData.length; i++) {
      let intensity = normalizedData[i];
    
      // Scale intensity using the inverse hyperbolic sine function
      const scaledIntensity = Math.asinh(intensity) / scaleFactor; // Normalized to [0, 1]
    
      // Get the RGB values from the Turbo colormap
      const [r, g, b] = turboColormap(scaledIntensity);
    
      // Assign the RGB values to the image data array
      const index = i * 4;
      imageDataArray[index] = r;     // R
      imageDataArray[index + 1] = g; // G
      imageDataArray[index + 2] = b; // B
      imageDataArray[index + 3] = 255; // A (opacity)
    }
    
  
    this.displayData = new ImageData(imageDataArray, width, height);
    console.log('Display Data:', this.displayData);
    
    // Set canvas dimensions to match the image data
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Draw the image on the canvas
    context.putImageData(this.displayData, 0, 0);
  }
  
  
  searchCatalog(): void {
    if (this.ra && this.dec && this.width && this.height) {
      this.service.fetchRadioCatalog(this.ra, this.dec, this.width, this.height).subscribe(
        (response: any) => {
          const results = response.objects.map((source: any) => ({
            name: source.SIMBAD || 'Unknown',
            ra: source.ra,
            dec: source.dec,
            threeC: source.threeC || 'Unknown',
          }));

          const hidden_results = response.objects.map((source: any) => ({
            name: source.SIMBAD || 'Unknown',
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
                  context.strokeStyle = '#be1951'; // Set ring color using hex code (blue in this case)
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
        },
        (error: any) => {
          console.error('Error during radio catalog search:', error);
        }
      );
    } else {
      console.error('RA, Dec, Width, and Height are required!');
    }
  }


  performLogFitting(hiddenResults: HiddenResults[]): { slope: number, intercept: number } | null {
    // Define the frequencies in MHz
    const frequencies: number[] = [38, 159, 178, 750, 1400, 2695, 5000, 8400];
    
    // Prepare arrays to hold valid data for fitting
    const logFrequencies: number[] = [];
    const logFluxes: number[] = [];

    // Loop through each source and prepare the log data
    hiddenResults.forEach((source: HiddenResults) => {
        // Extract flux values while handling 'Unknown' cases
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

        // Add valid frequency and flux pairs to log arrays
        fluxes.forEach((flux, index) => {
            if (flux !== null) {
                logFrequencies.push(Math.log(frequencies[index])); // Natural log of frequency
                logFluxes.push(Math.log(flux)); // Natural log of flux
            }
        });
    });

    // Perform linear regression if we have enough data
    if (logFrequencies.length > 0 && logFluxes.length > 0) {
        const n: number = logFrequencies.length;
        const sumX: number = logFrequencies.reduce((a, b) => a + b, 0);
        const sumY: number = logFluxes.reduce((a, b) => a + b, 0);
        const sumXY: number = logFrequencies.reduce((sum, x, i) => sum + x * logFluxes[i], 0);
        const sumX2: number = logFrequencies.reduce((sum, x) => sum + x * x, 0);

        const slope: number = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept: number = (sumY - slope * sumX) / n;

        console.log(`Slope: ${slope}, Intercept: ${intercept}`);

        // Return the slope and intercept
        return { slope, intercept };
    } else {
        // Not enough data, return null
        console.error('Not enough data for linear fitting');
        return null;
    }
  }


  getResults(jobId: number): void {
    this.service.getRadioCatalogResults(jobId)?.subscribe((result: any) => {
      console.log('Catalog results:', result);
    });
  }
}
