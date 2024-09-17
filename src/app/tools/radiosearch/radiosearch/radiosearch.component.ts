import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { RadioSearchService } from '../radiosearch.service';
import { HonorCodePopupService } from '../../shared/honor-code-popup/honor-code-popup.service';
import { HonorCodeChartService } from '../../shared/honor-code-popup/honor-code-chart.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FITSHeaderParser } from '../../shared/data/FitsParser/FitsParser';

@Component({
  selector: 'app-radiosearch',
  templateUrl: './radiosearch.component.html',
  styleUrls: ['./radiosearch.component.scss', '../../shared/interface/tools.scss'],
})
export class RadioSearchComponent {
  fitsFileName: string | undefined;
  ra: number | undefined;
  dec: number | undefined;
  width: number | undefined;
  height: number | undefined;
  beams: number | undefined;
  beamsangle: number | undefined;

  fitsLoaded = false; // Initially false
  canvas: HTMLCanvasElement | null = null;

  displayedColumns: string[] = ['name', 'ra', 'dec'];  // Define the columns
  dataSource = new MatTableDataSource<any>([]);  // Initialize the data source
  hiddenResults: any = [];
  selectedSource: any = null; // Store the selected source

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.canvas = document.getElementById('fitsCanvas') as HTMLCanvasElement;
  }

  ngAfterViewInit() {
    // Bind the MatSort to the dataSource
    this.dataSource.sort = this.sort;
  }

  constructor(
    private service: RadioSearchService,
    private honorCodeService: HonorCodePopupService,
    private chartService: HonorCodeChartService,
    public dialog: MatDialog,
  ) {}

  // Handle row click
  onRowClicked(row: any): void {
    // Find the index of the clicked row in the results
    const index = this.dataSource.data.indexOf(row);
    // Retrieve the corresponding hidden result
    console.log(row)
    console.log(this.dataSource.data)
    this.selectedSource = this.hiddenResults[index]; // Use the index to match the hidden results
  }

  onFileUpload(event: any): void {
    const input = event.target as HTMLInputElement;
    
    // Check if a file has been selected
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Call the processFitsFile function for any additional processing
      this.processFitsFile(file);
      
      // Proceed to load the FITS file and display the image
      const reader = new FileReader();
      
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
      };
      
      // Read the file as an ArrayBuffer for FITS processing
      reader.readAsArrayBuffer(file);
    }
  }
  
  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fitsFileName = file.name;
      this.processFitsFile(file);
    }
  }

  processFitsFile(file: File): void {
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
        
        // Set width and height values (you can adjust these as needed)
        this.width = this.beams * this.beamsangle; 
        this.height = this.beams * this.beamsangle;  
  
        // this.width = 80;
        // this.height = 50;
        console.log('Parsed FITS header:', header);
  
        // Trigger the catalog search with the parsed RA, Dec, width, and height
        this.searchCatalog();
      }
    };
  
    reader.readAsArrayBuffer(file);
  }

  searchCatalog(): void {
    if (this.ra && this.dec && this.width && this.height) {
      // Subscribe to the Observable returned by fetchRadioCatalog
      this.service.fetchRadioCatalog(this.ra, this.dec, this.width, this.height).subscribe(
        (response: any) => {
          console.log('Radio catalog search complete', response);

          // Extract values of the response object and map over them
          let results = response.objects.map((source: any) => ({
            name: source.SIMBAD || 'Unknown',
            ra: source.ra,  // Extract ra from the source
            dec: source.dec, // Extract dec from the source
            threeC: source.threeC || 'Unknown',
          }));

          let hidden_results = response.objects.map((source: any) => ({
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
          
          console.log(hidden_results)
          // Update the table's data source
          this.dataSource.data = results;

          this.hiddenResults = hidden_results;
          console.log('results', results);
        },
        (error: any) => {  // Explicitly define 'error' as 'any'
          console.error('Error during radio catalog search:', error);
        }
      );
    } else {
      console.error('RA, Dec, Width, and Height are required!');
    }
  }

  // Fetch and handle radio catalog results
  getResults(jobId: number): void {
    this.service.getRadioCatalogResults(jobId)?.subscribe((result: any) => {
      console.log('Catalog results:', result);
      // Handle the result (e.g., display in the UI)
    });
  }
}
