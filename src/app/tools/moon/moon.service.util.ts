import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import {rad} from "../shared/data/utils";

export interface MoonDataDict {
  julianDate: number | null;
  angularSeparation: number | null;
}

export class MoonData implements MyData {
  private moonDataDict!: MoonDataDict[];

  constructor() {
    this.setData(MoonData.getDefaultData());
  }

  /**
   *  This function returns an array of data points that represent a moon's orbit with randomly
   *  generated parameters. This function also introduce a 5% noise to all data points.
   *  @returns    {Array}
   */
  public static getDefaultData(): MoonDataDict[] {
    /**
     *  ln(750) = 6.62
     *  ln(1) = 0
     */
    const a = Math.exp(Math.random() * 4 + 1.62);
    const p = Math.random() * 10 + 5;
    const phase = Math.random() * 360;
    const tilt = Math.random() * 45;

    const returnData: MoonDataDict[] = [];

    for (let i = 0; i < 10; i++) {
      const x = i * 2 + Math.random() * 2;
      const theta = x / p * Math.PI * 2 - rad(phase);
      const alpha = rad(tilt);
      returnData[i] = {
        julianDate: x,
        angularSeparation: (a * Math.sqrt(Math.pow(Math.cos(theta), 2)
            + Math.pow(Math.sin(theta), 2) * Math.pow(Math.sin(alpha), 2)))
          * (1 + Math.random() * 0.05),
      }
    }
    // console.log('Cheat code:', round(a, 2), round(p, 2), round(phase, 0), round(tilt, 0));
    return returnData;
  }

  addRow(index: number, amount: number): void {
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.moonDataDict.splice(index + i, 0, {julianDate: null, angularSeparation: null});
      }
    } else {
      this.moonDataDict.push({julianDate: null, angularSeparation: null});
    }
  }

  getData(): MoonDataDict[] {
    return this.moonDataDict;
  }

  getDataArray(): any[] {
    let result = [];
    for (const entry of this.moonDataDict) {
      result.push([entry.julianDate, entry.angularSeparation]);
    }
    return result;
  }

  removeRow(index: number, amount: number): void {
    this.moonDataDict = this.moonDataDict.slice(0, index).concat(this.moonDataDict.slice(index + amount));
  }

  setData(data: MoonDataDict[]): void {
    this.moonDataDict = data;
  }

}


export interface MoonChartInfoStorageObject {
  chartTitle: string;
  dataLabel: string;
  xAxisLabel: string;
  yAxisLabel: string;
}


export class MoonChartInfo implements ChartInfo {
  private chartTitle: string;
  private dataLabel: string;
  private xAxisLabel: string;
  private yAxisLabel: string;

  constructor() {
    this.chartTitle = MoonChartInfo.getDefaultChartInfo().chartTitle;
    this.dataLabel = MoonChartInfo.getDefaultChartInfo().dataLabel;
    this.xAxisLabel = MoonChartInfo.getDefaultChartInfo().xAxisLabel;
    this.yAxisLabel = MoonChartInfo.getDefaultChartInfo().yAxisLabel;
  }

  static getDefaultChartInfo(): MoonChartInfoStorageObject {
    return {
      chartTitle: "Title",
      dataLabel: "Data",
      xAxisLabel: "x",
      yAxisLabel: "y",
    };
  }

  getChartTitle(): string {
    return this.chartTitle;
  }

  getDataLabel(): string {
    return this.dataLabel;
  }

  getXAxisLabel(): string {
    return this.xAxisLabel;
  }

  getYAxisLabel(): string {
    return this.yAxisLabel;
  }

  setChartTitle(title: string): void {
    this.chartTitle = title;
  }

  setDataLabel(data: string): void {
    this.dataLabel = data;
  }

  setXAxisLabel(xAxis: string): void {
    this.xAxisLabel = xAxis;
  }

  setYAxisLabel(yAxis: string): void {
    this.yAxisLabel = yAxis;
  }

  getStorageObject(): MoonChartInfoStorageObject {
    return {
      chartTitle: this.chartTitle,
      xAxisLabel: this.xAxisLabel,
      yAxisLabel: this.yAxisLabel,
      dataLabel: this.dataLabel,
    };
  }

