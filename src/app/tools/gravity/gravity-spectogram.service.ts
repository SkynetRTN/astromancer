import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject} from "rxjs";
import * as Highcharts from "highcharts";

import {
  StrainChartInfo,
  StrainChartInfoStorageObject,
  StrainData,
  SpectoData,
  StrainDataDict,
  GravityInterface,
  GravityInterfaceImpl,
  StrainStorage,
  SpectogramDataDict
} from "./gravity.service.util";

import {MyData} from "../shared/data/data.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import { UpdateSource } from '../shared/data/utils';

@Injectable()
export class SpectogramService implements ChartInfo {
  private spectoData: SpectoData = new SpectoData();

  private gravityChartInfo: StrainChartInfo = new StrainChartInfo();

  private dataSubject: BehaviorSubject<SpectoData> = new BehaviorSubject<SpectoData>(this.spectoData);
  public data$ = this.dataSubject.asObservable();
  private chartInfoSubject: BehaviorSubject<StrainChartInfo> = new BehaviorSubject<StrainChartInfo>(this.gravityChartInfo);
  public chartInfo$ = this.chartInfoSubject.asObservable();

  private highChart!: Highcharts.Chart;

  constructor() {
    this.spectoData.setData([{x: 0, y: 0, value: 0}]);
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
    this.chartInfoSubject.next(this.gravityChartInfo);
  }

  setDataLabel(data: string): void {
    this.gravityChartInfo.setDataLabel(data);
    this.chartInfoSubject.next(this.gravityChartInfo);
    this.dataSubject.next(this.spectoData);
  }

  setStorageObject(storageObject: StrainChartInfoStorageObject): void {
    this.gravityChartInfo.setStorageObject(storageObject);
    this.chartInfoSubject.next(this.gravityChartInfo);
  }

  setXAxisLabel(xAxis: string): void {
    this.gravityChartInfo.setXAxisLabel(xAxis);
    this.chartInfoSubject.next(this.gravityChartInfo);
  }

  SetXRange(min: number, max: number): void {
    
  }

  setYAxisLabel(yAxis: string): void {
    this.gravityChartInfo.setYAxisLabel(yAxis);
    this.chartInfoSubject.next(this.gravityChartInfo);
  }

  resetChartInfo(): void {
    this.gravityChartInfo.setStorageObject(StrainChartInfo.getDefaultChartInfo());
    this.gravityChartInfo.setDataLabel("this.getChannel()");
    this.chartInfoSubject.next(this.gravityChartInfo);
  }

  /** MyData Methods**/

  getData(): SpectogramDataDict[] {
    return this.spectoData.getData();
  }

  getDataArray(): number[][] {
    return this.spectoData.getDataArray();
  }

  setData(data: SpectogramDataDict[]): void {
    this.spectoData.setData(data);
    this.dataSubject.next(this.spectoData);
  }

  resetData(): void {
    this.spectoData.setData(SpectoData.getDefaultData());
    this.dataSubject.next(this.spectoData);
  }

  setHighChart(chart: Highcharts.Chart): void {
    this.highChart = chart;
  }

  getHighChart(): Highcharts.Chart {
    return this.highChart;
  }

}
