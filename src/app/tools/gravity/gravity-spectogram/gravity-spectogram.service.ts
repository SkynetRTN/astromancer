import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Subject, takeUntil, debounceTime, auditTime} from "rxjs";
import * as Highcharts from "highcharts";

import {
  StrainChartInfoStorageObject,
  SpectoData,
  SpectogramDataDict,
  ModelDataDict,
  ModelData,
  SpectoAxes
} from "../gravity.service.util";

import {MyData} from "../../shared/data/data.interface";
import {ChartInfo} from "../../shared/charts/chart.interface";
import { UpdateSource } from '../../shared/data/utils';
import { InterfaceService } from '../gravity-form/gravity-interface.service';

@Injectable()
export class SpectogramService implements OnDestroy {
  private spectoData: SpectoData = new SpectoData();
  private modelData: ModelData = new ModelData();

  private destroy$: Subject<void> = new Subject<void>();

  private spectogramSubject: Subject<Boolean> = new Subject<Boolean>;
  public spectogram$ = this.spectogramSubject.asObservable();
  private modelSubject: Subject<Boolean> = new Subject<Boolean>;
  public model$ = this.modelSubject.asObservable();

  private highChart!: Highcharts.Chart;

  constructor(private interfaceService: InterfaceService) {
    this.spectoData.setData([[0,0,0]]);
    this.modelData.setData([]);

    this.interfaceService.freqParameters$.pipe(
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

  getSpectogram(): SpectogramDataDict[] {
    return this.spectoData.getData();
  }

  getSpectoArray(): number[][] {
    return this.spectoData.getDataArray();
  }

  setSpecto(data: number[][]): void {
    this.spectoData.setData(data);
    this.spectogramSubject.next(true);
  }

  resetSpecto(): void {
    this.spectoData.setData(SpectoData.getDefaultData());
    this.spectogramSubject.next(true);
  }

  getAxes(): SpectoAxes {
    return this.spectoData.getAxes()
  }

  setAxes(axes: SpectoAxes): void {
    this.spectoData.setAxes(axes)
  }

  getModel(): ModelDataDict[] {
    return this.modelData.getData();
  }

  getModelArray(ignoreMergerTime: Boolean = false): number[][] {

    if (ignoreMergerTime) return this.modelData.getDataArray();

    let mergerTime: number = this.interfaceService.getMergerTime()
    
    //because of how getDataArray works, this goes through the whole array twice. might be faster not to use that function.
    return this.modelData.getDataArray().map((p) => {
      let time: number = p[0];
      time = +time + +mergerTime;
      let strain = p[1]
      return [time, strain]
    });
  }

  setModelData(data: number[][]): void {
    this.modelData.setData(data);
    this.modelSubject.next(true);
  }

  resetModel(): void {
    this.modelData.setData([]);
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
