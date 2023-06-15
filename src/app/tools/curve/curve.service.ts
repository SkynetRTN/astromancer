import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ChartInfo} from "../shared/charts/chart.interface";
import {Chart} from "chart.js";
import {CurveChartInfo, CurveData, CurveDataDict, CurveImpl, CurveInterface, CurveStorage,} from "./curve.service.util";
import {MyData} from "../shared/data/data.interface";

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
  /**
   *
   */
  private curveStorage!: CurveStorage;
  private dataSubject = new BehaviorSubject<CurveDataDict[]>(this.getData());
  data$ = this.dataSubject.asObservable();
  private dataKeysSubject = new BehaviorSubject<string[]>(this.getDataLabelArray());
  dataKeys$ = this.dataKeysSubject.asObservable();
  private chartInfoSubject = new BehaviorSubject<ChartInfo>(this.chartInfo);
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
    this.chartInfoSubject.next(this.chartInfo);
  }

  public setXAxisLabel(label: string): void {
    this.chartInfo.setXAxisLabel(label);
    this.curveStorage.saveChartInfo(this.chartInfo.getStorageObject());
    this.chartInfoSubject.next(this.chartInfo);
  }

  public setYAxisLabel(label: string): void {
    this.chartInfo.setYAxisLabel(label);
    this.curveStorage.saveChartInfo(this.chartInfo.getStorageObject());
    this.chartInfoSubject.next(this.chartInfo);
  }

  public setDataLabel(label: string): void {
    this.chartInfo.setDataLabel(label);
    this.curveStorage.saveChartInfo(this.chartInfo.getStorageObject());
    this.chartInfoSubject.next(this.chartInfo);
    this.dataKeysSubject.next(this.getDataLabelArray());
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
    this.chartInfoSubject.next(this.chartInfo);
  }

  public setIsMagnitudeOn(isMagnitudeOn: boolean): void {
    this.curveImpl.setIsMagnitudeOn(isMagnitudeOn);
    this.curveStorage.saveInterface(this.curveImpl.getStorageObject());
    this.chartInfoSubject.next(this.chartInfo);
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
    this.chartInfoSubject.next(this.chartInfo);
  }

  public resetInterface(): void {
    this.curveImpl.setStorageObject(CurveImpl.getDefaultStorageObject());
    this.curveStorage.resetInterface();
    this.interfaceSubject.next(this.curveImpl);
    this.chartInfoSubject.next(this.chartInfo);
    this.dataSubject.next(this.getData());
  }

  public getChart(): Chart {
    return (Chart.getChart("curve-chart") as Chart);
  }

}

