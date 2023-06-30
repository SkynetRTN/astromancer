import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";
import {ChartInfo} from "../shared/charts/chart.interface";

export interface SpectrumDataDict {
  wavelength: number | null;
  channel1: number | null;
  channel2: number | null;
}

export class SpectrumData implements MyData {
  private dataDict: SpectrumDataDict[];

  constructor() {
    this.dataDict = SpectrumData.getDefaultData();
  }

  /**
   * Generate random data as the demo dataset
   */
  public static getDefaultData(): SpectrumDataDict[] {
    const result: SpectrumDataDict[] = [];
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

  getData(): SpectrumDataDict[] {
    return this.dataDict;
  }

  getDataArray(): number[][][] {
    return [
      this.dataDict.filter(
        (spectrumDataDict: SpectrumDataDict) => {
          return spectrumDataDict.wavelength !== null
            && spectrumDataDict.channel1 !== null;
        }
      ).map((entry: SpectrumDataDict) => [entry.wavelength, entry.channel1]) as number[][],
      this.dataDict.filter(
        (spectrumDataDict: SpectrumDataDict) => {
          return spectrumDataDict.wavelength !== null
            && spectrumDataDict.channel2 !== null;
        }
      ).map((entry: SpectrumDataDict) => [entry.wavelength, entry.channel2]) as number[][],
    ]
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: SpectrumDataDict[]): void {
    this.dataDict = data;
  }

}


export enum SpectrumOptions {
  ONE = "Channel 1",
  TWO = "Channel 2",
}

export interface SpectrumInterface {
  getChannel(): SpectrumOptions;

  setChannel(channel: SpectrumOptions): void;
}


export class SpectrumInterfaceImpl implements SpectrumInterface {
  private channel: SpectrumOptions;

  constructor() {
    this.channel = SpectrumOptions.ONE;
  }

  public static getDefaultChannel(): SpectrumOptions {
    return SpectrumOptions.ONE;
  }

  getChannel(): SpectrumOptions {
    return this.channel;
  }

  setChannel(channel: SpectrumOptions): void {
    this.channel = channel;
  }
}


export interface SpectrumChartInfoStorageObject {
  title: string;
  xAxis: string;
  yAxis: string;
  data: string;
}

export class SpectrumChartInfo implements ChartInfo {
  private chartTitle: string;
  private xAxisLabel: string;
  private yAxisLabel: string;
  private dataLabel: string;

  constructor() {
    this.chartTitle = SpectrumChartInfo.getDefaultStorageObject().title;
    this.xAxisLabel = SpectrumChartInfo.getDefaultStorageObject().xAxis;
    this.yAxisLabel = SpectrumChartInfo.getDefaultStorageObject().yAxis;
    this.dataLabel = SpectrumChartInfo.getDefaultStorageObject().data;
  }

  public static getDefaultStorageObject(): SpectrumChartInfoStorageObject {
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

  getStorageObject(): SpectrumChartInfoStorageObject {
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

  setStorageObject(storageObject: SpectrumChartInfoStorageObject): void {
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


export class SpectrumStorage implements MyStorage {
  private static readonly dataKey: string = 'spectrumData';
  private static readonly interfaceKey: string = 'spectrumInterface';
  private static readonly chartInfoKey: string = 'spectrumChartInfo';

  getChartInfo(): SpectrumChartInfoStorageObject {
    if (localStorage.getItem(SpectrumStorage.chartInfoKey)) {
      return JSON.parse(localStorage.getItem(SpectrumStorage.chartInfoKey)!) as SpectrumChartInfoStorageObject;
    } else {
      return SpectrumChartInfo.getDefaultStorageObject();
    }
  }

  getData(): SpectrumDataDict[] {
    if (localStorage.getItem(SpectrumStorage.dataKey)) {
      return JSON.parse(localStorage.getItem(SpectrumStorage.dataKey)!) as SpectrumDataDict[];
    } else {
      return SpectrumData.getDefaultData();
    }
  }

  getInterface(): SpectrumOptions {
    if (localStorage.getItem(SpectrumStorage.interfaceKey)) {
      return JSON.parse(localStorage.getItem(SpectrumStorage.interfaceKey)!) as SpectrumOptions;
    } else {
      return SpectrumInterfaceImpl.getDefaultChannel();
    }
  }

  resetChartInfo(): void {
    localStorage.setItem(SpectrumStorage.chartInfoKey, JSON.stringify(SpectrumChartInfo.getDefaultStorageObject()));
  }

  resetData(): void {
    localStorage.setItem(SpectrumStorage.dataKey, JSON.stringify(SpectrumData.getDefaultData()));
  }

  resetInterface(): void {
    localStorage.setItem(SpectrumStorage.interfaceKey, JSON.stringify(SpectrumInterfaceImpl.getDefaultChannel()));
  }

  saveChartInfo(chartInfo: SpectrumChartInfoStorageObject): void {
    localStorage.setItem(SpectrumStorage.chartInfoKey, JSON.stringify(chartInfo));
  }

  saveData(data: SpectrumDataDict[]): void {
    localStorage.setItem(SpectrumStorage.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: SpectrumOptions): void {
    localStorage.setItem(SpectrumStorage.interfaceKey, JSON.stringify(interfaceInfo));
  }

}
