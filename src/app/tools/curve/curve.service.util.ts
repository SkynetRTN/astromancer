import {ChartInfo} from "../shared/charts/chart.interface";
import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";

export enum CurveParam {
  X = 'x',
  Y1 = 'y1',
  Y2 = 'y2',
  Y3 = 'y3',
  Y4 = 'y4'
}

export enum CurveCounts {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4
}

export interface CurveDataDict {
  x: number | null;
  y1: number | null;
  y2?: number | null;
  y3?: number | null;
  y4?: number | null;
}

export interface CurveChartInfoStorageObject {
  chartTitle: string;
  xAxisLabel: string;
  yAxisLabel: string;
  dataLabels: string;
}

export class CurveChartInfo implements ChartInfo {
  private chartTitle: string;
  private xAxisLabel: string;
  private yAxisLabel: string;
  private dataLabels: string[];

  constructor() {
    this.chartTitle = "Title";
    this.xAxisLabel = "x";
    this.yAxisLabel = "y";
    this.dataLabels = ["y1", "y2", "y3", "y4"];
  }

  static getDefaultStorageObject(): CurveChartInfoStorageObject {
    return {
      chartTitle: "Title",
      xAxisLabel: "x",
      yAxisLabel: "y",
      dataLabels: "y1, y2, y3, y4"
    };
  }

  getChartTitle(): string {
    return this.chartTitle;
  }

  getDataLabel(): string {
    return this.dataLabels.join(", ");
  }

  getTableLabels(): string[] {
    return ["x"].concat(this.dataLabels);
  }

  getDataLabelByCurveCount(curveCount: number): string {
    const result = this.dataLabels;
    return result.slice(0, curveCount).join(", ");
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

  setDataLabel(dataLabel: string): void {
    const dataLabelArray = dataLabel.split(",").map((label) => label.trim());
    for (let i = 0; i < Math.min(this.dataLabels.length, dataLabelArray.length); i++) {
      this.dataLabels[i] = dataLabelArray[i];
    }
  }

  setXAxisLabel(xAxisLabel: string): void {
    this.xAxisLabel = xAxisLabel;
  }

  setYAxisLabel(yAxisLabel: string): void {
    this.yAxisLabel = yAxisLabel;
  }

  getStorageObject(): CurveChartInfoStorageObject {
    return {
      chartTitle: this.chartTitle,
      xAxisLabel: this.xAxisLabel,
      yAxisLabel: this.yAxisLabel,
      dataLabels: this.getDataLabelByCurveCount(CurveCounts.FOUR)
    };
  }

  setStorageObject(storageObject: CurveChartInfoStorageObject): void {
    this.setChartTitle(storageObject.chartTitle);
    this.setXAxisLabel(storageObject.xAxisLabel);
    this.setYAxisLabel(storageObject.yAxisLabel);
    this.setDataLabel(storageObject.dataLabels);
  }

}


export class CurveData implements MyData {
  private curveDataDict!: CurveDataDict[];

  constructor() {
    this.setData(CurveData.getDefaultData());
  }

  public static getDefaultData(): CurveDataDict[] {
    return [
      {x: 0, y1: 25, y2: null, y3: null, y4: null},
      {x: 1, y1: 16, y2: null, y3: null, y4: null},
      {x: 2, y1: 9, y2: null, y3: null, y4: null},
      {x: 3, y1: 4, y2: null, y3: null, y4: null},
      {x: 4, y1: 1, y2: null, y3: null, y4: null},
      {x: 5, y1: 4, y2: null, y3: null, y4: null},
      {x: 6, y1: 9, y2: null, y3: null, y4: null},
      {x: 7, y1: 16, y2: null, y3: null, y4: null},
      {x: 8, y1: 25, y2: null, y3: null, y4: null},
      {x: 9, y1: 36, y2: null, y3: null, y4: null},
      {x: null, y1: null, y2: null, y3: null, y4: null},
      {x: null, y1: null, y2: null, y3: null, y4: null},
      {x: null, y1: null, y2: null, y3: null, y4: null},
      {x: null, y1: null, y2: null, y3: null, y4: null},
      {x: null, y1: null, y2: null, y3: null, y4: null},
    ];
  }

  public getCurveData(curveCount: number): CurveDataDict[] {
    let result: CurveDataDict[] = [];
    for (const entry of this.curveDataDict) {
      let row: CurveDataDict = {x: entry.x, y1: entry.y1};
      if (curveCount >= CurveCounts.TWO) {
        row.y2 = entry.y2;
      }
      if (curveCount >= CurveCounts.THREE) {
        row.y3 = entry.y3;
      }
      if (curveCount >= CurveCounts.FOUR) {
        row.y4 = entry.y4;
      }
      result.push(row);
    }
    return result;
  }

  public setData(data: CurveDataDict[]): void {
    this.curveDataDict = data;
    this.sortDataByX();
  }


