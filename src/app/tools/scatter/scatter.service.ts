import {Injectable} from '@angular/core';
import {
  ScatterChartInfo,
  ScatterChartInfoStorageObject,
  ScatterData,
  ScatterDataDict,
  ScatterStorage
} from "./scatter.service.util";
import {MyData} from "../shared/data/data.interface";
import {BehaviorSubject} from "rxjs";
import * as Highcharts from "highcharts";
import {ChartInfo} from "../shared/charts/chart.interface";

@Injectable()
export class ScatterService implements MyData, ChartInfo {

  private scatterData: ScatterData = new ScatterData();
  private scatterChartInfo: ScatterChartInfo = new ScatterChartInfo();

  private scatterStorage: ScatterStorage = new ScatterStorage();

  private highChart!: Highcharts.Chart;

  private dataSubject: BehaviorSubject<MyData> = new BehaviorSubject<MyData>(this.scatterData);
  public data$ = this.dataSubject.asObservable();
  private chartInfoSubject: BehaviorSubject<ScatterChartInfo> = new BehaviorSubject<ScatterChartInfo>(this.scatterChartInfo);
  public chartInfo$ = this.chartInfoSubject.asObservable();

  constructor() {
    this.scatterData.setData(this.scatterStorage.getData());
    this.scatterChartInfo.setStorageObject(this.scatterStorage.getChartInfo());
  }


  /** ChartInfo Methods**/


  getChartTitle(): string {
    return this.scatterChartInfo.getChartTitle();
  }

  getXAxisLabel(): string {
    return this.scatterChartInfo.getXAxisLabel();
  }

  getYAxisLabel(): string {
    return this.scatterChartInfo.getYAxisLabel();
  }

  getDataLabel(): string {
    return this.scatterChartInfo.getDataLabel();
  }

  getStorageObject() {
    return this.scatterChartInfo.getStorageObject();
  }

  setChartTitle(title: string): void {
    this.scatterChartInfo.setChartTitle(title);
    this.scatterStorage.saveChartInfo(this.scatterChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.scatterChartInfo);
  }

  setXAxisLabel(xAxis: string): void {
    this.scatterChartInfo.setXAxisLabel(xAxis);
    this.scatterStorage.saveChartInfo(this.scatterChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.scatterChartInfo);
  }

  setYAxisLabel(yAxis: string): void {
    this.scatterChartInfo.setYAxisLabel(yAxis);
    this.scatterStorage.saveChartInfo(this.scatterChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.scatterChartInfo);
  }

  setDataLabel(data: string): void {
    this.scatterChartInfo.setDataLabel(data);
    this.scatterStorage.saveChartInfo(this.scatterChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.scatterChartInfo);
    this.dataSubject.next(this.scatterData);
  }

  setStorageObject(storageObject: ScatterChartInfoStorageObject): void {
    this.scatterChartInfo.setStorageObject(storageObject);
    this.scatterStorage.saveChartInfo(this.scatterChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.scatterChartInfo);
  }

  resetChartInfo(): void {
    this.scatterChartInfo.setStorageObject(ScatterChartInfo.getDefaultStorageObject());
    this.scatterStorage.saveChartInfo(this.scatterChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.scatterChartInfo);
  }


  /** MyData Methods**/

  addRow(index: number, amount: number): void {
    this.scatterData.addRow(index, amount);
    this.scatterStorage.saveData(this.scatterData.getData());
    this.dataSubject.next(this.scatterData);
  }

  getData(): ScatterDataDict[] {
    return this.scatterData.getData();
  }

  getDataArray(): (number | null)[][] {
    return this.scatterData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.scatterData.removeRow(index, amount);
    this.scatterStorage.saveData(this.scatterData.getData());
    this.dataSubject.next(this.scatterData);
  }

  setData(data: ScatterDataDict[]): void {
    this.scatterData.setData(data);
    this.scatterStorage.saveData(this.scatterData.getData());
    this.dataSubject.next(this.scatterData);
  }

  resetData(): void {
    this.scatterStorage.resetData();
    this.scatterData.setData(this.scatterStorage.getData());
    this.dataSubject.next(this.scatterData);
  }

  setHighChart(highChart: Highcharts.Chart): void {
    this.highChart = highChart;
  }

  getHighChart(): Highcharts.Chart {
    return this.highChart;
  }

}
