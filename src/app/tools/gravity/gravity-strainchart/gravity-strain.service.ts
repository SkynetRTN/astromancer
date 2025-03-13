import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Subject, takeUntil, auditTime} from "rxjs";
import * as Highcharts from "highcharts";

import {
  StrainData,
  StrainDataDict,
  GravityInterface,
  GravityInterfaceImpl,
  StrainStorage,
  fitValuesToGrid
} from "../gravity.service.util";

import {MyData} from "../../shared/data/data.interface";
import {ChartInfo} from "../../shared/charts/chart.interface";
import { UpdateSource } from '../../shared/data/utils';
import { InterfaceService } from '../gravity-form/gravity-interface.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class StrainService implements MyData, OnDestroy {
  private strainData: StrainData = new StrainData();
  private modelData: StrainData = new StrainData();

  private destroy$: Subject<void> = new Subject<void>();

  // private gravityChartInfo: StrainChartInfo = new StrainChartInfo();

  private storage: StrainStorage = new StrainStorage();

  //There isn't a point in using behaviorsubjects of type straindata if the data is retrieved using the getters anyways
  //using type boolean for now until the need for a specific data type arises
  private dataSubject: Subject<Boolean> = new Subject<Boolean>;
  public data$ = this.dataSubject.asObservable();
  private modelSubject: Subject<Boolean> = new Subject<Boolean>;
  public model$ = this.modelSubject.asObservable();

  // private chartInfoSubject: BehaviorSubject<StrainChartInfo> = new BehaviorSubject<StrainChartInfo>(this.gravityChartInfo);
  // public chartInfo$ = this.chartInfoSubject.asObservable();

  private highChart!: Highcharts.Chart;

  constructor(private interfaceService: InterfaceService,
              private http: HttpClient
  ) {
    this.strainData.setData(this.storage.getData());
    // this.gravityChartInfo.setStorageObject(this.storage.getChartInfo());

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
