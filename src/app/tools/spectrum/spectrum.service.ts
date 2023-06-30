import {Injectable} from '@angular/core';
import {
  SpectrumChartInfo,
  SpectrumChartInfoStorageObject,
  SpectrumData,
  SpectrumDataDict,
  SpectrumInterface,
  SpectrumInterfaceImpl,
  SpectrumOptions,
  SpectrumStorage
} from "./spectrum.service.util";
import {BehaviorSubject} from "rxjs";
import {MyData} from "../shared/data/data.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import * as Highcharts from "highcharts";

@Injectable()
export class SpectrumService implements MyData, SpectrumInterface, ChartInfo {
  private spectrumData: SpectrumData = new SpectrumData();
  private spectrumInterface: SpectrumInterfaceImpl = new SpectrumInterfaceImpl();
  private spectrumChartInfo: SpectrumChartInfo = new SpectrumChartInfo();

  private spectrumStorage: SpectrumStorage = new SpectrumStorage();

  private dataSubject: BehaviorSubject<SpectrumData> = new BehaviorSubject<SpectrumData>(this.spectrumData);
  public data$ = this.dataSubject.asObservable();
  private interfaceSubject: BehaviorSubject<SpectrumOptions> = new BehaviorSubject<SpectrumOptions>(this.spectrumInterface.getChannel());
  public interface$ = this.interfaceSubject.asObservable();
  private chartInfoSubject: BehaviorSubject<SpectrumChartInfo> = new BehaviorSubject<SpectrumChartInfo>(this.spectrumChartInfo);
  public chartInfo$ = this.chartInfoSubject.asObservable();

  private highChart!: Highcharts.Chart;

  constructor() {
    this.spectrumData.setData(this.spectrumStorage.getData());
    this.spectrumInterface.setChannel(this.spectrumStorage.getInterface());
    this.spectrumChartInfo.setStorageObject(this.spectrumStorage.getChartInfo());
  }


  /** ChartInfo Methods **/

  getChartTitle(): string {
    return this.spectrumChartInfo.getChartTitle();
  }

  getDataLabel(): string {
    return this.spectrumChartInfo.getDataLabel();
  }

  getStorageObject(): any {
    return this.spectrumChartInfo.getStorageObject();
  }

  getXAxisLabel(): string {
    return this.spectrumChartInfo.getXAxisLabel();
  }

  getYAxisLabel(): string {
    return this.spectrumChartInfo.getYAxisLabel();
  }

  setChartTitle(title: string): void {
    this.spectrumChartInfo.setChartTitle(title);
    this.spectrumStorage.saveChartInfo(this.spectrumChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.spectrumChartInfo);
  }

  setDataLabel(data: string): void {
    this.spectrumChartInfo.setDataLabel(data);
    this.spectrumStorage.saveChartInfo(this.spectrumChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.spectrumChartInfo);
    this.dataSubject.next(this.spectrumData);
  }

  setStorageObject(storageObject: SpectrumChartInfoStorageObject): void {
    this.spectrumChartInfo.setStorageObject(storageObject);
    this.spectrumStorage.saveChartInfo(this.spectrumChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.spectrumChartInfo);
  }

  setXAxisLabel(xAxis: string): void {
    this.spectrumChartInfo.setXAxisLabel(xAxis);
    this.spectrumStorage.saveChartInfo(this.spectrumChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.spectrumChartInfo);
  }

  setYAxisLabel(yAxis: string): void {
    this.spectrumChartInfo.setYAxisLabel(yAxis);
    this.spectrumStorage.saveChartInfo(this.spectrumChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.spectrumChartInfo);
  }

  resetChartInfo(): void {
    this.spectrumChartInfo.setStorageObject(SpectrumChartInfo.getDefaultStorageObject());
    this.spectrumChartInfo.setDataLabel(this.getChannel());
    this.spectrumStorage.saveChartInfo(this.spectrumChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.spectrumChartInfo);
  }


  /** SpectrumInterface Methods **/

  getChannel(): SpectrumOptions {
    return this.spectrumInterface.getChannel();
  }

  setChannel(channel: SpectrumOptions): void {
    this.spectrumInterface.setChannel(channel);
    this.spectrumStorage.saveInterface(this.spectrumInterface.getChannel());
    this.interfaceSubject.next(this.spectrumInterface.getChannel());
    this.setDataLabel(this.spectrumInterface.getChannel());
  }


  /** MyData Methods**/


  addRow(index: number, amount: number): void {
    this.spectrumData.addRow(index, amount);
    this.spectrumStorage.saveData(this.spectrumData.getData());
    this.dataSubject.next(this.spectrumData);
  }

  getData(): SpectrumDataDict[] {
    return this.spectrumData.getData();
  }

  getDataArray(): number[][][] {
    return this.spectrumData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.spectrumData.removeRow(index, amount);
    this.spectrumStorage.saveData(this.spectrumData.getData());
    this.dataSubject.next(this.spectrumData);
  }

  setData(data: SpectrumDataDict[]): void {
    this.spectrumData.setData(data);
    this.spectrumStorage.saveData(this.spectrumData.getData());
    this.dataSubject.next(this.spectrumData);
  }

  resetData(): void {
    this.spectrumData.setData(SpectrumData.getDefaultData());
    this.spectrumStorage.saveData(this.spectrumData.getData());
    this.dataSubject.next(this.spectrumData);
  }

  setHighChart(chart: Highcharts.Chart): void {
    this.highChart = chart;
  }

  getHighChart(): Highcharts.Chart {
    return this.highChart;
  }

}
