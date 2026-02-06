import {Injectable} from '@angular/core';
import {
  GalaxyChartInfo,
  GalaxyChartInfoStorageObject,
  GalaxyData,
  GalaxyDataDict,
  GalaxyInterface,
  GalaxyInterfaceImpl,
  GalaxyOptions,
  GalaxyStorage
} from "./galaxy.service.util";
import {BehaviorSubject} from "rxjs";
import {MyData} from "../shared/data/data.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import * as Highcharts from "highcharts";
import {ECharts} from 'echarts';

@Injectable()
export class GalaxyService implements MyData, GalaxyInterface, ChartInfo {
  private galaxyData: GalaxyData = new GalaxyData();
  private galaxyInterface: GalaxyInterfaceImpl = new GalaxyInterfaceImpl();
  private galaxyChartInfo: GalaxyChartInfo = new GalaxyChartInfo();

  private galaxyStorage: GalaxyStorage = new GalaxyStorage();

  private dataSubject: BehaviorSubject<GalaxyData> = new BehaviorSubject<GalaxyData>(this.galaxyData);
  public data$ = this.dataSubject.asObservable();
  private interfaceSubject: BehaviorSubject<GalaxyOptions> = new BehaviorSubject<GalaxyOptions>(this.galaxyInterface.getChannel());
  public interface$ = this.interfaceSubject.asObservable();
  private chartInfoSubject: BehaviorSubject<GalaxyChartInfo> = new BehaviorSubject<GalaxyChartInfo>(this.galaxyChartInfo);
  public chartInfo$ = this.chartInfoSubject.asObservable();

  private highChart!: Highcharts.Chart;
  private chart!: ECharts;

  constructor() {
    this.galaxyData.setData(this.galaxyStorage.getData());
    this.galaxyInterface.setChannel(this.galaxyStorage.getInterface());
    this.galaxyChartInfo.setStorageObject(this.galaxyStorage.getChartInfo());
  }


  /** ChartInfo Methods **/

  getChartTitle(): string {
    return this.galaxyChartInfo.getChartTitle();
  }

  getDataLabel(): string {
    return this.galaxyChartInfo.getDataLabel();
  }

  getStorageObject(): any {
    return this.galaxyChartInfo.getStorageObject();
  }

  getXAxisLabel(): string {
    return this.galaxyChartInfo.getXAxisLabel();
  }

  getYAxisLabel(): string {
    return this.galaxyChartInfo.getYAxisLabel();
  }

  setChartTitle(title: string): void {
    this.galaxyChartInfo.setChartTitle(title);
    this.galaxyStorage.saveChartInfo(this.galaxyChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.galaxyChartInfo);
  }

  setDataLabel(data: string): void {
    this.galaxyChartInfo.setDataLabel(data);
    this.galaxyStorage.saveChartInfo(this.galaxyChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.galaxyChartInfo);
    this.dataSubject.next(this.galaxyData);
  }

  setStorageObject(storageObject: GalaxyChartInfoStorageObject): void {
    this.galaxyChartInfo.setStorageObject(storageObject);
    this.galaxyStorage.saveChartInfo(this.galaxyChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.galaxyChartInfo);
  }

  setXAxisLabel(xAxis: string): void {
    this.galaxyChartInfo.setXAxisLabel(xAxis);
    this.galaxyStorage.saveChartInfo(this.galaxyChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.galaxyChartInfo);
  }

  setYAxisLabel(yAxis: string): void {
    this.galaxyChartInfo.setYAxisLabel(yAxis);
    this.galaxyStorage.saveChartInfo(this.galaxyChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.galaxyChartInfo);
  }

  resetChartInfo(): void {
    this.galaxyChartInfo.setStorageObject(GalaxyChartInfo.getDefaultStorageObject());
    this.galaxyChartInfo.setDataLabel(this.getChannel());
    this.galaxyStorage.saveChartInfo(this.galaxyChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.galaxyChartInfo);
  }


  /** GalaxyInterface Methods **/

  getChannel(): GalaxyOptions {
    return this.galaxyInterface.getChannel();
  }

  setChannel(channel: GalaxyOptions): void {
    this.galaxyInterface.setChannel(channel);
    this.galaxyStorage.saveInterface(this.galaxyInterface.getChannel());
    this.interfaceSubject.next(this.galaxyInterface.getChannel());
    this.setDataLabel(this.galaxyInterface.getChannel());
  }


  /** MyData Methods**/


  addRow(index: number, amount: number): void {
    this.galaxyData.addRow(index, amount);
    this.galaxyStorage.saveData(this.galaxyData.getData());
    this.dataSubject.next(this.galaxyData);
  }

  getData(): GalaxyDataDict[] {
    return this.galaxyData.getData();
  }

  getDataArray(): number[][][] {
    return this.galaxyData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.galaxyData.removeRow(index, amount);
    this.galaxyStorage.saveData(this.galaxyData.getData());
    this.dataSubject.next(this.galaxyData);
  }

  setData(data: GalaxyDataDict[]): void {
    this.galaxyData.setData(data);
    this.galaxyStorage.saveData(this.galaxyData.getData());
    this.dataSubject.next(this.galaxyData);
  }

  resetData(): void {
    this.galaxyData.setData(GalaxyData.getDefaultData());
    this.galaxyStorage.saveData(this.galaxyData.getData());
    this.dataSubject.next(this.galaxyData);
  }

  setHighChart(chart: Highcharts.Chart): void {
    this.highChart = chart;
  }

  getHighChart(): Highcharts.Chart {
    return this.highChart;
  }

  public setEChart(chart: ECharts): void {
    this.chart = chart;
  }

  public getEChart(): ECharts {
    return this.chart;
  }

}
