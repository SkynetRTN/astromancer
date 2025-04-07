import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Subject, takeUntil, debounceTime, auditTime} from "rxjs";
import * as Highcharts from "highcharts";

import { environment } from 'src/environments/environment';
import {
  StrainChartInfoStorageObject,
  SpectoData,
  SpectogramDataDict,
  ModelDataDict,
  ModelData,
  SpectoAxes
} from "../gravity.service.util";

import {MyData} from "../../../shared/data/data.interface";
import {ChartInfo} from "../../../shared/charts/chart.interface";
import { UpdateSource } from '../../../shared/data/utils';
import { InterfaceService } from '../gravity-form/gravity-interface.service';
import { GravityDataService } from '../../gravity-data.service';

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

  constructor(
    private interfaceService: InterfaceService,
    private data: GravityDataService,
    private http: HttpClient
  ) {
    this.spectoData.setData([[0,0,0]]);
    this.modelData.setData([]);

    this.data.jobId$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (id: number|null) =>
      {
        if(id) this.fetchSpectogram(id)
      }
    )

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

  // TODO: handle job not found. Most likely, add a function to DataService that resets the job.
  private fetchSpectogram(id: number) {


    this.http.get(`${environment.apiUrl}/gravity/spectogram`,
    {params: {'id': id} }).subscribe(
    (resp: any) => {

        console.log(resp)

        const spectogramResult: number[][] = [];

        let spectogram: number[][] = resp.file.data
        let axes = resp.file.axes

        console.log("Spectogram points: ", spectogram.length * spectogram[0].length)

        let xmin = parseFloat(axes.x[0])
        let xmax = parseFloat(axes.x[1])
        let dx   = parseFloat(axes.x[2])
        let ymin = axes.y[0]
        let ymax = axes.y[1]

        this.setAxes({'dx': dx, 'xmin': xmin, 'xmax': xmax, 'ymin': ymin, 'ymax': ymax})

        // TODO: Move.
        this.interfaceService.setMergerRange({'min':xmin, 'max': xmax})

        spectogram.forEach( (y, i) => y.forEach( (value, j) => {
        // if(x==null || y==null) return 
        spectogramResult.push([i*dx + xmin , j, value?value:0 ])
        } ) )
        this.setSpecto(spectogramResult)

    })
}

}
