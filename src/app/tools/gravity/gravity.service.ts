import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import * as Highcharts from "highcharts";

import {
  GravityChartInfo,
  GravityChartInfoStorageObject,
  GravityData,
  GravityDataDict,
  GravityInterface,
  GravityInterfaceImpl,
  GravityStorage
} from "./gravity.service.util";

import {MyData} from "../shared/data/data.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import { UpdateSource } from '../shared/data/utils';

@Injectable()
export class GravityService implements MyData, GravityInterface, ChartInfo {
  private gravityData: GravityData = new GravityData();
  private gravityInterface: GravityInterfaceImpl = new GravityInterfaceImpl();
  private gravityChartInfo: GravityChartInfo = new GravityChartInfo();

  private gravityStorage: GravityStorage = new GravityStorage();

  private dataSubject: BehaviorSubject<GravityData> = new BehaviorSubject<GravityData>(this.gravityData);
  public data$ = this.dataSubject.asObservable();
  private interfaceSubject: BehaviorSubject<UpdateSource> = new BehaviorSubject<UpdateSource>(UpdateSource.INIT);
  public interface$ = this.interfaceSubject.asObservable();
  private chartInfoSubject: BehaviorSubject<GravityChartInfo> = new BehaviorSubject<GravityChartInfo>(this.gravityChartInfo);
  public chartInfo$ = this.chartInfoSubject.asObservable();

  private highChart!: Highcharts.Chart;

  constructor() {
    this.gravityData.setData(this.gravityStorage.getData());
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
    this.gravityChartInfo.setStorageObject(GravityChartInfo.getDefaultChartInfo());
    this.gravityChartInfo.setDataLabel("this.getChannel()");
    this.gravityStorage.saveChartInfo(this.gravityChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.gravityChartInfo);
  }


  /** GravityInterface Methods **/

  getMergerTime(): number {
    return this.gravityInterface.getMergerTime();
  }

  getTotalMass(): number {
    return this.gravityInterface.getTotalMass();
  }

  getMassRatio(): number {
    return this.gravityInterface.getMassRatio();
  }

  getPhaseShift(): number {
    return this.gravityInterface.getPhaseShift();
  }

  getDistance(): number {
    return this.gravityInterface.getDistance();
  }

  getInclination(): number {
    return this.gravityInterface.getInclination();
  }

  resetInterface(): void {
    this.gravityInterface.resetInterface();
    this.gravityStorage.resetInterface();
    this.interfaceSubject.next(UpdateSource.RESET);
  }

  setMergerTime(mergerTime: number): void {
    this.gravityInterface.setMergerTime(mergerTime);
  }

  setTotalMass(totalMass: number): void {
    this.gravityInterface.setTotalMass(totalMass);
  }

  setMassRatio(massRatio: number): void {
    this.gravityInterface.setMassRatio(massRatio);
  }

  setPhaseShift(phaseShift: number): void {
    this.gravityInterface.setPhaseShift(phaseShift);
  }

  setDistance(distance: number): void {
    this.gravityInterface.setDistance(distance);
  }

  setInclination(inclination: number): void {
    this.gravityInterface.setInclination(inclination);
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
