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
  SpectogramDataDict,
  ModelDataDict,
  ModelData
} from "./gravity.service.util";

import {MyData} from "../shared/data/data.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import { UpdateSource } from '../shared/data/utils';
import { InterfaceService } from './gravity-interface.service';

@Injectable()
export class SpectogramService implements ChartInfo {
  private spectoData: SpectoData = new SpectoData();
  private modelData: ModelData = new ModelData();

  private gravityChartInfo: StrainChartInfo = new StrainChartInfo();

  private spectogramSubject: BehaviorSubject<SpectoData> = new BehaviorSubject<SpectoData>(this.spectoData);
  public spectogram$ = this.spectogramSubject.asObservable();
  private modelSubject: BehaviorSubject<ModelData> = new BehaviorSubject<ModelData>(this.modelData);
  public model$ = this.modelSubject.asObservable();

  private chartInfoSubject: BehaviorSubject<StrainChartInfo> = new BehaviorSubject<StrainChartInfo>(this.gravityChartInfo);
  public chartInfo$ = this.chartInfoSubject.asObservable();

  private highChart!: Highcharts.Chart;

  constructor() {
    this.spectoData.setData([{x: 0, y: 0, value: 0}]);
    this.modelData.setData([]);
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
    this.spectogramSubject.next(this.spectoData);
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

  getSpectogram(): SpectogramDataDict[] {
    return this.spectoData.getData();
  }

  getSpectoArray(): number[][] {
    return this.spectoData.getDataArray();
  }

  setSpecto(data: SpectogramDataDict[]): void {
    this.spectoData.setData(data);
    this.spectogramSubject.next(this.spectoData);
  }

  resetSpecto(): void {
    this.spectoData.setData(SpectoData.getDefaultData());
    this.spectogramSubject.next(this.spectoData);
  }

  getColumnSize(): number {
    return this.spectoData.getColumnSize()
  }

  setColumnSize(size: number): void {
    this.spectoData.setColumnSize(size)
  }

  getModel(): ModelDataDict[] {
    return this.modelData.getData();
  }

  getModelArray(): number[][] {
    return this.modelData.getDataArray();
  }

  setModel(data: ModelDataDict[]): void {
    this.modelData.setData(data);
    this.modelSubject.next(this.modelData);
  }

  resetModel(): void {
    this.modelData.setData(ModelData.getDefaultData());
    this.modelSubject.next(this.modelData);
  }

  getSampleWidth(): number {
    return this.modelData.getSampleWidth()
  }

  setSampleWidth(size: number): void {
    this.modelData.setSampleWidth(size)
  }
  

  setHighChart(chart: Highcharts.Chart): void {
    this.highChart = chart;
  }

  getHighChart(): Highcharts.Chart {
    return this.highChart;
  }


}
