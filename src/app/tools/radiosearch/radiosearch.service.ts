import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { ChartInfo } from "../shared/charts/chart.interface";
import { Chart } from "chart.js";
import {
  RadioSearchChartInfo,
  RadioSearchChartInfoStorageObject,
  RadioSearchData,
  RadioSearchDataDict,
  RadioSearchStorage,
} from "./radiosearch.service.util";
import { MyData } from "../shared/data/data.interface";
import * as Highcharts from 'highcharts';
import { UpdateSource } from "../shared/data/utils";
import { HttpClient } from '@angular/common/http';
import { Source } from './storage/radiosearch-storage.service.util';  // Import Source from the appropriate file
import {environment} from "../../../environments/environment";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RadioSearchHighChartService implements ChartInfo, MyData {
  private chartInfo: RadioSearchChartInfo = new RadioSearchChartInfo();
  private radioSearchData: RadioSearchData = new RadioSearchData();
  private highChart!: Highcharts.Chart;
  private radioSearchStorage: RadioSearchStorage = new RadioSearchStorage();

  // BehaviorSubjects for observables
  private dataSubject = new BehaviorSubject<RadioSearchDataDict[]>(this.radioSearchData.getData());
  data$ = this.dataSubject.asObservable();

  private dataKeysSubject = new BehaviorSubject<string[]>(this.getDataLabelArray());
  dataKeys$ = this.dataKeysSubject.asObservable();

  private chartInfoSubject = new BehaviorSubject<UpdateSource>(UpdateSource.INIT);
  chartInfo$ = this.chartInfoSubject.asObservable();

  constructor(private http: HttpClient) {
    this.radioSearchData.setData(RadioSearchStorage.getData());
    this.chartInfo.setStorageObject(RadioSearchStorage.getChartInfo());
  }

  // ChartInfo Methods
  public getChartTitle(): string {
    return this.chartInfo.getChartTitle();
  }

  public getXAxisLabel(): string {
    return this.chartInfo.getXAxisLabel();
  }

  public getYAxisLabel(): string {
    return this.chartInfo.getYAxisLabel();
  }

  public getDataLabel(): string {
    return this.chartInfo.getDataLabel();
  }

  public getDataLabelArray(): string[] {
    return [this.chartInfo.getXAxisLabel(), this.chartInfo.getYAxisLabel()];
  }

  public setChartTitle(title: string): void {
    this.chartInfo.setChartTitle(title);
    RadioSearchStorage.saveChartInfo(this.chartInfo.getStorageObject());
    this.chartInfoSubject.next(UpdateSource.INTERFACE);
  }

  public setXAxisLabel(label: string): void {
    this.chartInfo.setXAxisLabel(label);
    RadioSearchStorage.saveChartInfo(this.chartInfo.getStorageObject());
    this.chartInfoSubject.next(UpdateSource.INTERFACE);
  }

  public setYAxisLabel(label: string): void {
    this.chartInfo.setYAxisLabel(label);
    RadioSearchStorage.saveChartInfo(this.chartInfo.getStorageObject());
    this.chartInfoSubject.next(UpdateSource.INTERFACE);
  }

  public setDataLabel(label: string): void {
    this.chartInfo.setDataLabel();
    RadioSearchStorage.saveChartInfo(this.chartInfo.getStorageObject());
    this.chartInfoSubject.next(UpdateSource.INTERFACE);
    this.dataKeysSubject.next(this.getDataLabelArray());
  }

  public updateData(newData: RadioSearchDataDict[]): void {
    this.radioSearchData.setData(newData);
    this.dataSubject.next(this.radioSearchData.getData());
  }

  // MyData Methods
  public getData(): RadioSearchDataDict[] {
    return this.radioSearchData.getData();
  }

  public getDataArray(): number[][] {
    return this.radioSearchData.getDataArray();
  }

  public setData(dataDict: RadioSearchDataDict[]): void {
    this.radioSearchData.setData(dataDict);
    RadioSearchStorage.saveData(dataDict);
    this.dataSubject.next(this.getData());
  }

  public addRow(index: number, amount: number): void {
    this.radioSearchData.addRow(index, amount);
    RadioSearchStorage.saveData(this.radioSearchData.getData());
    this.dataSubject.next(this.getData());
  }

  public removeRow(index: number, amount: number): void {
    this.radioSearchData.removeRow(index, amount);
    RadioSearchStorage.saveData(this.radioSearchData.getData());
    this.dataSubject.next(this.getData());
  }

  // Reset Methods
  public resetData(): void {
    const defaultData = RadioSearchData.getDefaultDataAsArray();
    this.setData(defaultData);
    RadioSearchStorage.resetData();
    this.dataSubject.next(this.getData());
  }

  public resetChartInfo(): void {
    const defaultChartInfo = RadioSearchChartInfo.getDefaultStorageObject();
    this.chartInfo.setStorageObject(defaultChartInfo);
    RadioSearchStorage.resetChartInfo();
    this.chartInfoSubject.next(UpdateSource.RESET);
    this.dataKeysSubject.next(this.getDataLabelArray());
  }

  // Storage and Chart Management
  public getStorageObject(): RadioSearchChartInfoStorageObject {
    return this.chartInfo.getStorageObject();
  }

  public setStorageObject(storageObject: RadioSearchChartInfoStorageObject): void {
    this.chartInfo.setStorageObject(storageObject);
  }

  public setHighChart(highChart: Highcharts.Chart): void {
    this.highChart = highChart;
  }

  public getHighChart(): Highcharts.Chart {
    return this.highChart;
  }
}



