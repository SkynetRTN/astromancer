import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Subject, takeUntil, auditTime} from "rxjs";
import * as Highcharts from "highcharts";

import {
  StrainChartInfo,
  StrainChartInfoStorageObject,
  StrainData,
  StrainDataDict,
  GravityInterface,
  GravityInterfaceImpl,
  StrainStorage,
  fitValuesToGrid
} from "./gravity.service.util";

import {MyData} from "../shared/data/data.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import { UpdateSource } from '../shared/data/utils';
import { InterfaceService } from './gravity-interface.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class StrainService implements MyData, ChartInfo, OnDestroy {
  private strainData: StrainData = new StrainData();
  private modelData: StrainData = new StrainData();

  private destroy$: Subject<void> = new Subject<void>();

  private gravityChartInfo: StrainChartInfo = new StrainChartInfo();

  private storage: StrainStorage = new StrainStorage();

  //There isn't a point in using behaviorsubjects of type straindata if the data is retrieved using the getters anyways
  //using type boolean for now until the need for a specific data type arises
  private dataSubject: Subject<Boolean> = new Subject<Boolean>;
  public data$ = this.dataSubject.asObservable();
  private modelSubject: Subject<Boolean> = new Subject<Boolean>;
  public model$ = this.modelSubject.asObservable();

  private chartInfoSubject: BehaviorSubject<StrainChartInfo> = new BehaviorSubject<StrainChartInfo>(this.gravityChartInfo);
  public chartInfo$ = this.chartInfoSubject.asObservable();

  private highChart!: Highcharts.Chart;

  constructor(private interfaceService: InterfaceService,
              private http: HttpClient
  ) {
    this.strainData.setData(this.storage.getData());
    this.gravityChartInfo.setStorageObject(this.storage.getChartInfo());

    //Interface Changes. May move back here
    // this.interfaceService.serverParameters$.pipe(
    //   takeUntil(this.destroy$),
    //   debounceTime(200)
    // ).subscribe(
    //   (source: UpdateSource) => {
    //     //don't make a request before the user has a chance to fiddle with the interface
    //     if(source==UpdateSource.INIT) return;

    //     this.fetchModels(this.interfaceService.getTotalMass(),
    //                     this.interfaceService.getMassRatio(),
    //                     this.interfaceService.getPhaseShift())
    //   }
    // )

    //Changes to the interface that don't require server requests. Maybe should be moved to highchart component.
    this.interfaceService.strainParameters$.pipe(
      takeUntil(this.destroy$),
      auditTime(100)
    ).subscribe(
      (source: UpdateSource) => {
        if(source==UpdateSource.INIT) return;

        this.modelSubject.next(true);
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.dataSubject.next(true);
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

  // uploaded data
  addRow(index: number, amount: number): void {
    this.strainData.addRow(index, amount);
    this.storage.saveData(this.strainData.getData());
    this.dataSubject.next(true);
  }

  getData(): StrainDataDict[] {
    return this.strainData.getData();
  }

  getDataArray(): number[][] {
    return this.strainData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.strainData.removeRow(index, amount);
    this.storage.saveData(this.strainData.getData());
    this.dataSubject.next(true);
  }

  setData(data: StrainDataDict[]): void {
    this.strainData.setData(data);
    this.storage.saveData(this.strainData.getData());
    this.dataSubject.next(true);
  }

  resetData(): void {
    this.strainData.setData(StrainData.getDefaultData());
    this.storage.saveData(this.strainData.getData());
    this.dataSubject.next(true);
  }


  //Model Data
  // addModelRow(index: number, amount: number): void 

  getModelData(): StrainDataDict[] {

    return this.modelData.getData()

  }

  getModelDataArray(ignoreMergerTime: Boolean = false): number[][] {
    if(ignoreMergerTime) return this.modelData.getDataArray();

    //Making a not of this, because it comes from the old interface and the reason for this specific value is not clear.
    let factor = 100

    let mergerTime: number = this.interfaceService.getMergerTime()
    let amplifier: number = (1-0.5*Math.sin(this.interfaceService.getInclination()*(Math.PI/180)))*(factor / this.interfaceService.getDistance())
    
    //because of how getDataArray works, this goes through the whole array twice. might be faster not to use that function.
    return this.modelData.getDataArray().map((p) => {
      let time: number = p[0];
      time = +time + +mergerTime;
      let strain = p[1] * amplifier
      return [time, strain]
    });
  }

  // removeModelRow(index: number, amount: number): void

  setModelData(data: StrainDataDict[]): void {
    this.modelData.setData(data);
    // this.storage.saveData(this.strainData.getData());
    this.modelSubject.next(true);
  }

  resetModelData(): void {
    this.modelData.setData(StrainData.getDefaultData());
    // this.storage.saveData(this.strainData.getData());
    this.modelSubject.next(true);
  }


  setHighChart(chart: Highcharts.Chart): void {
    this.highChart = chart;
  }

  getHighChart(): Highcharts.Chart {
    return this.highChart;
  }

  getMergerTime(): number {
    return this.interfaceService.getMergerTime()
  }
}
