import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject} from "rxjs";
import * as Highcharts from "highcharts";

import {
  GravityChartInfo,
  GravityChartInfoStorageObject,
  StrainData,
  StrainDataDict,
  GravityInterface,
  GravityInterfaceImpl,
  GravityStorage
} from "./gravity.service.util";

import { GravityDataService } from './gravity-data.service';

import {MyData} from "../shared/data/data.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import { UpdateSource } from '../shared/data/utils';

@Injectable()
export class GravityService implements MyData, GravityInterface, ChartInfo {
  private strainData: StrainData = new StrainData();

  private gravityInterface: GravityInterfaceImpl = new GravityInterfaceImpl();
  private gravityChartInfo: GravityChartInfo = new GravityChartInfo();

  private gravityStorage: GravityStorage = new GravityStorage();

  private dataSubject: BehaviorSubject<StrainData> = new BehaviorSubject<StrainData>(this.strainData);
  public data$ = this.dataSubject.asObservable();
  private interfaceSubject: BehaviorSubject<UpdateSource> = new BehaviorSubject<UpdateSource>(UpdateSource.INIT);
  public interface$ = this.interfaceSubject.asObservable();
  private chartInfoSubject: BehaviorSubject<GravityChartInfo> = new BehaviorSubject<GravityChartInfo>(this.gravityChartInfo);
  public chartInfo$ = this.chartInfoSubject.asObservable();

  private highChart!: Highcharts.Chart;

  constructor(private dataService: GravityDataService) {
    this.strainData.setData(this.gravityStorage.getData());
    this.gravityChartInfo.setStorageObject(this.gravityStorage.getChartInfo());

    dataService.upload$.subscribe((file) =>{
      console.log(file)
    })
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
    this.dataSubject.next(this.strainData);
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
    this.strainData.addRow(index, amount);
    this.gravityStorage.saveData(this.strainData.getData());
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
    this.gravityStorage.saveData(this.strainData.getData());
    this.dataSubject.next(this.strainData);
  }

  setData(data: StrainDataDict[]): void {
    this.strainData.setData(data);
    this.gravityStorage.saveData(this.strainData.getData());
    this.dataSubject.next(this.strainData);
  }

  resetData(): void {
    this.strainData.setData(StrainData.getDefaultData());
    this.gravityStorage.saveData(this.strainData.getData());
    this.dataSubject.next(this.strainData);
  }

  setHighChart(chart: Highcharts.Chart): void {
    this.highChart = chart;
  }

  getHighChart(): Highcharts.Chart {
    return this.highChart;
  }

}