@Injectable({
  providedIn: 'root',
})
export class RadioSearchService {
  public sources: { ra: number; dec: number }[] = [];  // Updated type to match simplified sources
  public sourcesSubject: BehaviorSubject<{ ra: number; dec: number }[]>;

  constructor(
    private http: HttpClient
  ) {
    
      // Initialize the BehaviorSubject with an empty array or existing sources
      this.sourcesSubject = new BehaviorSubject<{ ra: number; dec: number }[]>(this.sources);
  }


public setSources(sources: Source[]) {
  this.sources = [];

  // Loop through the provided sources and add them to the list
  for (const source of sources) {
      if (source.ra != null && source.dec != null) {
          this.sources.push({
              ra: source.ra,
              dec: source.dec
          });
      }
  }

  // Notify any subscribers about the updated sources list
  this.sourcesSubject.next(this.sources);
}



public getRadioCatalogResults(id: number | null): Observable<any> | void {
if (id !== null) {
  // Return the Observable so you can subscribe to it outside this method
  return this.http.get<any>(`${environment.apiUrl}/radiosearch/radio-catalog/query`, { 
    params: { 'id': id.toString() }
  }).pipe(
    map((resp: any) => {
      const sources: Source[] = resp['output_sources'];  // Extract sources from the response
      this.setSources(sources);  // Set the sources in storage
      return resp;  // Return the response or sources if needed
    })
  );
}
return;  // If id is null, return void
}


fetchRadioCatalog(ra: number, dec: number, width: number, height: number): Observable<any> {
// Build the payload with RA, Dec, width, and height
const payload = { ra, dec, width, height };

console.log('Payload being sent:', payload);  // Debugging

// Use the environment.apiUrl variable with template strings (backticks)
return this.http.post(`${environment.apiUrl}/radiosearch/radio-catalog/query`, payload);
}

// Method to process and extract a frame from the FITS image
getFrame(
fitsImage: any,
frame: number,
callback: (arr: Float64Array, opts?: any) => void,
opts?: any
): void {
const frameInfo = fitsImage.frameOffsets[frame];
if (!frameInfo) {
  console.error(`Frame ${frame} not found in frameOffsets.`);
  return;
}

const begin = frameInfo.begin;
const end = begin + fitsImage.frameLength;

if (end > fitsImage.buffer.byteLength) {
  console.error('Attempting to access data beyond buffer limits.');
  return;
}

const frameData = fitsImage.buffer.slice(begin, end);

// Check if the buffer length matches the expected frame size
const expectedByteLength = fitsImage.width * fitsImage.height * fitsImage.bytes;
if (frameData.byteLength !== expectedByteLength) {
  console.error('Frame data length mismatch. Expected:', expectedByteLength, 'Got:', frameData.byteLength);
  return;
}

try {
  const pixelArray = new Float64Array(frameData);

  // Apply BZERO and BSCALE if needed
  for (let i = 0; i < pixelArray.length; i++) {
    pixelArray[i] = fitsImage.bzero + fitsImage.bscale * pixelArray[i];
  }

  // Call the callback with the processed data
  callback(pixelArray, opts);
} catch (error) {
  console.error('Error processing frame data:', error);
}
}

// Utility function to convert FITS image data to ImageData format for display
convertFitsToImageData(imageData: Float64Array, width: number, height: number): ImageData {
const imageDataArray = new Uint8ClampedArray(width * height * 4); // RGBA array

// Normalize and map the FITS data to the canvas data array
let min = Infinity;
let max = -Infinity;

for (let i = 0; i < imageData.length; i++) {
  if (imageData[i] < min) min = imageData[i];
  if (imageData[i] > max) max = imageData[i];
}

for (let i = 0; i < imageData.length; i++) {
  // Normalize the pixel value to 0-255 range
  const normalizedValue = Math.floor(255 * (imageData[i] - min) / (max - min));

  // Set the RGBA values
  const index = i * 4;
  imageDataArray[index] = normalizedValue; // Red channel
  imageDataArray[index + 1] = normalizedValue; // Green channel
  imageDataArray[index + 2] = normalizedValue; // Blue channel
  imageDataArray[index + 3] = 255; // Alpha channel (fully opaque)
}

return new ImageData(imageDataArray, width, height);
}

}
