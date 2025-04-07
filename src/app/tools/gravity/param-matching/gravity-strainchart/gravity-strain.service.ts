import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Subject, takeUntil, auditTime, combineLatest, debounceTime} from "rxjs";
import * as Highcharts from "highcharts";

import {
  StrainData,
  StrainDataDict,
  SpectoAxes,
  fitValuesToGrid
} from "../gravity.service.util";

import {MyData} from "../../../shared/data/data.interface";
import {ChartInfo} from "../../../shared/charts/chart.interface";
import { UpdateSource } from '../../../shared/data/utils';
import { InterfaceService } from '../gravity-form/gravity-interface.service';
import { environment } from 'src/environments/environment';
import { GravityDataService } from '../../gravity-data.service';
import { SpectogramService } from '../gravity-spectogram/gravity-spectogram.service';

@Injectable()
export class StrainService implements MyData, OnDestroy {
  private strainData: StrainData = new StrainData();
  private modelData: StrainData = new StrainData();

  private destroy$: Subject<void> = new Subject<void>();

  // private gravityChartInfo: StrainChartInfo = new StrainChartInfo();

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
              private spectogramService: SpectogramService,
              private http: HttpClient,
              private data: GravityDataService
  ) {

    combineLatest([this.data.jobId$, this.interfaceService.serverParameters$]).pipe(
      takeUntil(this.destroy$),
      debounceTime(100),
    ).subscribe(
      ([id, source]) => {
        if(id)  this.fetchStrain(id)

        //We dont need this to update with job id, but that doesn't change much anyways
        this.fetchModels()
      }
    )

    //Changes to the interface that don't require server requests.
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
    this.dataSubject.next(true);
  }

  setData(data:number[][]): void {
    this.strainData.setData(data);
    this.dataSubject.next(true);
  }

  getAxes(): SpectoAxes {
    return this.strainData.getAxes()
  }

  setAxes(axes: SpectoAxes): void {
    this.strainData.setAxes(axes)
  }

  resetData(): void {
    this.strainData.setData([]);
    this.dataSubject.next(true);
  }


  //Model Data
  // addModelRow(index: number, amount: number): void 

  getModelData(): StrainDataDict[] {

    return this.modelData.getData()

  }

  getModelDataArray(ignoreMergerTime: Boolean = false): number[][] {
    if(ignoreMergerTime) return this.modelData.getDataArray();

    //Making a note of this, because it comes from the old interface and the reason for this specific value is not clear.
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

  setModelData(data: number[][]): void {
    this.modelData.setData(data);
    // this.storage.saveData(this.strainData.getData());
    this.modelSubject.next(true);
  }

  resetModelData(): void {
    this.modelData.setData([]);
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

      //The strain wave is bandpassed and normalized based on the model params
  private fetchStrain(id: number) {

    let totalMass = this.interfaceService.getTotalMass()
    let massRatio = this.interfaceService.getMassRatio()
    let phase = this.interfaceService.getPhaseShift()

    if(id == null) return;

    phase = (phase * Math.PI)/180

    let payload = fitValuesToGrid(totalMass,massRatio,phase)
    payload['id'] = id;

    // let freqMassError = totalMass/payload["total_mass_freq"]

    this.http.get(
        `${environment.apiUrl}/gravity/strain`,
          {'params': payload}).subscribe(
            (resp: any) => {

            let axes = resp.file.axes

            let xmin = parseFloat(axes.x[0])
            let xmax = parseFloat(axes.x[1])
            this.setAxes({'xmin': xmin, 'xmax': xmax})
            
            console.log(resp)
            this.setData(resp.file.data)
        })
  }
    //Currently both models are retrived at once, so it isn't as cut and dry where to put this. Its here for now to avoid circular imports
    private fetchModels() {
      
      let totalMass = this.interfaceService.getTotalMass()
      let massRatio = this.interfaceService.getMassRatio()
      let phase = this.interfaceService.getPhaseShift()
    
      phase = (phase * Math.PI)/180
  
      let payload = fitValuesToGrid(totalMass,massRatio,phase)
  
      let freqMassError = totalMass/payload['total_mass_freq']
  
      this.http.get(
        `${environment.apiUrl}/gravity/model`,
          {'params': payload}).subscribe(
            (resp: any) => {
              // let strainModel: StrainDataDict[] = []
              let freqModel: number[][] = []
  
              resp.frequency.forEach((p: number[]) => {
                if(p[0] != null && p[1] != null)
                {
                  freqModel.push([p[0]*freqMassError, p[1]/freqMassError])
                }
              })
              console.log(freqModel.length)
  
  
                //Calling these functions causes subscription updates.
                //VERY Slow. Debouncing allows them to run async at least
              this.spectogramService.setModelData(freqModel)
              this.setModelData(resp.strain)
            }
          )
    }
}
