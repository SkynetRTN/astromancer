import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Subject} from "rxjs";
import * as Highcharts from "highcharts";

import {
  StrainChartInfoStorageObject,
  StrainData,
  StrainDataDict,
  GravityInterface,
  GravityInterfaceImpl,
  StrainStorage,
  range
} from "../gravity.service.util";

import {MyData} from "../../shared/data/data.interface";
import {ChartInfo} from "../../shared/charts/chart.interface";
import { UpdateSource } from '../../shared/data/utils';

/**
 * @remarks Service for interface activity
 * @member { Observable<UpdateSource> } serverParameters$ - interface change that requires a request to the server
 * @member { Observable<UpdateSource> } strainParameters$ - interface change that affects the strain vs time graph
 */
@Injectable()
export class InterfaceService implements GravityInterface{
  private strainData: StrainData = new StrainData();
  
  private gravityInterface: GravityInterfaceImpl = new GravityInterfaceImpl();
  private gravityStorage: StrainStorage = new StrainStorage();

  //Server request params
  private serverParameterSubject: BehaviorSubject<UpdateSource> = new BehaviorSubject<UpdateSource>(UpdateSource.INIT);
  public serverParameters$ = this.serverParameterSubject.asObservable();
  
  //params that affect strain model
  private strainParameterSubject: BehaviorSubject<UpdateSource> = new BehaviorSubject<UpdateSource>(UpdateSource.INIT);
  public strainParameters$ = this.strainParameterSubject.asObservable();

  //params that affect freq model
  private freqParameterSubject: BehaviorSubject<UpdateSource> = new BehaviorSubject<UpdateSource>(UpdateSource.INIT);
  public freqParameters$ = this.freqParameterSubject.asObservable();

  private mergerRangeSubject: Subject<void> = new Subject<void>()
  public mergerRange$ = this.mergerRangeSubject.asObservable();



  constructor() {
    this.strainData.setData(this.gravityStorage.getData());
  }
  
  /** GravityInterface Methods **/

  getMergerTime(): number {
    return this.gravityInterface.getMergerTime();
  }

  getMergerRange(): range {
    return this.gravityInterface.getMergerRange();
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
    this.serverParameterSubject.next(UpdateSource.RESET);
  }

  setMergerTime(mergerTime: number): void {
    this.gravityInterface.setMergerTime(+mergerTime);
    this.strainParameterSubject.next(UpdateSource.INTERFACE)
    this.freqParameterSubject.next(UpdateSource.INTERFACE)
  }

  setMergerRange(range: range){
    this.gravityInterface.setMergerRange(range);
    this.mergerRangeSubject.next()
  }

  setTotalMass(totalMass: number): void {
    this.gravityInterface.setTotalMass(+totalMass);
    this.serverParameterSubject.next(UpdateSource.INTERFACE);
  }

  setMassRatio(massRatio: number): void {
    this.gravityInterface.setMassRatio(+massRatio);
    this.serverParameterSubject.next(UpdateSource.INTERFACE);
  }

  setPhaseShift(phaseShift: number): void {
    this.gravityInterface.setPhaseShift(+phaseShift);
    this.serverParameterSubject.next(UpdateSource.INTERFACE);
  }

  setDistance(distance: number): void {
    this.gravityInterface.setDistance(+distance);
    this.strainParameterSubject.next(UpdateSource.INTERFACE)
  }

  setInclination(inclination: number): void {
    this.gravityInterface.setInclination(+inclination);
    this.strainParameterSubject.next(UpdateSource.INTERFACE)
  }
}
