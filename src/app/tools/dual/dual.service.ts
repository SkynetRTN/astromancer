import {Injectable} from '@angular/core';
import {DualChartInfo, DualChartInfoStorageObject, DualData, DualDataDict, DualStorage} from "./dual.service.util";
import {BehaviorSubject, Observable} from "rxjs";
import {MyData} from "../shared/data/data.interface";
import {ChartInfo} from "../shared/charts/chart.interface";

@Injectable()
export class DualService implements MyData, ChartInfo {

  private dualData: DualData = new DualData();
  private dualChartInfo: DualChartInfo = new DualChartInfo();

  private dualStorage: DualStorage = new DualStorage();

  private dataSubject: BehaviorSubject<DualData> = new BehaviorSubject<DualData>(this.dualData);
  public data$: Observable<DualData> = this.dataSubject.asObservable();
  private chartInfoSubject: BehaviorSubject<DualChartInfo> = new BehaviorSubject<DualChartInfo>(this.dualChartInfo);
  public chartInfo$: Observable<DualChartInfo> = this.chartInfoSubject.asObservable();

  constructor() {
    this.dualData.setData(this.dualStorage.getData());
    this.dualChartInfo.setStorageObject(this.dualStorage.getChartInfo());
  }

  /**ChartInfo interface implementation**/

  getChartTitle(): string {
    return this.dualChartInfo.getChartTitle();
  }

  getDataLabel(): string {
    return this.dualChartInfo.getDataLabel();
  }

  getDataLabelArray(): string[] {
    return this.dualChartInfo.getDataLabelArray();
  }

  getStorageObject(): DualChartInfoStorageObject {
    return this.dualChartInfo.getStorageObject();
  }

  getXAxisLabel(): string {
    return this.dualChartInfo.getXAxisLabel();
  }

  getYAxisLabel(): string {
    return this.dualChartInfo.getYAxisLabel();
  }

  setChartTitle(title: string): void {
    this.dualChartInfo.setChartTitle(title);
    this.dualStorage.saveChartInfo(this.dualChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.dualChartInfo);
  }

  setDataLabel(data: string): void {
    this.dualChartInfo.setDataLabel(data);
    this.dualStorage.saveChartInfo(this.dualChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.dualChartInfo);
    this.dataSubject.next(this.dualData);
  }

  setStorageObject(storageObject: DualChartInfoStorageObject): void {
    this.dualChartInfo.setStorageObject(storageObject);
    this.dualStorage.saveChartInfo(this.dualChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.dualChartInfo);
  }

  setXAxisLabel(xAxis: string): void {
    this.dualChartInfo.setXAxisLabel(xAxis);
    this.dualStorage.saveChartInfo(this.dualChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.dualChartInfo);
  }

  setYAxisLabel(yAxis: string): void {
    this.dualChartInfo.setYAxisLabel(yAxis);
    this.dualStorage.saveChartInfo(this.dualChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.dualChartInfo);
  }

  resetChartInfo() {
    this.dualChartInfo.setStorageObject(DualChartInfo.getDefaultChartInfo());
    this.dualStorage.saveChartInfo(this.dualChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.dualChartInfo);
  }


  /**MyData interface implementation**/

  addRow(index: number, amount: number): void {
    this.dualData.addRow(index, amount);
    this.dualStorage.saveData(this.dualData.getData());
    this.dataSubject.next(this.dualData);
  }

  getData(): DualDataDict[] {
    return this.dualData.getData();
  }

  getDataArray(): number[][][] {
    return this.dualData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.dualData.removeRow(index, amount);
    this.dualStorage.saveData(this.dualData.getData());
    this.dataSubject.next(this.dualData);
  }

  setData(data: DualDataDict[]): void {
    this.dualData.setData(data);
    this.dualStorage.saveData(this.dualData.getData());
    this.dataSubject.next(this.dualData);
  }

  resetData() {
    this.dualData.setData(DualData.getDefaultData());
    this.dualStorage.saveData(this.dualData.getData());
    this.dataSubject.next(this.dualData);
  }
}
