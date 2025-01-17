import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject} from "rxjs";
import * as Highcharts from "highcharts";

import {
  StrainChartInfo,
  StrainChartInfoStorageObject,
  StrainData,
  StrainDataDict,
  GravityInterface,
  GravityInterfaceImpl,
  StrainStorage
} from "./gravity.service.util";

import {MyData} from "../shared/data/data.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import { UpdateSource } from '../shared/data/utils';

@Injectable()
export class GravityService implements GravityInterface{
  private strainData: StrainData = new StrainData();

  private gravityInterface: GravityInterfaceImpl = new GravityInterfaceImpl();
  private gravityStorage: StrainStorage = new StrainStorage();

  private interfaceSubject: BehaviorSubject<UpdateSource> = new BehaviorSubject<UpdateSource>(UpdateSource.INIT);
  public interface$ = this.interfaceSubject.asObservable();

  constructor() {
    this.strainData.setData(this.gravityStorage.getData());
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
}
