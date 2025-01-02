import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";
import {ChartInfo} from "../shared/charts/chart.interface";

export interface GravityDataDict {
  wavelength: number | null;
  channel1: number | null;
  channel2: number | null;
}

export class GravityData implements MyData {
  private dataDict: GravityDataDict[];

  constructor() {
    this.dataDict = GravityData.getDefaultData();
  }

  /**
   * Generate random data as the demo dataset
   */
  public static getDefaultData(): GravityDataDict[] {
    const result: GravityDataDict[] = [];
    for (let i = 0; i < 200; i++) {
      let wl = i / 200 * 0.03 + 21.09;
      result.push({
        wavelength: wl,
        channel1: 100 - Math.pow(100 * (wl - 21.105), 2) / 0.015 + Math.random() * 21,
        channel2: 100 - Math.pow(100 * (wl - 21.105), 2) / 0.015 + Math.random() * 21,
      });
    }
    return result;
  }

  addRow(index: number, amount: number): void {
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.dataDict.splice(index + i, 0, {wavelength: null, channel1: null, channel2: null},);
      }
    } else {
      this.dataDict.push({wavelength: null, channel1: null, channel2: null},);
    }
  }

  getData(): GravityDataDict[] {
    return this.dataDict;
  }

  getDataArray(): number[][][] {
    return [
      this.dataDict.filter(
        (GravityDataDict: GravityDataDict) => {
          return GravityDataDict.wavelength !== null
            && GravityDataDict.channel1 !== null;
        }
      ).map((entry: GravityDataDict) => [entry.wavelength, entry.channel1]) as number[][],
      this.dataDict.filter(
        (gravityDataDict: GravityDataDict) => {
          return gravityDataDict.wavelength !== null
            && gravityDataDict.channel2 !== null;
        }
      ).map((entry: GravityDataDict) => [entry.wavelength, entry.channel2]) as number[][],
    ]
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: GravityDataDict[]): void {
    this.dataDict = data;
  }

}


export enum GravityOptions {
  ONE = "Spectogram",
  TWO = "Channel 2",
}

export interface GravityInterface {
  getChannel(): GravityOptions;

  setChannel(channel: GravityOptions): void;
}


export class GravityInterfaceImpl implements GravityInterface {
  private channel: GravityOptions;

  constructor() {
    this.channel = GravityOptions.ONE;
  }

  public static getDefaultChannel(): GravityOptions {
    return GravityOptions.ONE;
  }

  getChannel(): GravityOptions {
    return this.channel;
  }

  setChannel(channel: GravityOptions): void {
    this.channel = channel;
  }
}


export interface GravityChartInfoStorageObject {
  title: string;
  xAxis: string;
  yAxis: string;
  data: string;
}

export class GravityChartInfo implements ChartInfo {
  private chartTitle: string;
  private xAxisLabel: string;
  private yAxisLabel: string;
  private dataLabel: string;

  constructor() {
    this.chartTitle = GravityChartInfo.getDefaultStorageObject().title;
    this.xAxisLabel = GravityChartInfo.getDefaultStorageObject().xAxis;
    this.yAxisLabel = GravityChartInfo.getDefaultStorageObject().yAxis;
    this.dataLabel = GravityChartInfo.getDefaultStorageObject().data;
  }

  public static getDefaultStorageObject(): GravityChartInfoStorageObject {
    return {
      title: "Title",
      xAxis: "",
      yAxis: "",
      data: "Channel 1",
    }
  }

  getChartTitle(): string {
    return this.chartTitle;
  }

  getDataLabel(): string {
    return this.dataLabel;
  }

  getStorageObject(): GravityChartInfoStorageObject {
    return {
      title: this.chartTitle,
      xAxis: this.xAxisLabel,
      yAxis: this.yAxisLabel,
      data: this.dataLabel,
    }
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

  setStorageObject(storageObject: GravityChartInfoStorageObject): void {
    this.chartTitle = storageObject.title;
    this.xAxisLabel = storageObject.xAxis;
    this.yAxisLabel = storageObject.yAxis;
    this.dataLabel = storageObject.data;
  }

  setXAxisLabel(xAxis: string): void {
    this.xAxisLabel = xAxis;
  }

  setYAxisLabel(yAxis: string): void {
    this.yAxisLabel = yAxis;
  }

}


export class GravityStorage implements MyStorage {
  private static readonly dataKey: string = 'gravityData';
  private static readonly interfaceKey: string = 'gravityInterface';
  private static readonly chartInfoKey: string = 'gravityChartInfo';

  getChartInfo(): GravityChartInfoStorageObject {
    if (localStorage.getItem(GravityStorage.chartInfoKey)) {
      return JSON.parse(localStorage.getItem(GravityStorage.chartInfoKey)!) as GravityChartInfoStorageObject;
    } else {
      return GravityChartInfo.getDefaultStorageObject();
    }
  }

  getData(): GravityDataDict[] {
    if (localStorage.getItem(GravityStorage.dataKey)) {
      return JSON.parse(localStorage.getItem(GravityStorage.dataKey)!) as GravityDataDict[];
    } else {
      return GravityData.getDefaultData();
    }
  }

  getInterface(): GravityOptions {
    if (localStorage.getItem(GravityStorage.interfaceKey)) {
      return JSON.parse(localStorage.getItem(GravityStorage.interfaceKey)!) as GravityOptions;
    } else {
      return GravityInterfaceImpl.getDefaultChannel();
    }
  }

  resetChartInfo(): void {
    localStorage.setItem(GravityStorage.chartInfoKey, JSON.stringify(GravityChartInfo.getDefaultStorageObject()));
  }

  resetData(): void {
    localStorage.setItem(GravityStorage.dataKey, JSON.stringify(GravityData.getDefaultData()));
  }

  resetInterface(): void {
    localStorage.setItem(GravityStorage.interfaceKey, JSON.stringify(GravityInterfaceImpl.getDefaultChannel()));
  }

  saveChartInfo(chartInfo: GravityChartInfoStorageObject): void {
    localStorage.setItem(GravityStorage.chartInfoKey, JSON.stringify(chartInfo));
  }

  saveData(data: GravityDataDict[]): void {
    localStorage.setItem(GravityStorage.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: GravityOptions): void {
    localStorage.setItem(GravityStorage.interfaceKey, JSON.stringify(interfaceInfo));
  }

}
