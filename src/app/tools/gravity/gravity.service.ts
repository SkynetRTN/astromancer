import {Injectable} from '@angular/core';
import {
  GravityChartInfo,
  GravityChartInfoStorageObject,
  GravityData,
  GravityDataDict,
  GravityInterface,
  GravityInterfaceImpl,
  GravityOptions,
  GravityStorage
} from "./gravity.service.util";
import {BehaviorSubject} from "rxjs";
import {MyData} from "../shared/data/data.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import * as Highcharts from "highcharts";

@Injectable()
export class GravityService implements MyData, GravityInterface, ChartInfo {
  private gravityData: GravityData = new GravityData();
  private gravityInterface: GravityInterfaceImpl = new GravityInterfaceImpl();
  private gravityChartInfo: GravityChartInfo = new GravityChartInfo();

  private gravityStorage: GravityStorage = new GravityStorage();

  private dataSubject: BehaviorSubject<GravityData> = new BehaviorSubject<GravityData>(this.gravityData);
  public data$ = this.dataSubject.asObservable();
  private interfaceSubject: BehaviorSubject<GravityOptions> = new BehaviorSubject<GravityOptions>(this.gravityInterface.getChannel());
  public interface$ = this.interfaceSubject.asObservable();
  private chartInfoSubject: BehaviorSubject<GravityChartInfo> = new BehaviorSubject<GravityChartInfo>(this.gravityChartInfo);
  public chartInfo$ = this.chartInfoSubject.asObservable();

  private highChart!: Highcharts.Chart;

  constructor() {
    this.gravityData.setData(this.gravityStorage.getData());
    this.gravityInterface.setChannel(this.gravityStorage.getInterface());
    this.gravityChartInfo.setStorageObject(this.gravityStorage.getChartInfo());
  }


  /** ChartInfo Methods **/

  getChartTitle(): string {
    return this.gravityChartInfo.getChartTitle();
  }

  getDataLabel(): string {
    return this.gravityChartInfo.getDataLabel();
  }

  getStorageObject(): any {
    return this.gravityChartInfo.getStorageObject();
  }

  getXAxisLabel(): string {
    return this.gravityChartInfo.getXAxisLabel();
  }

  getYAxisLabel(): string {
    return this.gravityChartInfo.getYAxisLabel();
  }

  setChartTitle(title: string): void {
    this.gravityChartInfo.setChartTitle(title);
    this.gravityStorage.saveChartInfo(this.gravityChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.gravityChartInfo);
  }

  setDataLabel(data: string): void {
    this.gravityChartInfo.setDataLabel(data);
    this.gravityStorage.saveChartInfo(this.gravityChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.gravityChartInfo);
    this.dataSubject.next(this.gravityData);
  }

  setStorageObject(storageObject: GravityChartInfoStorageObject): void {
    this.gravityChartInfo.setStorageObject(storageObject);
    this.gravityStorage.saveChartInfo(this.gravityChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.gravityChartInfo);
  }

  setXAxisLabel(xAxis: string): void {
    this.gravityChartInfo.setXAxisLabel(xAxis);
    this.gravityStorage.saveChartInfo(this.gravityChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.gravityChartInfo);
  }

  setYAxisLabel(yAxis: string): void {
    this.gravityChartInfo.setYAxisLabel(yAxis);
    this.gravityStorage.saveChartInfo(this.gravityChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.gravityChartInfo);
  }

  resetChartInfo(): void {
    this.gravityChartInfo.setStorageObject(GravityChartInfo.getDefaultStorageObject());
    this.gravityChartInfo.setDataLabel(this.getChannel());
    this.gravityStorage.saveChartInfo(this.gravityChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.gravityChartInfo);
  }


  /** SpectrumInterface Methods **/

  getChannel(): GravityOptions {
    return this.gravityInterface.getChannel();
  }

  setChannel(channel: GravityOptions): void {
    this.gravityInterface.setChannel(channel);
    this.gravityStorage.saveInterface(this.gravityInterface.getChannel());
    this.interfaceSubject.next(this.gravityInterface.getChannel());
    this.setDataLabel(this.gravityInterface.getChannel());
  }


  /** MyData Methods**/


  addRow(index: number, amount: number): void {
    this.gravityData.addRow(index, amount);
    this.gravityStorage.saveData(this.gravityData.getData());
    this.dataSubject.next(this.gravityData);
  }

  getData(): GravityDataDict[] {
    return this.gravityData.getData();
  }

  getDataArray(): number[][][] {
    return this.gravityData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.gravityData.removeRow(index, amount);
    this.gravityStorage.saveData(this.gravityData.getData());
    this.dataSubject.next(this.gravityData);
  }

  setData(data: GravityDataDict[]): void {
    this.gravityData.setData(data);
    this.gravityStorage.saveData(this.gravityData.getData());
    this.dataSubject.next(this.gravityData);
  }

  resetData(): void {
    this.gravityData.setData(GravityData.getDefaultData());
    this.gravityStorage.saveData(this.gravityData.getData());
    this.dataSubject.next(this.gravityData);
  }

  setHighChart(chart: Highcharts.Chart): void {
    this.highChart = chart;
  }

  getHighChart(): Highcharts.Chart {
    return this.highChart;
  }

}
