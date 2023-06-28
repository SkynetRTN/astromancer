import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import {rad} from "../shared/data/utils";

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
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.dataDict.splice(index + i, 0, {diameter: null, phase: null});
      }
    } else {
      this.dataDict.push({diameter: null, phase: null});
    }
  }

  getData(): VenusDataDict[] {
    return this.dataDict;
  }

  getDataArray(): (number|null)[][] {
    return this.dataDict.filter(
      (entry: VenusDataDict) => {
        return entry.diameter !== null && entry.phase !== null;
      }
    ).map(
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


export class VenusModels {
  // Angular diameter of Venus as its closest in arc-seconds.
  private static maxA = 60;
  // Max angular separation between Venus and Sun in radians.
  private static beta = rad(45);
  // Diameter of Venus in km
  private static DV = 1.210e4;
  // Distance from Sun to Earth in km
  private static dE = 1.496e8;
  // Distance from Sun to Venus in km
  private static dV = 1.082e8;

  /**
   *  This function generates the data points for the Geocentric model.
   *  @param start:   The start point of data points.
   *  @param end:     The end point of data points.
   *  @param x:       The parameter x that represents the ratio of distance of Sun to Venus versus the
   *                  distance of Sun to Earth.
   *  @param steps:   The number of data points to be generated. Default is 500.
   *  @returns {Array}
   */
  public static geocentric(start: number, end: number, x: number, steps: number = 500): number[][] {
    const data: number[][] = [];
    const step = (end - start) / steps;

    let a = start;
    for (let i = 0; i < steps; i++) {
      const d: number = (1 - x) * (1 - Math.sin(VenusModels.beta)) * VenusModels.maxA * VenusModels.dE / a;

      // In geocentric model dV is a variable, so we need to override it
      const dV: number = Math.sqrt((1 - x) * VenusModels.sqr(Math.sin(VenusModels.beta)) * VenusModels.sqr(VenusModels.dE) + x * VenusModels.sqr(VenusModels.dE) - x / (1 - x) * VenusModels.sqr(d));
      const cosPhi: number = (VenusModels.sqr(d) + VenusModels.sqr(dV) - VenusModels.sqr(VenusModels.dE)) / (2 * d * dV);

      data.push([
        a,
        (1 + cosPhi) / 2 > 0 ? (1 + cosPhi) / 2 : 0,
        // How is below different from above????
        // y: Math.max((1 + cosPhi) / 2, 0) // this doesn't work. I'm so confused
      ]);
      a += step;
    }
    return data;
  }

  /**
   *  This function generates the data points for the Heliocentric model.
   *  @param start:   The start point of data points.
   *  @param end:     The end point of data points.
   *  @param steps:   The number of data points to be generated. Default is 500.
   *  @returns {Array}
   */
  public static heliocentric(start: number, end: number, steps: number = 500): number[][] {
    const data: number[][] = [];
    const step = (end - start) / steps;

    let a = start;
    for (let i = 0; i < steps; i++) {
      const theta = Math.acos((VenusModels.sqr(VenusModels.DV) / VenusModels.sqr(rad(a / 3600)) - (VenusModels.sqr(VenusModels.dE) + VenusModels.sqr(VenusModels.dV))) / (2 * VenusModels.dE * VenusModels.dV));
      const alpha = Math.atan(VenusModels.dV * Math.sin(theta) / (VenusModels.dE + VenusModels.dV * Math.cos(theta)));
      data.push([
        a,
        (1 - Math.cos(Math.PI - theta + alpha)) / 2,
        // Below is the percentage of illumination of the whole observable surface,
        //   while the above is the actual phase calculation based on observed width over height.
        // y: (Math.PI - theta + alpha) / Math.PI,
      ]);
      a += step;
    }
    return data;
  }

  private static sqr(x: number): number {
    return Math.pow(x, 2);
  }
}