  addRow(index: number, amount: number) {
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.curveDataDict.splice(index + i, 0, {x: null, y1: null, y2: null, y3: null, y4: null});
      }
    } else
      this.curveDataDict.push({x: null, y1: null, y2: null, y3: null, y4: null});
  }

  removeRow(index: number, amount: number) {
    this.curveDataDict = this.curveDataDict.slice(0, index).concat(this.curveDataDict.slice(index + amount));
  }

  public getData(): any[] {
    return this.curveDataDict;
  }

  setDataByCellOnTableChange(changes: any): void {
    changes?.forEach(([row, col, , newValue]: any[]) => {
      this.setDataByCell(newValue, row, col);
    });
  }

  private setDataByCell(value: number | null, row: number, col: string): void {
    switch (col) {
      case CurveParam.X:
        this.curveDataDict[row][CurveParam.X] = value;
        break;
      case CurveParam.Y1:
        this.curveDataDict[row][CurveParam.Y1] = value;
        break;
      case CurveParam.Y2:
        this.curveDataDict[row][CurveParam.Y2] = value;
        break;
      case CurveParam.Y3:
        this.curveDataDict[row][CurveParam.Y3] = value;
        break;
      case CurveParam.Y4:
        this.curveDataDict[row][CurveParam.Y4] = value;
        break;
    }
    this.sortDataByX();
  }

  private sortDataByX(): void {
    this.curveDataDict = this.curveDataDict.sort(
      (a, b) => {
        if (a['x'] === null)
          return 1;
        if (b['x'] === null)
          return -1;
        if (a['x'] < b['x'])
          return -1;
        if (a['x'] > b['x'])
          return 1;
        else
          return 0;
      }
    );
  }
}


export interface CurveInterface {
  getCurveCount(): number;

  setCurveCount(curveCount: number): void;

  getIsMagnitudeOn(): boolean;

  setIsMagnitudeOn(isMagnitudeOn: boolean): void;
}


export interface CurveInterfaceStorageObject {
  curveCount: CurveCounts;
  isMagnitudeOn: boolean;
}


export class CurveImpl implements CurveInterface {
  private curveCount: number = CurveCounts.ONE;
  private isMagnitudeOn: boolean = false;

  public static getDefaultStorageObject(): CurveInterfaceStorageObject {
    return {curveCount: CurveCounts.ONE, isMagnitudeOn: false};
  }

  getCurveCount(): number {
    return this.curveCount;
  }

  getIsMagnitudeOn(): boolean {
    return this.isMagnitudeOn;
  }

  setCurveCount(curveCount: number): void {
    if (curveCount in CurveCounts)
      this.curveCount = curveCount;
    else
      throw new Error("Invalid curve count");
  }

  setIsMagnitudeOn(isMagnitudeOn: boolean): void {
    this.isMagnitudeOn = isMagnitudeOn;
  }

  public getStorageObject(): CurveInterfaceStorageObject {
    return {curveCount: this.curveCount, isMagnitudeOn: this.isMagnitudeOn};
  }

  public setStorageObject(curveInterfaceStorageObject: CurveInterfaceStorageObject): void {
    this.curveCount = curveInterfaceStorageObject.curveCount;
    this.isMagnitudeOn = curveInterfaceStorageObject.isMagnitudeOn;
  }

}


export class CurveStorage implements MyStorage {
  private readonly dataKey: string = "curve-data";
  private readonly interfaceKey: string = "curve-interface";
  private readonly chartInfoKey: string = "curve-chart-info";
  private readonly defaultData: CurveDataDict[]
  private readonly defaultChartInfo!: CurveChartInfoStorageObject
  private readonly defaultInterface!: CurveInterfaceStorageObject

  constructor(defaultData: CurveDataDict[], defaultChartInfo: CurveChartInfoStorageObject, defaultInterface: CurveInterfaceStorageObject) {
    this.defaultData = defaultData;
    this.defaultChartInfo = defaultChartInfo;
    this.defaultInterface = defaultInterface;
  }

  getChartInfo(): CurveChartInfoStorageObject {
    if (localStorage.getItem(this.chartInfoKey)) {
      return JSON.parse(localStorage.getItem(this.chartInfoKey)!);
    } else
      return this.defaultChartInfo;
  }

  getData(): CurveDataDict[] {
    if (localStorage.getItem(this.dataKey)) {
      return JSON.parse(localStorage.getItem(this.dataKey)!);
    } else
      return this.defaultData;
  }

  getInterface(): any {
    if (localStorage.getItem(this.interfaceKey)) {
      return JSON.parse(localStorage.getItem(this.interfaceKey)!);
    } else
      return this.defaultInterface;
  }

  saveChartInfo(chartInfoObject: CurveChartInfoStorageObject): void {
    localStorage.setItem(this.chartInfoKey, JSON.stringify(chartInfoObject));
  }

  saveData(data: CurveDataDict[]): void {
    localStorage.setItem(this.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: any): void {
    localStorage.setItem(this.interfaceKey, JSON.stringify(interfaceInfo));
  }

  resetChartInfo(): void {
    localStorage.setItem(this.chartInfoKey, JSON.stringify(this.defaultChartInfo));
  }

  resetData(): void {
    localStorage.setItem(this.dataKey, JSON.stringify(this.defaultData));
  }

  resetInterface(): void {
    localStorage.setItem(this.interfaceKey, JSON.stringify(this.defaultInterface));
  }

}
