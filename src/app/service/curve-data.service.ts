import { Injectable } from '@angular/core';
import {CurveCounts, CurveData, CurveDataDict} from "../model/curve.model";

@Injectable({
  providedIn: 'root'
})
export class CurveDataService {
  private curveData: CurveData = new CurveData();
  private curveCount: number = CurveCounts.ONE;
  private isMagnitudeOn: boolean = false;

  public getData(): CurveDataDict[] {
    return this.curveData.getData(this.curveCount);
  }

  public setCurveCount(count: number): void {
    this.curveCount = count;
  }

  public setMagnitudeOn(isMagnitudeOn: boolean): void {
    this.isMagnitudeOn = isMagnitudeOn;
  }

  public getMagnitudeOn(): boolean {
    return this.isMagnitudeOn;
  }

}
