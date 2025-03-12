import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { ChartInfo } from "../shared/charts/chart.interface";
import { Chart } from "chart.js";
import {
  RadioSearchChartInfo,
  RadioSearchChartInfoStorageObject,
  RadioSearchData,
  RadioSearchDataDict,
  RadioSearchParamDataDict,
  RadioSearchStorage,
} from "./radiosearch.service.util";
import { MyData } from "../shared/data/data.interface";
import * as Highcharts from 'highcharts';
import { UpdateSource } from "../shared/data/utils";
import { HttpClient } from '@angular/common/http';
import { Source } from './radiosearch.service.util';
import {environment} from "../../../environments/environment";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


// @Injectable()
// export class RadioSearchCanvasService {
//   private fileSource = new BehaviorSubject<File | null>(null);
//   currentFile = this.fileSource.asObservable();

//   updateFile(file: File) {
//     this.fileSource.next(file);
//   }
// }


@Injectable()
export class RadioSearchHighChartService implements ChartInfo, MyData {
  private chartInfo: RadioSearchChartInfo = new RadioSearchChartInfo();
  private radioSearchData: RadioSearchData = new RadioSearchData();
  private highChart!: Highcharts.Chart;
  private radioSearchStorage: RadioSearchStorage = new RadioSearchStorage();

  // BehaviorSubjects for observables
  private dataSubject = new BehaviorSubject<RadioSearchDataDict[]>(this.radioSearchData.getData());
  private paramDataSubject = new BehaviorSubject<RadioSearchParamDataDict[]>(this.radioSearchData.getParamData());
  data$ = this.dataSubject.asObservable();
  paramdata$ = this.paramDataSubject.asObservable();

  private dataKeysSubject = new BehaviorSubject<string[]>(this.getDataLabelArray());
  dataKeys$ = this.dataKeysSubject.asObservable();

  private chartInfoSubject = new BehaviorSubject<UpdateSource>(UpdateSource.INIT);
  chartInfo$ = this.chartInfoSubject.asObservable();

  constructor(private http: HttpClient) {
    this.radioSearchData.setData(RadioSearchStorage.getData());
    this.radioSearchData.setParamData(RadioSearchStorage.getParamData());
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

  public getParamData(): RadioSearchParamDataDict[] {
    return this.radioSearchData.getParamData();
  }

  public getDataArray(): number[][] {
    return this.radioSearchData.getDataArray();
  }

  public getParamDataArray(): number[][] {
    return this.radioSearchData.getParamDataArray();
  }

  public setData(dataDict: RadioSearchDataDict[]): void {
    this.radioSearchData.setData(dataDict);
    RadioSearchStorage.saveData(dataDict);
    this.dataSubject.next(this.getData());
  }

  public setParams(dataDict: RadioSearchParamDataDict[]): void {
    this.radioSearchData.setParamData(dataDict);
    RadioSearchStorage.saveParamData(dataDict);
    this.paramDataSubject.next(this.getParamData());
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
    const defaultParamData = RadioSearchData.getDefaultParamDataAsArray();
    this.setData(defaultData);
    this.setParams(defaultParamData);
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
  public sources: { ra: number; dec: number }[] = [];
  public params: { targetFreq: number; threeC: number }[] = [];
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


  public getHeaderLength(buffer: ArrayBuffer): number {
    const text = new TextDecoder().decode(buffer);
    const cardSize = 80; // Each card is 80 bytes
    const headerEndIndex = text.indexOf('END');

    if (headerEndIndex === -1) {
      throw new Error('Invalid FITS header: END card not found.');
    }

    const headerBytes = (headerEndIndex + cardSize); // Include the END card
    return Math.ceil(headerBytes / 2880) * 2880; // Round up to nearest 2880 bytes
  }


  public unrollImage(pixelArray: number[], width: number, height: number, rollAmount: number): number[] {
    const unrolledArray = new Array(width * height);

    for (let y = 0; y < height; y++) {
      const rowStart = y * width;
      const rolledRow = pixelArray.slice(rowStart, rowStart + width); // Extract current row

      // Unroll the row: Move the last `rollAmount` pixels to the start
      const unrolledRow = [
        ...rolledRow.slice(width - rollAmount), // The "cutoff" part
        ...rolledRow.slice(0, width - rollAmount), // The remaining part
      ];

      // Place the unrolled row back in the array
      unrolledArray.splice(rowStart, width, ...unrolledRow);
    }

    return unrolledArray;
  }


  fetchRadioCatalog(rccords: string, ra: number, dec: number, width: number, height: number): Observable<any> {
    const payload = {rccords, ra, dec, width, height };
    return this.http.post(`${environment.apiUrl}/radiosearch/radio-catalog/query`, payload);
  }


  public convertToHMS(ra: number): string {
    const hours = Math.floor(ra / 15);
    const minutes = Math.floor((ra / 15 - hours) * 60);
    const seconds = Math.round((((ra / 15 - hours) * 60 - minutes) * 60));
    return `${hours}h ${minutes}m ${seconds}s`;
  }


  public convertToDMS(dec: number): string {
    const sign = dec < 0 ? "-" : "+";
    const absDec = Math.abs(dec);
    const degrees = Math.floor(absDec);
    const arcminutes = Math.floor((absDec - degrees) * 60);
    const arcseconds = Math.round((((absDec - degrees) * 60 - arcminutes) * 60));
    return `${sign}${degrees}° ${arcminutes}' ${arcseconds}"`;
  }  
}
