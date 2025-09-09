import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";
import {ChartInfo} from "../shared/charts/chart.interface";

export interface GalaxyDataDict {
  frequency: number | null;
  channel1: number | null;
  channel2: number | null;
}

export class GalaxyData implements MyData {
  private dataDict: GalaxyDataDict[];

  constructor() {
    this.dataDict = GalaxyData.getDefaultData();
  }

  /**
   * Generate random data as the demo dataset
   */
  public static getDefaultData(): GalaxyDataDict[] {
    const result: GalaxyDataDict[] = [];
    for (let i = 0; i < 200; i++) {
      const freq = i / 200 * 0.03 + 21.09;
      result.push({
        frequency: freq,
        channel1: 100 - Math.pow(100 * (freq - 21.105), 2) / 0.015 + Math.random() * 21,
        channel2: 100 - Math.pow(100 * (freq - 21.105), 2) / 0.015 + Math.random() * 21,
      });
    }
    return result;
  }

  addRow(index: number, amount: number): void {
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.dataDict.splice(index + i, 0, {frequency: null, channel1: null, channel2: null},);
      }
    } else {
      this.dataDict.push({frequency: null, channel1: null, channel2: null},);
    }
  }

  getData(): GalaxyDataDict[] {
    return this.dataDict;
  }

  getDataArray(): number[][][] {
    return [
      this.dataDict.filter(
        (galaxyDataDict: GalaxyDataDict) => {
          return galaxyDataDict.frequency !== null
            && galaxyDataDict.channel1 !== null;
        }
      ).map((entry: GalaxyDataDict) => [entry.frequency, entry.channel1]) as number[][],
      this.dataDict.filter(
        (galaxyDataDict: GalaxyDataDict) => {
          return galaxyDataDict.frequency !== null
            && galaxyDataDict.channel2 !== null;
        }
      ).map((entry: GalaxyDataDict) => [entry.frequency, entry.channel2]) as number[][],
    ]
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: GalaxyDataDict[]): void {
    this.dataDict = data;
  }

}


export enum GalaxyOptions {
  ONE = "Channel 1",
  TWO = "Channel 2",
}

export interface GalaxyInterface {
  getChannel(): GalaxyOptions;

  setChannel(channel: GalaxyOptions): void;
}


export class GalaxyInterfaceImpl implements GalaxyInterface {
  private channel: GalaxyOptions;

  constructor() {
    this.channel = GalaxyOptions.ONE;
  }

  public static getDefaultChannel(): GalaxyOptions {
    return GalaxyOptions.ONE;
  }

  getChannel(): GalaxyOptions {
    return this.channel;
  }

  setChannel(channel: GalaxyOptions): void {
    this.channel = channel;
  }
}


export interface GalaxyChartInfoStorageObject {
  title: string;
  xAxis: string;
  yAxis: string;
  data: string;
}

export class GalaxyChartInfo implements ChartInfo {
  private chartTitle: string;
  private xAxisLabel: string;
  private yAxisLabel: string;
  private dataLabel: string;

  constructor() {
    this.chartTitle = GalaxyChartInfo.getDefaultStorageObject().title;
    this.xAxisLabel = GalaxyChartInfo.getDefaultStorageObject().xAxis;
    this.yAxisLabel = GalaxyChartInfo.getDefaultStorageObject().yAxis;
    this.dataLabel = GalaxyChartInfo.getDefaultStorageObject().data;
  }

  public static getDefaultStorageObject(): GalaxyChartInfoStorageObject {
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

  getStorageObject(): GalaxyChartInfoStorageObject {
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

  setStorageObject(storageObject: GalaxyChartInfoStorageObject): void {
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


export class GalaxyStorage implements MyStorage {
  private static readonly dataKey: string = 'galaxyData';
  private static readonly interfaceKey: string = 'galaxyInterface';
  private static readonly chartInfoKey: string = 'galaxyChartInfo';

  getChartInfo(): GalaxyChartInfoStorageObject {
    if (localStorage.getItem(GalaxyStorage.chartInfoKey)) {
      return JSON.parse(localStorage.getItem(GalaxyStorage.chartInfoKey)!) as GalaxyChartInfoStorageObject;
    } else {
      return GalaxyChartInfo.getDefaultStorageObject();
    }
  }

  getData(): GalaxyDataDict[] {
    if (localStorage.getItem(GalaxyStorage.dataKey)) {
      return JSON.parse(localStorage.getItem(GalaxyStorage.dataKey)!) as GalaxyDataDict[];
    } else {
      return GalaxyData.getDefaultData();
    }
  }

  getInterface(): GalaxyOptions {
    if (localStorage.getItem(GalaxyStorage.interfaceKey)) {
      return JSON.parse(localStorage.getItem(GalaxyStorage.interfaceKey)!) as GalaxyOptions;
    } else {
      return GalaxyInterfaceImpl.getDefaultChannel();
    }
  }

  resetChartInfo(): void {
    localStorage.setItem(GalaxyStorage.chartInfoKey, JSON.stringify(GalaxyChartInfo.getDefaultStorageObject()));
  }

  resetData(): void {
    localStorage.setItem(GalaxyStorage.dataKey, JSON.stringify(GalaxyData.getDefaultData()));
  }

  resetInterface(): void {
    localStorage.setItem(GalaxyStorage.interfaceKey, JSON.stringify(GalaxyInterfaceImpl.getDefaultChannel()));
  }

  saveChartInfo(chartInfo: GalaxyChartInfoStorageObject): void {
    localStorage.setItem(GalaxyStorage.chartInfoKey, JSON.stringify(chartInfo));
  }

  saveData(data: GalaxyDataDict[]): void {
    localStorage.setItem(GalaxyStorage.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: GalaxyOptions): void {
    localStorage.setItem(GalaxyStorage.interfaceKey, JSON.stringify(interfaceInfo));
  }

}
