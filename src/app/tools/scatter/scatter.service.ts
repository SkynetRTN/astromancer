import {Injectable} from '@angular/core';
import {
  ScatterChartInfo,
  ScatterChartInfoStorageObject,
  ScatterData,
  ScatterDataDict,
  ScatterInterfaceStorageObject,
  ScatterModel,
  ScatterModelInterface,
  ScatterStorage
} from "./scatter.service.util";
import {MyData} from "../shared/data/data.interface";
import {BehaviorSubject} from "rxjs";
import * as Highcharts from "highcharts";
import {ChartInfo} from "../shared/charts/chart.interface";

import {UpdateSource} from "../shared/data/utils";

@Injectable()
export class ScatterService implements MyData, ChartInfo, ScatterModel {

  private scatterData: ScatterData = new ScatterData();
  private scatterChartInfo: ScatterChartInfo = new ScatterChartInfo();
  private scatterInterface: ScatterModelInterface = new ScatterModelInterface();

  private scatterStorage: ScatterStorage = new ScatterStorage();

  private highChart!: Highcharts.Chart;

  private dataSubject: BehaviorSubject<MyData> = new BehaviorSubject<MyData>(this.scatterData);
  public data$ = this.dataSubject.asObservable();
  private chartInfoSubject: BehaviorSubject<ScatterChartInfo> = new BehaviorSubject<ScatterChartInfo>(this.scatterChartInfo);
  public chartInfo$ = this.chartInfoSubject.asObservable();
  private interfaceSubject: BehaviorSubject<UpdateSource> = new BehaviorSubject<UpdateSource>(UpdateSource.INIT);
  public interface$ = this.interfaceSubject.asObservable();

  constructor() {
    this.scatterData.setData(this.scatterStorage.getData());
    this.scatterChartInfo.setStorageObject(this.scatterStorage.getChartInfo());
    this.scatterInterface.setModelStorageObject(this.scatterStorage.getInterface());
  }

  /** ScatterModel Methods**/

  getDiameter(): number {
    return this.scatterInterface.getDiameter();
  }

  getDistance(): number {
    return this.scatterInterface.getDistance();
  }

  getModel(): number[][] {
    return this.scatterInterface.getModel();
  }

  getModelStorageObject(): ScatterInterfaceStorageObject {
    return this.scatterInterface.getModelStorageObject();
  }

  setDiameter(diameter: number): void {
    this.scatterInterface.setDiameter(diameter);
    this.scatterStorage.saveInterface(this.scatterInterface.getModelStorageObject());
    this.interfaceSubject.next(UpdateSource.INTERFACE);
  }

  setDistance(distance: number): void {
    this.scatterInterface.setDistance(distance);
    this.scatterStorage.saveInterface(this.scatterInterface.getModelStorageObject());
    this.interfaceSubject.next(UpdateSource.INTERFACE);
  }

  setModelStorageObject(storageObject: ScatterInterfaceStorageObject): void {
    this.scatterInterface.setModelStorageObject(storageObject);
    this.interfaceSubject.next(UpdateSource.INTERFACE);
  }

  resetModel(): void {
    this.scatterInterface.setModelStorageObject(ScatterModelInterface.getDefaultStorageObject());
    this.scatterStorage.saveInterface(this.scatterInterface.getModelStorageObject());
    this.interfaceSubject.next(UpdateSource.RESET);
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