  setStorageObject(storageObject: MoonChartInfoStorageObject): void {
    this.setChartTitle(storageObject.chartTitle);
    this.setXAxisLabel(storageObject.xAxisLabel);
    this.setYAxisLabel(storageObject.yAxisLabel);
    this.setDataLabel(storageObject.dataLabel);
  }

}


export interface MoonInterface {
  getAmplitude(): number;

  getPeriod(): number;

  getPhase(): number;

  getTilt(): number;

  getStorageObject(): MoonInterfaceStorageObject;

  setAmplitude(amplitude: number): void;

  setPeriod(period: number): void;

  setPhase(phase: number): void;

  setTilt(tilt: number): void;

  setStorageObject(storageObject: MoonInterfaceStorageObject): void;

  resetInterface(): void;
}


export interface MoonInterfaceStorageObject {
  amplitude: number;
  period: number;
  phase: number;
  tilt: number;
}


export class MoonInterfaceImpl implements MoonInterface {
  private amplitude!: number;
  private period!: number;
  private phase!: number;
  private tilt!: number;

  getAmplitude(): number {
    return this.amplitude;
  }

  getPeriod(): number {
    return this.period;
  }

  getPhase(): number {
    return this.phase;
  }

  getTilt(): number {
    return this.tilt;
  }

  resetInterface(): void {
    this.setStorageObject(this.getDefaultStorageObject());
  }

  setAmplitude(amplitude: number): void {
    this.amplitude = amplitude;
  }

  setPeriod(period: number): void {
    this.period = period;
  }

  setPhase(phase: number): void {
    this.phase = phase;
  }

  setTilt(tilt: number): void {
    this.tilt = tilt;
  }

  getStorageObject(): MoonInterfaceStorageObject {
    return {
      amplitude: this.amplitude,
      period: this.period,
      phase: this.phase,
      tilt: this.tilt,
    };
  }

  setStorageObject(storageObject: MoonInterfaceStorageObject): void {
    this.setAmplitude(storageObject.amplitude);
    this.setPeriod(storageObject.period);
    this.setPhase(storageObject.phase);
    this.setTilt(storageObject.tilt);
  }

  getDefaultStorageObject(): MoonInterfaceStorageObject {
    return {
      amplitude: 30,
      period: 10,
      phase: 0,
      tilt: 0,
    };
  }

}


export class MoonStorage implements MyStorage {
  private readonly chartInfoKey: string = 'moonChartInfo';
  private readonly dataKey: string = 'moonData';
  private readonly interfaceKey: string = 'moonInterface';

  getChartInfo(): MoonChartInfoStorageObject {
    if (localStorage.getItem(this.chartInfoKey)) {
      return JSON.parse(localStorage.getItem(this.chartInfoKey) as string);
    } else {
      return MoonChartInfo.getDefaultChartInfo();
    }
  }

  getData(): MoonDataDict[] {
    if (localStorage.getItem(this.dataKey)) {
      return JSON.parse(localStorage.getItem(this.dataKey) as string);
    } else {
      return MoonData.getDefaultData();
    }
  }

  getInterface(): MoonInterfaceStorageObject {
    if (localStorage.getItem(this.interfaceKey)) {
      return JSON.parse(localStorage.getItem(this.interfaceKey) as string);
    } else {
      return new MoonInterfaceImpl().getDefaultStorageObject();
    }
  }

  resetChartInfo(): void {
    localStorage.setItem(this.chartInfoKey, JSON.stringify(MoonChartInfo.getDefaultChartInfo()));
  }

  resetData(): void {
    localStorage.setItem(this.dataKey, JSON.stringify(MoonData.getDefaultData()));
  }

  resetInterface(): void {
    localStorage.setItem(this.interfaceKey, JSON.stringify(new MoonInterfaceImpl().getDefaultStorageObject()));
  }

  saveChartInfo(chartInfo: MoonChartInfoStorageObject): void {
    localStorage.setItem(this.chartInfoKey, JSON.stringify(chartInfo));
  }

  saveData(data: MoonDataDict[]): void {
    localStorage.setItem(this.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: MoonInterfaceStorageObject): void {
    localStorage.setItem(this.interfaceKey, JSON.stringify(interfaceInfo));
  }

}


export interface MoonModel {
  getMoonModelData(): number[][];
}

export enum UpdateSource {
  INIT = "init",
  RESET = "reset",
  INTERFACE = "interface",
}
