import { Component } from '@angular/core';
import { lombScargleWithError } from '../../shared/data/utils';
import { PulsarService } from '../pulsar.service';
import { HonorCodePopupService } from '../../shared/honor-code-popup/honor-code-popup.service';
import { HonorCodeChartService } from '../../shared/honor-code-popup/honor-code-chart.service';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pulsar-periodogram',
  templateUrl: './pulsar-periodogram.component.html',
  styleUrls: ['./pulsar-periodogram.component.scss',
    '../../shared/interface/tools.scss',]
})
export class PulsarPeriodogramComponent {

  chartTitle: string = 'My Periodogram';
  dataLabel: string = 'Data Set 1';
  xAxisLabel: string = 'Time (Days)';
  yAxisLabel: string = 'Amplitude';
  displayPeriod: string = 'period';

  constructor(
    private service: PulsarService, // Inject the service
    private honorCodeService: HonorCodePopupService,
    private chartService: HonorCodeChartService
  ) {}
  
  parsedData: any;
  startPeriod: number = 1;
  endPeriod: number = 10;
  numPoints: number = 1000;

  ts: number[] = [];
  xs: number[] = [];
  ys: number[] = [];
  error: number[] = [];

  onFieldChange(field: string, value: string) {
    console.log(`Field "${field}" changed to:`, value);
  
    // You can trigger updates here if needed
    switch (field) {
      case 'title':
        this.chartTitle = value;
        this.service.setChartTitle(this.chartTitle);
        break;
      case 'data':
        this.dataLabel = value;
        this.service.setDataLabel(this.dataLabel);
        break;
      case 'xAxis':
        this.xAxisLabel = value;
        this.service.setXAxisLabel(this.xAxisLabel);
        break;
      case 'yAxis':
        this.yAxisLabel = value;
        this.service.setYAxisLabel(this.yAxisLabel);
        break;
    }
  }  

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        const fileContent = reader.result as string;
        this.processFile(fileContent);
      };
  
      reader.readAsText(file); // Read the file as text
    }
  }
  
  processFile(data: string) {
    // Split the file into lines
    const lines = data.split('\n');

    // Filter out comment lines starting with #
    const filteredLines = lines.filter(line => !line.startsWith('#') && line.trim() !== '');

    // Extract headers and data rows
    const headers = [
      'UTC_Time(s)', 'Ra(hr)', 'Dec(deg)', 'Az(deg)', 'El(deg)', 
      'YY1', 'XX1', 'Cal', 'Sweeps'
    ];

    const rows = filteredLines.map(line => {
      // Replace multiple spaces with a single space, then split by space
      const columns = line.trim().replace(/\s+/g, ' ').split(' ');

      // Map data to headers
      const row: Record<string, string | number> = {};
      headers.forEach((header, index) => {
        row[header] = isNaN(Number(columns[index])) ? columns[index] : Number(columns[index]);
      });

      return row;
    });

    console.log('Headers:', headers);
    console.log('Rows:', rows);

    // Prepare data for computation
    this.ts = rows.map(row => row['UTC_Time(s)'] as number);
    this.xs = rows.map(row => row['XX1'] as number);
    this.ys = rows.map(row => row['YY1'] as number);
    this.error = Array(this.ys.length).fill(1.0); // Dummy errors
  }

  computeLombScargle() {
    const freqMode = false;
  
    // Compute Lomb-Scargle for both datasets
    const result = lombScargleWithError(
      this.ts, this.ys, this.error, this.startPeriod, this.endPeriod, this.numPoints, freqMode
    );
  
    const calresult = lombScargleWithError(
      this.ts, this.xs, this.error, this.startPeriod, this.endPeriod, this.numPoints, freqMode
    );
  
    console.log('Raw Lomb-Scargle Result:', result);
    console.log('Raw Lomb-Scargle Calibration Result:', calresult);
  
    // Ensure both results have the same length
    if (result.length !== calresult.length) {
      console.error('Error: Results and calibration results have mismatched lengths.');
      return;
    }
  
    // Transform the result into an array of objects
    const transformedResult = result.map(([frequency, channel1], index) => ({
      frequency,
      channel1,
      channel2: calresult[index][1] // Append channel2 from calresult
    }));
  
    console.log('Transformed Lomb-Scargle Result:', transformedResult);
  
    // Store or process results
    this.parsedData = transformedResult;
  
    // Pass data to the service
    this.service.setData(transformedResult);
  }
  

  saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageHighChartOffline(this.service.getHighChart(), "Pulsar Periodogram", name);
    })
  }

  resetForm() {
    this.service.resetData();
  }
}
