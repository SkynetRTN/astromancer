import {Injectable} from '@angular/core';
import {CurveCounts, CurveData, CurveDataDict, CurveObservable} from "../model/curve.model";

@Injectable()
export class CurveDataService {
  private curveData: CurveData = new CurveData();
  private curveCount: number = CurveCounts.ONE;
  private isMagnitudeOn: boolean = false;
  private observers: CurveObservable[] = [];

  public getData(): CurveDataDict[] {
    return this.curveData.getData(this.curveCount);
  }

  public getDataKeys(): string[] {
    return this.curveData.getDataKeys(this.curveCount);
  }

  public setDataByCell(value: number | null, row: number, col: string): void {
    this.curveData.setDataByCell(value, row, col);
    this.kickObservers();
  }


  public setCurveCount(count: number): void {
    this.curveCount = count;
    this.kickObservers();
  }

  public setMagnitudeOn(isMagnitudeOn: boolean): void {
    this.isMagnitudeOn = isMagnitudeOn;
    this.kickObservers();
  }

  public getMagnitudeOn(): boolean {
    return this.isMagnitudeOn;
  }

  public addObserver(observer: CurveObservable): void {
    this.observers.push(observer);
  }

  private kickObservers(): void {
    for (const observer of this.observers) {
      observer.update();
    }
  }

}
