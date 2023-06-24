import {Injectable} from '@angular/core';
import {MyData} from "../shared/data/data.interface";
import {MoonData, MoonDataDict, MoonStorage} from "./moon.service.util";
import {BehaviorSubject} from "rxjs";
import * as Highcharts from 'highcharts';

@Injectable()
export class MoonService implements MyData {
  private moonData: MoonData = new MoonData();
  private moonStorage: MoonStorage = new MoonStorage();
  private highChart!: Highcharts.Chart;


  private dataSubject = new BehaviorSubject<MoonDataDict[]>(this.getData());
  public data$ = this.dataSubject.asObservable();

  constructor() {
    this.moonData.setData(this.moonStorage.getData());
  }

  addRow(index: number, amount: number): void {
    this.moonData.addRow(index, amount);
    this.moonStorage.saveData(this.getData());
    this.dataSubject.next(this.getData());
  }

  getData(): MoonDataDict[] {
    return this.moonData.getData();
  }

  getDataArray(): any[] {
    return this.moonData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.moonData.removeRow(index, amount);
    this.moonStorage.saveData(this.getData());
    this.dataSubject.next(this.getData());
  }

  setData(data: MoonDataDict[]): void {
    this.moonData.setData(data);
    this.moonStorage.saveData(this.getData());
    this.dataSubject.next(this.getData());
  }

  resetData(): void {
    this.moonData.setData(MoonData.getDefaultData());
    this.moonStorage.saveData(this.getData());
    this.dataSubject.next(this.getData());
  }

  public setHighChart(highChart: Highcharts.Chart): void {
    this.highChart = highChart;
  }

  getHighChart(): Highcharts.Chart {
    return this.highChart;
  }
}
