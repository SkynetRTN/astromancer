import {Injectable} from '@angular/core';
import {MyData} from "../shared/data/data.interface";
import {
  MoonChartInfo,
  MoonData,
  MoonDataDict,
  MoonInterface,
  MoonInterfaceImpl,
  MoonModel,
  MoonStorage,
  UpdateSource
} from "./moon.service.util";
import {BehaviorSubject} from "rxjs";
import * as Highcharts from 'highcharts';
import {ChartInfo} from "../shared/charts/chart.interface";
import {rad} from "../shared/data/utils";

@Injectable()
export class MoonService implements MyData, ChartInfo, MoonInterface, MoonModel {
  private static CHARTPRECISION: number = 3;
  private moonInterface: MoonInterface = new MoonInterfaceImpl();
  private moonChartInfo: ChartInfo = new MoonChartInfo();
  private moonData: MyData = new MoonData();
  private moonStorage: MoonStorage = new MoonStorage();
  private highChart!: Highcharts.Chart;
  private interfaceSubject = new BehaviorSubject<UpdateSource>(UpdateSource.INIT);
  public interface$ = this.interfaceSubject.asObservable();
  private chartInfoSubject = new BehaviorSubject<ChartInfo>(this.moonChartInfo);
  public chartInfo$ = this.chartInfoSubject.asObservable();
  private dataSubject = new BehaviorSubject<MoonDataDict[]>(this.getData());
  public data$ = this.dataSubject.asObservable();

  constructor() {
    this.moonInterface.setStorageObject(this.moonStorage.getInterface());
    this.moonChartInfo.setStorageObject(this.moonStorage.getChartInfo());
    this.moonData.setData(this.moonStorage.getData());
  }

  /** MoonModel Methods **/
  getMoonModelData(): number[][] {
    const dataSorted: number[][] = this.moonData.getDataArray().filter((entry: number[]) => {
      return !(isNaN(entry[0]) || isNaN(entry[1]) || entry[0] === null || entry[1] === null)
    }).sort((a: number[], b: number[]) => {
      return a[0] - b[0]
    });
    if (dataSorted.length <= 1)
      return [];

    const minMaxOffset: number = 2;
    const minJd: number = dataSorted[0][0] - minMaxOffset;
    const maxJd: number = dataSorted[dataSorted.length - 1][0] + minMaxOffset;

    let modelData: number[][] = [];
    const steps: number = 2000;
    const stepSize: number = (maxJd - minJd) / steps;
    for (let i: number = 0; i < steps; i++) {
      const x = minJd + i * stepSize;
      const theta: number = (x - minJd - 2) / this.getPeriod() * Math.PI * 2 - rad(this.getPhase());
      const alpha: number = rad(this.getTilt());
      const y: number = this.getAmplitude() * Math.sqrt(
        Math.pow(Math.cos(theta), 2) +
        Math.pow(Math.sin(theta), 2) * Math.pow(Math.sin(alpha), 2)
      );
      modelData.push([x, y]);
    }

    return this.limitPrecision(modelData, MoonService.CHARTPRECISION);
  }

  /** MoonInterface Methods **/
  getAmplitude(): number {
    return this.moonInterface.getAmplitude();
  }

  getPeriod(): number {
    return this.moonInterface.getPeriod();
  }

  getPhase(): number {
    return this.moonInterface.getPhase();
  }

  getTilt(): number {
    return this.moonInterface.getTilt();
  }

  resetInterface(): void {
    this.moonInterface.resetInterface();
    this.moonStorage.resetInterface();
    this.interfaceSubject.next(UpdateSource.RESET);
  }

  setAmplitude(amplitude: number): void {
    this.moonInterface.setAmplitude(amplitude);
    this.moonStorage.saveInterface(this.moonInterface.getStorageObject());
    this.interfaceSubject.next(UpdateSource.INTERFACE);
  }

  setPeriod(period: number): void {
    this.moonInterface.setPeriod(period);
    this.moonStorage.saveInterface(this.moonInterface.getStorageObject());
    this.interfaceSubject.next(UpdateSource.INTERFACE);
  }

  setPhase(phase: number): void {
    this.moonInterface.setPhase(phase);
    this.moonStorage.saveInterface(this.moonInterface.getStorageObject());
    this.interfaceSubject.next(UpdateSource.INTERFACE);
  }

  setTilt(tilt: number): void {
    this.moonInterface.setTilt(tilt);
    this.moonStorage.saveInterface(this.moonInterface.getStorageObject());
    this.interfaceSubject.next(UpdateSource.INTERFACE);
  }

  /** ChartInfo Methods **/
  getChartTitle(): string {
    return this.moonChartInfo.getChartTitle();
  }

  getXAxisLabel(): string {
    return this.moonChartInfo.getXAxisLabel();
  }

  getYAxisLabel(): string {
    return this.moonChartInfo.getYAxisLabel();
  }

  getDataLabel(): string {
    return this.moonChartInfo.getDataLabel();
  }

  getStorageObject() {
    return this.moonChartInfo.getStorageObject();
  }

  setChartTitle(title: string): void {
    this.moonChartInfo.setChartTitle(title);
    this.moonStorage.saveChartInfo(this.getStorageObject());
    this.chartInfoSubject.next(this.moonChartInfo);
  }

  setXAxisLabel(xAxis: string): void {
    this.moonChartInfo.setXAxisLabel(xAxis);
    this.moonStorage.saveChartInfo(this.getStorageObject());
    this.chartInfoSubject.next(this.moonChartInfo);
  }

  setYAxisLabel(yAxis: string): void {
    this.moonChartInfo.setYAxisLabel(yAxis);
    this.moonStorage.saveChartInfo(this.getStorageObject());
    this.chartInfoSubject.next(this.moonChartInfo);
  }

  setDataLabel(data: string): void {
    this.moonChartInfo.setDataLabel(data);
    this.moonStorage.saveChartInfo(this.getStorageObject());
    this.chartInfoSubject.next(this.moonChartInfo);
    this.dataSubject.next(this.getData());
  }

  setStorageObject(storageObject: any): void {
    this.moonChartInfo.setStorageObject(storageObject);
  }

  public resetChartInfo(): void {
    this.moonChartInfo.setStorageObject(MoonChartInfo.getDefaultChartInfo());
    this.moonStorage.saveChartInfo(this.getStorageObject());
    this.chartInfoSubject.next(this.moonChartInfo);
  }


  /** MyData Methods **/
  addRow(index: number, amount: number): void {
    this.moonData.addRow(index, amount);
    this.moonStorage.saveData(this.getData());
    this.dataSubject.next(this.getData());
  }

  getData(): MoonDataDict[] {
    return this.moonData.getData();
  }

  getDataArray(): any[] {
    return this.limitPrecision(this.moonData.getDataArray(), MoonService.CHARTPRECISION);
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

  private limitPrecision(dataArray: number[][], precision: number): number[][] {
    return dataArray.map(
      (row: number[]) => {
        return row.map((value: number) => {
          return value ? parseFloat(value.toFixed(precision)) : value;
        });
      });
  }
}
