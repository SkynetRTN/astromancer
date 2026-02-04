import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ChartInfo} from "../shared/charts/chart.interface";
import {Chart} from "chart.js";
import {
  CurveChartInfo,
  CurveChartInfoStorageObject,
  CurveData,
  CurveDataDict,
  CurveImpl,
  CurveInterface,
  CurveStorage,
} from "./curve.service.util";
import {MyData} from "../shared/data/data.interface";
import {ECharts} from "echarts";
import * as Highcharts from 'highcharts';
import {UpdateSource} from "../shared/data/utils";

@Injectable()
export class CurveService implements ChartInfo, MyData, CurveInterface {
  // Decorator Design Pattern
  /**
   * @private chartInfo: CurveChartInfo
   * Delegate Chart Information to CurveChartInfo
   */
  private chartInfo: CurveChartInfo = new CurveChartInfo();
  /**
   * @private curveData: CurveData
   * Delegate Data to CurveData
   */
  private curveData: CurveData = new CurveData();
  /**
   * @private curveImpl: CurveImpl
   * Delegate Curve interface feature to CurveImpl
   */

  private curveImpl: CurveImpl = new CurveImpl();

  private chart!: ECharts;
  private highChart?: Highcharts.Chart;
  /**
   *
   */
  private curveStorage!: CurveStorage;
  private dataSubject = new BehaviorSubject<CurveDataDict[]>(this.getData());
  data$ = this.dataSubject.asObservable();
  private dataKeysSubject = new BehaviorSubject<string[]>(this.getDataLabelArray());
  dataKeys$ = this.dataKeysSubject.asObservable();
  private chartInfoSubject = new BehaviorSubject<UpdateSource>(UpdateSource.INIT);
  chartInfo$ = this.chartInfoSubject.asObservable();
  private interfaceSubject = new BehaviorSubject<CurveInterface>(this.curveImpl);
  interface$ = this.interfaceSubject.asObservable();

  constructor() {
    this.curveStorage = new CurveStorage(
      CurveData.getDefaultData(),
      CurveChartInfo.getDefaultStorageObject(),
      CurveImpl.getDefaultStorageObject());
    this.curveData.setData(this.curveStorage.getData());
    this.chartInfo.setStorageObject(this.curveStorage.getChartInfo());
    this.curveImpl.setStorageObject(this.curveStorage.getInterface());
  }

  public getChartInfoObject(): ChartInfo {
    return this.chartInfo;
  }

  public getDataObject(): MyData {
    return this.curveData;
  }

  public getInterfaceObject(): any {
    return this.curveImpl;
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
    return this.chartInfo.getDataLabelByCurveCount(this.getCurveCount());
  }

  public getDataLabelArray(): string[] {
    return this.chartInfo.getTableLabels();
  }

  public setChartTitle(title: string): void {
    this.chartInfo.setChartTitle(title);
    this.curveStorage.saveChartInfo(this.chartInfo.getStorageObject());
    this.chartInfoSubject.next(UpdateSource.INTERFACE);
  }

  public setXAxisLabel(label: string): void {
    this.chartInfo.setXAxisLabel(label);
    this.curveStorage.saveChartInfo(this.chartInfo.getStorageObject());
    this.chartInfoSubject.next(UpdateSource.INTERFACE);
  }

  public setYAxisLabel(label: string): void {
    this.chartInfo.setYAxisLabel(label);
    this.curveStorage.saveChartInfo(this.chartInfo.getStorageObject());
    this.chartInfoSubject.next(UpdateSource.INTERFACE);
  }

  public setDataLabel(label: string): void {
    this.chartInfo.setDataLabel(label);
    this.curveStorage.saveChartInfo(this.chartInfo.getStorageObject());
    this.chartInfoSubject.next(UpdateSource.INTERFACE);
    this.dataKeysSubject.next(this.getDataLabelArray());
  }

  getStorageObject() {
    return this.chartInfo.getStorageObject();
  }

  setStorageObject(storageObject: CurveChartInfoStorageObject): void {
    this.chartInfo.setStorageObject(storageObject);
  }

  // MyData Methods
  public getData(): CurveDataDict[] {
    return this.curveData.getCurveData(this.getCurveCount());
  }

  public getDataArray(): any[] {
    return this.curveData.getDataArray();
  }

  public setData(dataDict: CurveDataDict[]): void {
    this.curveData.setData(dataDict);
    this.curveStorage.saveData(dataDict);
    this.dataSubject.next(this.getData());
  }


  public addRow(index: number, amount: number): void {
    this.curveData.addRow(index, amount);
    this.dataSubject.next(this.getData());
  }

  public removeRow(index: number, amount: number): void {
    this.curveData.removeRow(index, amount);
    this.dataSubject.next(this.getData());
  }

  // CurveInterface Methods
  public getCurveCount(): number {
    return this.curveImpl.getCurveCount();
  }

  public getIsMagnitudeOn(): boolean {
    return this.curveImpl.getIsMagnitudeOn();
  }

  public setCurveCount(count: number): void {
    this.curveImpl.setCurveCount(count);
    this.curveStorage.saveInterface(this.curveImpl.getStorageObject());
    this.dataKeysSubject.next(this.getDataLabelArray());
    this.dataSubject.next(this.getData());
    this.chartInfoSubject.next(UpdateSource.INIT);
  }

  public setIsMagnitudeOn(isMagnitudeOn: boolean): void {
    this.curveImpl.setIsMagnitudeOn(isMagnitudeOn);
    this.curveStorage.saveInterface(this.curveImpl.getStorageObject());
    this.interfaceSubject.next(this.curveImpl);
  }

  // CurveStorage Methods
  public resetData(): void {
    this.setData(CurveData.getDefaultData());
    this.curveStorage.resetData();
    this.dataSubject.next(this.getData());
  }

  public resetChartInfo(): void {
    this.chartInfo.setStorageObject(CurveChartInfo.getDefaultStorageObject());
    this.curveStorage.resetChartInfo();
    this.chartInfoSubject.next(UpdateSource.RESET);
    this.dataKeysSubject.next(this.getDataLabelArray());
  }

  public resetInterface(): void {
    this.curveImpl.setStorageObject(CurveImpl.getDefaultStorageObject());
    this.curveStorage.resetInterface();
    this.interfaceSubject.next(this.curveImpl);
    this.chartInfoSubject.next(UpdateSource.RESET);
    this.dataSubject.next(this.getData());
  }

  public getChartJs(): Chart {
    return (Chart.getChart("curve-chart") as Chart);
  }

  public setEChart(chart: ECharts): void {
    this.chart = chart;
  }

  public getEChart(): ECharts {
    return this.chart;
  }

  public setHighChart(highChart: Highcharts.Chart): void {
    this.highChart = highChart;
  }

  public getHighChart(): Highcharts.Chart | undefined {
    return this.highChart;
  }

}
