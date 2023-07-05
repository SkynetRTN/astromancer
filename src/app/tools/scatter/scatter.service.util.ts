import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";
import {ChartInfo} from "../shared/charts/chart.interface";

export interface ScatterDataDict {
  longitude: number | null;
  latitude: number | null;
  distance: number | null;
}

export class ScatterData implements MyData {
  private static readonly FLOAT_PRECISION = 3;
  private dataDict: ScatterDataDict[];

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


export interface ScatterInterfaceStorageObject {
  distance: number;
  diameter: number;
}


export interface ScatterModel {
  getDistance(): number;

  getDiameter(): number;

  setDistance(distance: number): void;

  setDiameter(diameter: number): void;

  getModelStorageObject(): ScatterInterfaceStorageObject;

  setModelStorageObject(storageObject: ScatterInterfaceStorageObject): void;

  getModel(): number[][];
}


export class ScatterModelInterface implements ScatterModel {
  private distance: number;
  private diameter: number;

  constructor() {
    this.distance = ScatterModelInterface.getDefaultStorageObject().distance;
    this.diameter = ScatterModelInterface.getDefaultStorageObject().diameter;
  }

  public static getDefaultStorageObject(): ScatterInterfaceStorageObject {
    return {
      distance: 0,
      diameter: 10,
    }
  }

  getDiameter(): number {
    return this.diameter
  }

  getDistance(): number {
    return this.distance;
  }

  /**
   * A circle with x of this.distance, y of 0, and diameter of this.diameter
   */
  getModel(): number[][] {
    let modelData: number[][] = [];
    const x = this.getDistance();
    const y = 0;
    const diameter = this.getDiameter();
    const steps = 500;

    let step = 2 * Math.PI / steps;
    for (let i = 0; i < steps; i++) {
      modelData.push([
        this.formatNumber(x + Math.cos(step * i) * (diameter / 2)),
        this.formatNumber(y + Math.sin(step * i) * (diameter / 2))
      ]);
    }
    // Add a redundant point to complete the circle.
    modelData.push([this.formatNumber(x + (diameter / 2)), this.formatNumber(y)])
    return modelData;
  }

  getModelStorageObject(): ScatterInterfaceStorageObject {
    return {
      distance: this.distance,
      diameter: this.diameter,
    }
  }

  setDiameter(diameter: number): void {
    this.diameter = diameter;
  }

  setDistance(distance: number): void {
    this.distance = distance;
  }

  setModelStorageObject(storageObject: ScatterInterfaceStorageObject): void {
    this.distance = storageObject.distance;
    this.diameter = storageObject.diameter;
  }

  private formatNumber(input: number): number {
    return parseFloat(input.toFixed(3));
  }

}


export class ScatterStorage implements MyStorage {
  private static readonly dataKey: string = "scatterData";
  private static readonly chartInfoKey: string = "scatterChartInfo";
  private static readonly interfaceKey: string = "scatterInterface";

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

  getInterface(): ScatterInterfaceStorageObject {
    if (localStorage.getItem(ScatterStorage.interfaceKey)) {
      return JSON.parse(localStorage.getItem(ScatterStorage.interfaceKey) as string);
    } else {
      return ScatterModelInterface.getDefaultStorageObject();
    }
  }

  resetChartInfo(): void {
    localStorage.setItem(ScatterStorage.chartInfoKey, JSON.stringify(ScatterChartInfo.getDefaultStorageObject()));
  }

  resetData(): void {
    localStorage.setItem(ScatterStorage.dataKey, JSON.stringify(ScatterData.getDefaultDataDict()));
  }

  resetInterface(): void {
    localStorage.setItem(ScatterStorage.interfaceKey, JSON.stringify(ScatterModelInterface.getDefaultStorageObject()));
  }

  saveChartInfo(chartInfo: ScatterChartInfoStorageObject): void {
    localStorage.setItem(ScatterStorage.chartInfoKey, JSON.stringify(chartInfo));
  }

  saveData(data: ScatterDataDict[]): void {
    localStorage.setItem(ScatterStorage.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: ScatterInterfaceStorageObject): void {
    localStorage.setItem(ScatterStorage.interfaceKey, JSON.stringify(interfaceInfo));
  }

}
