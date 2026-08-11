import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';

import { ChartInfo } from '../shared/charts/chart.interface';
import { MyData } from '../shared/data/data.interface';
import { UpdateSource } from '../shared/data/utils';
import { environment } from '../../../environments/environment';
import {
  RadioCatalogResponse,
  RadioSearchChartInfo,
  RadioSearchChartInfoStorageObject,
  RadioSearchData,
  RadioSearchDataDict,
  RadioSearchParamDataDict,
  RadioSearchStorage,
} from './radiosearch.service.util';

/**
 * The tool's model: chart info, scatter data, and localStorage persistence.
 *
 * Named for the chart because that is its only consumer, but it plays the role
 * `<Tool>Service` plays in every other Astromancer tool. The HTTP and FITS
 * helpers live in {@link RadioSearchService} below.
 */
@Injectable()
export class RadioSearchHighChartService implements ChartInfo, MyData {
  private chartInfo: RadioSearchChartInfo = new RadioSearchChartInfo();
  private radioSearchData: RadioSearchData = new RadioSearchData();
  private highChart!: Highcharts.Chart;

  private dataSubject = new BehaviorSubject<RadioSearchDataDict[]>(this.radioSearchData.getData());
  private paramDataSubject = new BehaviorSubject<RadioSearchParamDataDict[]>(this.radioSearchData.getParamData());
  data$ = this.dataSubject.asObservable();
  paramdata$ = this.paramDataSubject.asObservable();

  private chartInfoSubject = new BehaviorSubject<UpdateSource>(UpdateSource.INIT);
  chartInfo$ = this.chartInfoSubject.asObservable();

  constructor() {
    this.radioSearchData.setData(RadioSearchStorage.getData());
    this.radioSearchData.setParamData(RadioSearchStorage.getParamData());
    this.chartInfo.setStorageObject(RadioSearchStorage.getChartInfo());
  }

  // --- ChartInfo -------------------------------------------------------------

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

  /** Required by ChartInfo. This tool has no per-series data label. */
  public setDataLabel(_label: string): void {
    this.chartInfo.setDataLabel();
    RadioSearchStorage.saveChartInfo(this.chartInfo.getStorageObject());
    this.chartInfoSubject.next(UpdateSource.INTERFACE);
  }

  // --- MyData ----------------------------------------------------------------

  public getData(): RadioSearchDataDict[] {
    return this.radioSearchData.getData();
  }

  public getParamData(): RadioSearchParamDataDict[] {
    return this.radioSearchData.getParamData();
  }

  public getDataArray(): number[][] {
    return this.radioSearchData.getDataArray();
  }

  public getParamDataArray(): [number, string, string][] {
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

  /** Required by MyData. Unused - this tool has no editable data table. */
  public addRow(index: number, amount: number): void {
    this.radioSearchData.addRow(index, amount);
    RadioSearchStorage.saveData(this.radioSearchData.getData());
    this.dataSubject.next(this.getData());
  }

  /** Required by MyData. Unused - this tool has no editable data table. */
  public removeRow(index: number, amount: number): void {
    this.radioSearchData.removeRow(index, amount);
    RadioSearchStorage.saveData(this.radioSearchData.getData());
    this.dataSubject.next(this.getData());
  }

  // --- Reset -----------------------------------------------------------------

  public resetData(): void {
    this.setData(RadioSearchData.getDefaultDataAsArray());
    this.setParams(RadioSearchData.getDefaultParamDataAsArray());
    RadioSearchStorage.resetData();
    this.dataSubject.next(this.getData());
  }

  public resetChartInfo(): void {
    this.chartInfo.setStorageObject(RadioSearchChartInfo.getDefaultStorageObject());
    RadioSearchStorage.resetChartInfo();
    this.chartInfoSubject.next(UpdateSource.RESET);
  }

  // --- Storage and chart handle ----------------------------------------------

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

/**
 * Backend queries and coordinate formatting.
 *
 * The request/response shapes here are a fixed contract with the Flask
 * backend - do not rename fields.
 */
@Injectable()
export class RadioSearchService {
  constructor(private http: HttpClient) {}

  /**
   * Query the radio catalogue for sources within the map's footprint.
   *
   * @param rccords 'equatorial' or 'galactic'
   * @param ra      map centre longitude in degrees (RA, or galactic longitude)
   * @param dec     map centre latitude in degrees (Dec, or galactic latitude)
   * @param width   map width in degrees
   * @param height  map height in degrees
   */
  fetchRadioCatalog(
    rccords: string,
    ra: number,
    dec: number,
    width: number,
    height: number,
  ): Observable<RadioCatalogResponse> {
    const payload = { rccords, ra, dec, width, height };
    return this.http.post<RadioCatalogResponse>(
      `${environment.apiUrl}/radiosearch/radio-catalog/query`,
      payload,
    );
  }

  /**
   * Fetch a previously submitted catalogue query by job id.
   *
   * Nothing in the UI reaches this yet; kept because it is part of the backend
   * surface. Response shape is `{ output_sources: Source[] }`.
   */
  getRadioCatalogResults(id: number): Observable<unknown> {
    return this.http.get(`${environment.apiUrl}/radiosearch/radio-catalog/query`, {
      params: { id: id.toString() },
    });
  }

  public convertToHMS(ra: number): string {
    const hours = Math.floor(ra / 15);
    const minutes = Math.floor((ra / 15 - hours) * 60);
    const seconds = Math.round((((ra / 15 - hours) * 60 - minutes) * 60));
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  public convertToDMS(dec: number): string {
    const sign = dec < 0 ? '-' : '+';
    const absDec = Math.abs(dec);
    const degrees = Math.floor(absDec);
    const arcminutes = Math.floor((absDec - degrees) * 60);
    const arcseconds = Math.round((((absDec - degrees) * 60 - arcminutes) * 60));
    return `${sign}${degrees}° ${arcminutes}' ${arcseconds}"`;
  }
}
