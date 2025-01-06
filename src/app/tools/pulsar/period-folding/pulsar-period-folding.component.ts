import { Component } from '@angular/core';
import { lombScargle } from '../../shared/data/utils';
import { PulsarService } from '../pulsar.service';
import { HonorCodePopupService } from '../../shared/honor-code-popup/honor-code-popup.service';
import { HonorCodeChartService } from '../../shared/honor-code-popup/honor-code-chart.service';
import {InputSliderValue} from "../../shared/interface/input-slider/input-slider.component";
import { PulsarDataDict } from '../pulsar.service.util';

@Component({
  selector: 'app-pulsar-period-folding',
  templateUrl: './pulsar-period-folding.component.html',
  styleUrls: ['./pulsar-period-folding.component.scss',
    '../../shared/interface/tools.scss',]
})
export class PulsarPeriodFoldingComponent {
  chartTitle: string = 'My PeriodFolding';
  dataLabel: string = 'Data Set 1';
  xAxisLabel: string = 'Time (Days)';
  yAxisLabel: string = 'Amplitude';
  displayPeriod: string = 'Period';
  freqMode: boolean = false;
  transformedResult: any;

  constructor(
    private service: PulsarService, // Inject the service
    private honorCodeService: HonorCodePopupService,
    private chartService: HonorCodeChartService
  ) {}
  
  parsedData: any;
  startValue: number = 1;
  endValue: number = 10;
  numPoints: number = 1000;

  periodMax: number = 100;
  periodMin: number = 0.1;
  periodStep: number = 0.1;
  periodNum: number = 1;
  periodValue: number = 1; // Default period value
  phaseValue: number = 1; // Default phase value

  ts: number[] = [];
  xs: number[] = [];
  ys: number[] = [];
  error: number[] = [];



  onChange($event: InputSliderValue) {
    if ($event.key === 'period') {
      this.periodValue = $event.value;
    } else if ($event.key === 'phase') {
      this.phaseValue = $event.value;
    }
    this.computePeriod();
  }

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
  
  onMeasurementChange() {
    console.log('Selected measurement type:', this.phaseValue);
    this.computePeriod();
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

  computePeriod() {
    console.log('datgb ',this.periodValue, this.periodNum, this.phaseValue);
    // const x: number[] = this.ts.map(num => num * this.periodValue); 
    // // multiply by the period value (whether it is 1 or 2)
    // const x: number[] = this.ts.map(num => (num * this.periodNum) + (this.periodValue * this.phaseValue));
    // add period * phase to each value in this.ts
    const scaledPeriod = this.periodValue * this.periodNum; // Scale the period

    const x: number[] = this.ts.map(num => 
      ((num + (this.periodValue * this.phaseValue)) % scaledPeriod) / this.periodValue // Modulus uses scaled period
    );
    // divide this.ts by period value and take the remainder in a new array


    // at this point we have an array of all of the periods
    // this can just be plotted against the y values ??
    console.log('xcx', x);
    // Pass data to the service
    this.transformedResult = x.map((value, index) => ({
      frequency: value,            // Use x value
      channel1: this.xs[index],    // Use y1[index] or default to 0 if out of bounds
      channel2: this.ys[index]     // Use y2[index] or default to 0 if out of bounds
    })); 

    this.transformedResult = this.binTransformedResult();

    // this.service.updateData(this.transformedResult);
    this.service.setData(this.transformedResult);
  }

  binTransformedResult() {
    const numBins = 100;
  
    // Extract frequencies from the data
    const frequencies = this.transformedResult.map((item: PulsarDataDict) => item.frequency);
  
    // Compute min and max frequencies
    const minFreq = Math.min(...frequencies);
    const maxFreq = Math.max(...frequencies);
  
    // Calculate bin size
    const binSize = (maxFreq - minFreq) / numBins;
  
    // Initialize bins
    const bins = Array.from({ length: numBins }, () => ({
      frequency: 0,
      channel1: 0,
      channel2: 0,
      count: 0 // To track how many data points fall into this bin
    }));
  
    // Bin the data
    this.transformedResult.forEach((item: PulsarDataDict) => {
      if (item.frequency !== null && item.channel1 !== null && item.channel2 !== null) {
        // Determine the bin index
        const binIndex = Math.min(
          Math.floor((item.frequency - minFreq) / binSize), 
          numBins - 1 // Ensure no out-of-bound indexing
        );
    
        // Accumulate values in bins
        bins[binIndex].frequency += item.frequency;
        bins[binIndex].channel1 += item.channel1;
        bins[binIndex].channel2 += item.channel2;
        bins[binIndex].count += 1;
      }
    });
  
    // Average the values within each bin
    const binnedData = bins.map(bin => ({
      frequency: bin.count > 0 ? bin.frequency / bin.count : 0,
      channel1: bin.count > 0 ? bin.channel1 / bin.count : 0,
      channel2: bin.count > 0 ? bin.channel2 / bin.count : 0
    }));
  
    console.log('Binned Data:', binnedData);
    return binnedData; // Return binned results
  }  

  saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageHighChartOffline(this.service.getHighChart(), "Pulsar Period Folding", name);
    })
  }

  resetForm() {
    this.service.resetData();
  }
}
