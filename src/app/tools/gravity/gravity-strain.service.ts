import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject} from "rxjs";
import * as Highcharts from "highcharts";

import {
  StrainChartInfo,
  StrainChartInfoStorageObject,
  StrainData,
  StrainDataDict,
  GravityInterface,
  GravityInterfaceImpl,
  StrainStorage
} from "./gravity.service.util";

import {MyData} from "../shared/data/data.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import { UpdateSource } from '../shared/data/utils';

@Injectable()
export class StrainService implements MyData, ChartInfo {
  private strainData: StrainData = new StrainData();

  private gravityChartInfo: StrainChartInfo = new StrainChartInfo();

  private storage: StrainStorage = new StrainStorage();

  private dataSubject: BehaviorSubject<StrainData> = new BehaviorSubject<StrainData>(this.strainData);
  public data$ = this.dataSubject.asObservable();
  private chartInfoSubject: BehaviorSubject<StrainChartInfo> = new BehaviorSubject<StrainChartInfo>(this.gravityChartInfo);
  public chartInfo$ = this.chartInfoSubject.asObservable();

  private highChart!: Highcharts.Chart;

  constructor() {
    this.strainData.setData(this.storage.getData());
    this.gravityChartInfo.setStorageObject(this.storage.getChartInfo());
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
    this.storage.saveChartInfo(this.gravityChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.gravityChartInfo);
  }

  setDataLabel(data: string): void {
    this.gravityChartInfo.setDataLabel(data);
    this.storage.saveChartInfo(this.gravityChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.gravityChartInfo);
    this.dataSubject.next(this.strainData);
  }

  setStorageObject(storageObject: StrainChartInfoStorageObject): void {
    this.gravityChartInfo.setStorageObject(storageObject);
    this.storage.saveChartInfo(this.gravityChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.gravityChartInfo);
  }

  setXAxisLabel(xAxis: string): void {
    this.gravityChartInfo.setXAxisLabel(xAxis);
    this.storage.saveChartInfo(this.gravityChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.gravityChartInfo);
  }

  setYAxisLabel(yAxis: string): void {
    this.gravityChartInfo.setYAxisLabel(yAxis);
    this.storage.saveChartInfo(this.gravityChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.gravityChartInfo);
  }

  resetChartInfo(): void {
    this.gravityChartInfo.setStorageObject(StrainChartInfo.getDefaultChartInfo());
    this.gravityChartInfo.setDataLabel("this.getChannel()");
    this.storage.saveChartInfo(this.gravityChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.gravityChartInfo);
  }

  /** MyData Methods**/

  addRow(index: number, amount: number): void {
    this.strainData.addRow(index, amount);
    this.storage.saveData(this.strainData.getData());
    this.dataSubject.next(this.strainData);
  }

  getData(): StrainDataDict[] {
    return this.strainData.getData();
  }

  getDataArray(): number[][][] {
    return this.strainData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.strainData.removeRow(index, amount);
    this.storage.saveData(this.strainData.getData());
    this.dataSubject.next(this.strainData);
  }

  setData(data: StrainDataDict[]): void {
    this.strainData.setData(data);
    this.storage.saveData(this.strainData.getData());
    this.dataSubject.next(this.strainData);
  }

  resetData(): void {
    this.strainData.setData(StrainData.getDefaultData());
    this.storage.saveData(this.strainData.getData());
    this.dataSubject.next(this.strainData);
  }

  setHighChart(chart: Highcharts.Chart): void {
    this.highChart = chart;
  }

  getHighChart(): Highcharts.Chart {
    return this.highChart;
  }

}
