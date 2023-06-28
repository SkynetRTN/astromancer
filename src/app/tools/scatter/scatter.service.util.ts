import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";
import {parse} from "@babel/core";
import {ChartInfo} from "../shared/charts/chart.interface";

export interface ScatterDataDict {
  longitude: number | null;
  latitude: number | null;
  distance: number | null;
}

export class ScatterData implements MyData {
  private dataDict: ScatterDataDict[];
  private static readonly FLOAT_PRECISION = 3;

  constructor() {
    this.dataDict = ScatterData.getDefaultDataDict();
  }

  public static getDefaultDataDict(): ScatterDataDict[] {
    const result: ScatterDataDict[] = [];
    for (let i = 0; i < 15; i++) {
      result.push({
        longitude: Math.random() * 40.0 - 20.0,
        latitude: Math.random() * 40.0 - 20.0,
        distance: Math.random() * 20.0
      });
    }
    return result;
  }

  addRow(index: number, amount: number): void {
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.dataDict.splice(index + i, 0, {longitude: null, latitude: null, distance: null});
      }
    } else {
      this.dataDict.push({longitude: null, latitude: null, distance: null});
    }
  }

  getData(): any[] {
    return this.dataDict;
  }

  /**
   * Transforms longitude, latitude and distance to x and y
   *  coordinates to be rendered in the chart
   */
  getDataArray(): (number | null)[][] {
    return this.dataDict.filter(
      (scatterDataDict: ScatterDataDict) => {
        return scatterDataDict.longitude !== null
          && scatterDataDict.latitude !== null
          && scatterDataDict.distance !== null;
      }
    ).map(
      (entry: ScatterDataDict) => {
        return [
          parseFloat((Math.cos(entry.latitude! / 180 * Math.PI) * entry.distance! * Math.cos(entry.longitude! / 180 * Math.PI)).toFixed(ScatterData.FLOAT_PRECISION)),
          parseFloat((Math.cos(entry.latitude! / 180 * Math.PI) * entry.distance! * Math.sin(entry.longitude! / 180 * Math.PI)).toFixed(ScatterData.FLOAT_PRECISION)),
        ];
      }
    );
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: ScatterDataDict[]): void {
    this.dataDict = data;
  }

}


export interface ScatterChartInfoStorageObject {
  chartTitle: string;
  dataLabel: string;
  xAxisLabel: string;
  yAxisLabel: string;
}

export class ScatterChartInfo implements ChartInfo {
  private chartTitle: string;
  private dataLabel: string;
  private xAxisLabel: string;
  private yAxisLabel: string;

  constructor() {
    this.chartTitle = ScatterChartInfo.getDefaultStorageObject().chartTitle;
    this.dataLabel = ScatterChartInfo.getDefaultStorageObject().dataLabel;
    this.xAxisLabel = ScatterChartInfo.getDefaultStorageObject().xAxisLabel;
    this.yAxisLabel = ScatterChartInfo.getDefaultStorageObject().yAxisLabel;
  }


  public static getDefaultStorageObject(): ScatterChartInfoStorageObject {
    return {
      chartTitle: "Title",
      dataLabel: "Data",
      xAxisLabel: "x",
      yAxisLabel: "y",
    }
  }

  getChartTitle(): string {
    return this.chartTitle;
  }

  getDataLabel(): string {
    return this.dataLabel;
  }

  getStorageObject(): ScatterChartInfoStorageObject {
    return {
      chartTitle: this.chartTitle,
      dataLabel: this.dataLabel,
      xAxisLabel: this.xAxisLabel,
      yAxisLabel: this.yAxisLabel,
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

  setStorageObject(storageObject: ScatterChartInfoStorageObject): void {
    this.chartTitle = storageObject.chartTitle;
    this.dataLabel = storageObject.dataLabel;
    this.xAxisLabel = storageObject.xAxisLabel;
    this.yAxisLabel = storageObject.yAxisLabel;
  }

  setXAxisLabel(xAxis: string): void {
    this.xAxisLabel = xAxis;
  }

  setYAxisLabel(yAxis: string): void {
    this.yAxisLabel = yAxis;
  }

}


export class ScatterStorage implements MyStorage {
  private static readonly dataKey: string = "scatterData";
  private static readonly chartInfoKey: string = "scatterChartInfo";

  getChartInfo(): ScatterChartInfoStorageObject {
    if (localStorage.getItem(ScatterStorage.chartInfoKey)) {
      return JSON.parse(localStorage.getItem(ScatterStorage.chartInfoKey) as string);
    } else {
      return ScatterChartInfo.getDefaultStorageObject();
    }
  }

  getData(): ScatterDataDict[] {
    if (localStorage.getItem(ScatterStorage.dataKey)) {
      return JSON.parse(localStorage.getItem(ScatterStorage.dataKey) as string);
    } else {
      return ScatterData.getDefaultDataDict();
    }
  }

  getInterface(): any {
  }

  resetChartInfo(): void {
    localStorage.setItem(ScatterStorage.chartInfoKey, JSON.stringify(ScatterChartInfo.getDefaultStorageObject()));
  }

  resetData(): void {
    localStorage.setItem(ScatterStorage.dataKey, JSON.stringify(ScatterData.getDefaultDataDict()));
  }

  resetInterface(): void {
  }

  saveChartInfo(chartInfo: ScatterChartInfoStorageObject): void {
    localStorage.setItem(ScatterStorage.chartInfoKey, JSON.stringify(chartInfo));
  }

  saveData(data: ScatterDataDict[]): void {
    localStorage.setItem(ScatterStorage.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: any): void {
  }

}
