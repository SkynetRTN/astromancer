import {Injectable} from '@angular/core';
import {MyData} from "../shared/data/data.interface";
import {
  VenusChartInfo,
  VenusChartInfoStorageObject,
  VenusData,
  VenusDataDict,
  VenusModels,
  VenusStorage
} from "./venus.service.util";
import {BehaviorSubject, Observable} from "rxjs";
import {MyStorage} from "../shared/storage/storage.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import * as Highcharts from "highcharts";

@Injectable()
export class VenusService implements MyData, ChartInfo {

  private venusStorage: MyStorage = new VenusStorage();
  private venusData: MyData = new VenusData();
  private venusChartInfo: ChartInfo = new VenusChartInfo();


  private dataSubject: BehaviorSubject<VenusDataDict[]>
    = new BehaviorSubject<VenusDataDict[]>(this.venusData.getData());
  public data$: Observable<VenusDataDict[]> = this.dataSubject.asObservable();
  private chartInfoSubject: BehaviorSubject<ChartInfo>
    = new BehaviorSubject<ChartInfo>(this.venusChartInfo);
  public chartInfo$: Observable<ChartInfo> = this.chartInfoSubject.asObservable();

  private highChart!: Highcharts.Chart;

  constructor() {
    this.venusData.setData(this.venusStorage.getData());
    this.venusChartInfo.setStorageObject(this.venusStorage.getChartInfo());
  }

  /** Venus Models**/

  public getGeocentricModelDataUpper(): number[][] {
    return this.limitPrecision(VenusModels.geocentric(10.15, 60, 0.445), 3);
  }

  public getGeocentricModelDataLower(): number[][] {
    return this.limitPrecision(VenusModels.geocentric(10.15, 60, 0.8), 3);
  }

  public getHeliocentricModelData(): number[][] {
    return this.limitPrecision(VenusModels.heliocentric(10.15, 60), 3);
  }


  /** ChartInfo Methods **/

  getChartTitle(): string {
    return this.venusChartInfo.getChartTitle();
  }

  getXAxisLabel(): string {
    return this.venusChartInfo.getXAxisLabel();
  }

  getYAxisLabel(): string {
    return this.venusChartInfo.getYAxisLabel();
  }

  getDataLabel(): string {
    return this.venusChartInfo.getDataLabel();
  }

  getStorageObject(): VenusChartInfoStorageObject {
    return this.venusChartInfo.getStorageObject();
  }

  setChartTitle(title: string): void {
    this.venusChartInfo.setChartTitle(title);
    this.venusStorage.saveChartInfo(this.venusChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.venusChartInfo);
  }

  setXAxisLabel(xAxis: string): void {
    this.venusChartInfo.setXAxisLabel(xAxis);
    this.venusStorage.saveChartInfo(this.venusChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.venusChartInfo);
  }

  setYAxisLabel(yAxis: string): void {
    this.venusChartInfo.setYAxisLabel(yAxis);
    this.venusStorage.saveChartInfo(this.venusChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.venusChartInfo);
  }

  setDataLabel(data: string): void {
    this.venusChartInfo.setDataLabel(data);
    this.venusStorage.saveChartInfo(this.venusChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.venusChartInfo);
    this.dataSubject.next(this.getData());
  }

  setStorageObject(storageObject: any): void {
    this.venusChartInfo.setStorageObject(storageObject);
    this.venusStorage.saveChartInfo(this.venusChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.venusChartInfo);
  }

  resetChartInfo(): void {
    this.venusChartInfo.setStorageObject(VenusChartInfo.getDefaultChartInfo());
    this.venusStorage.saveChartInfo(this.venusChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.venusChartInfo);
    this.dataSubject.next(this.getData());
  }

  /** MyData Methods **/

  addRow(index: number, amount: number): void {
    this.venusData.addRow(index, amount);
    this.venusStorage.saveData(this.venusData.getData());
    this.dataSubject.next(this.venusData.getData());
  }

  getData(): VenusDataDict[] {
    return this.venusData.getData();
  }

  getDataArray(): (number | null)[][] {
    return this.venusData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.venusData.removeRow(index, amount);
    this.venusStorage.saveData(this.venusData.getData());
    this.dataSubject.next(this.venusData.getData());
  }

  setData(data: any[]): void {
    this.venusData.setData(data);
    this.venusStorage.saveData(data);
    this.dataSubject.next(this.venusData.getData());
  }

  resetData(): void {
    this.setData(VenusData.getDefaultData());
  }

  setHighChart(highChart: Highcharts.Chart): void {
    this.highChart = highChart;
  }

  getHighChart(): Highcharts.Chart {
    return this.highChart;
  }


  private limitPrecision(dataArray: number[][], precision: number): number[][] {
    return dataArray.map(
      (row: number[]) => {
        return row.map((value: number) => {
          return value ? parseFloat(value.toFixed(precision)) : value;
        });
      });
  }
}
