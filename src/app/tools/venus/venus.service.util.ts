import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";
import {ChartInfo} from "../shared/charts/chart.interface";

export interface VenusDataDict {
  diameter: number | null;
  phase: number | null;
}


export class VenusData implements MyData {
  private dataDict: VenusDataDict[];

  constructor() {
    this.dataDict = VenusData.getDefaultData();
  }

  addRow(index: number, amount: number): void {
    if (index < 0) {
      this.dataDict.push({diameter: null, phase: null});
    } else {
      for (let i = 0; i < amount; i++) {
        this.dataDict.splice(index + i, 0, {diameter: null, phase: null});
      }
    }
  }

  getData(): VenusDataDict[] {
    return this.dataDict;
  }

  getDataArray(): (number|null)[][] {
    return this.dataDict.map(
      (entry: VenusDataDict) => {
      return [entry.diameter, entry.phase];
    });
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: VenusDataDict[]): void {
    this.dataDict = data;
  }

  public static getDefaultData(): VenusDataDict[] {
    return [
      {diameter: 15, phase: 0.7},
      {diameter: 30, phase: 0.53},
      {diameter: 45, phase: 0.27},
      {diameter: 60, phase: 0},
      {diameter: null, phase: null},
      {diameter: null, phase: null},
      {diameter: null, phase: null},
      {diameter: null, phase: null},
      {diameter: null, phase: null},
      {diameter: null, phase: null},
    ];
  }
}


export interface VenusChartInfoStorageObject {
  chartTitle: string;
  dataLabel: string;
  xAxisLabel: string;
  yAxisLabel: string;
}


export class VenusChartInfo implements ChartInfo {
  private chartTitle: string;
  private dataLabel: string;
  private xAxisLabel: string;
  private yAxisLabel: string;


  constructor() {
    this.chartTitle = VenusChartInfo.getDefaultChartInfo().chartTitle;
    this.dataLabel = VenusChartInfo.getDefaultChartInfo().dataLabel;
    this.xAxisLabel = VenusChartInfo.getDefaultChartInfo().xAxisLabel;
    this.yAxisLabel = VenusChartInfo.getDefaultChartInfo().yAxisLabel;
  }

  getChartTitle(): string {
    return this.chartTitle;
  }

  getDataLabel(): string {
    return this.dataLabel;
  }

  getStorageObject(): VenusChartInfoStorageObject {
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

  setStorageObject(storageObject: VenusChartInfoStorageObject): void {
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

  public static getDefaultChartInfo() {
    return {
      chartTitle: "Title",
      dataLabel: "Data",
      xAxisLabel: "x",
      yAxisLabel: "y",
    };
  }
}


export class VenusStorage implements MyStorage {
  private readonly dataKey: string = "venusData";
  private readonly chartInfoKey: string = "venusChartInfo";
  getChartInfo(): VenusChartInfoStorageObject {
    if (localStorage.getItem(this.chartInfoKey)) {
      return JSON.parse(localStorage.getItem(this.chartInfoKey) as string);
    } else {
      this.saveChartInfo(VenusChartInfo.getDefaultChartInfo());
      return VenusChartInfo.getDefaultChartInfo();
    }

  }

  getData(): VenusDataDict[] {
    if (localStorage.getItem(this.dataKey)) {
      return JSON.parse(localStorage.getItem(this.dataKey) as string);
    } else {
      this.saveData(VenusData.getDefaultData());
      return VenusData.getDefaultData();
    }
  }

  getInterface(): any {
  }

  resetChartInfo(): void {
    this.saveChartInfo(VenusChartInfo.getDefaultChartInfo());
  }

  resetData(): void {
    this.saveData(VenusData.getDefaultData());
  }

  resetInterface(): void {
  }

  saveChartInfo(chartInfo: VenusChartInfoStorageObject): void {
    localStorage.setItem(this.chartInfoKey, JSON.stringify(chartInfo));
  }

  saveData(data: VenusDataDict[]): void {
    localStorage.setItem(this.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: any): void {
  }

}

