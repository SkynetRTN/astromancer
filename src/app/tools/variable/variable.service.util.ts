import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";
import {ChartInfo} from "../shared/charts/chart.interface";

export interface VariableDataDict {
  jd: number | null;
  source1: number | null;
  source2: number | null;
  error1: number | null;
  error2: number | null;
  errorMSE: number | null;
}

export function errorMSE(error1: number | null, error2: number | null): number | null {
  if (error1 == null || error2 == null) {
    return null;
  } else {
    return Math.sqrt(error1 ** 2 + error2 ** 2) / 2;
  }
}

export class VariableData implements MyData {
  private dataDict: VariableDataDict[];

  constructor() {
    this.dataDict = VariableData.getDefaultDataDict();
  }

  public static getDefaultDataDict(): VariableDataDict[] {
    const data: VariableDataDict[] = [];
    for (let i = 0; i < 14; i++) {
      data.push({
        jd: i * 10 + Math.random() * 10 - 5,
        source1: Math.random() * 20,
        source2: Math.random() * 20,
        error1: 1,
        error2: 1,
        errorMSE: errorMSE(1, 1)
      });
    }
    return data;
  }

  addRow(index: number, amount: number): void {
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.dataDict.splice(index + i, 0,
          {jd: null, source1: null, source2: null, error1: null, error2: null, errorMSE: null});
      }
    } else {
      this.dataDict.push({jd: null, source1: null, source2: null, error1: null, error2: null, errorMSE: null});
    }
  }

  getData(): VariableDataDict[] {
    return this.dataDict;
  }

  getDataArray(): (number | null)[][] {
    return this.dataDict.map((entry: VariableDataDict) =>
      [entry.jd, entry.source1, entry.source2, entry.error1, entry.error2]);
  }

  getChartSourcesDataArray(): (number | null)[][][] {
    return [
      this.dataDict.filter(
        (entry: VariableDataDict) => entry.jd !== null && entry.source1 !== null)
        .map(
          (entry: VariableDataDict) => [entry.jd, entry.source1]),
      this.dataDict.filter(
        (entry: VariableDataDict) => entry.jd !== null && entry.source2 !== null)
        .map(
          (entry: VariableDataDict) => [entry.jd, entry.source2])
    ]
  }

  getChartSourcesErrorArray(): (number | null)[][][] {
    return [
      this.dataDict.filter(
        (entry: VariableDataDict) => entry.jd !== null && entry.source1 !== null && entry.errorMSE !== null)
        .map(
          (entry: VariableDataDict) => [entry.jd, entry.source1! - entry.errorMSE!, entry.source1! + entry.errorMSE!]),
      this.dataDict.filter(
        (entry: VariableDataDict) => entry.jd !== null && entry.source2 !== null && entry.errorMSE !== null)
        .map(
          (entry: VariableDataDict) => [entry.jd, entry.source2! - entry.errorMSE!, entry.source2! + entry.errorMSE!]),
    ];
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: VariableDataDict[]): void {
    this.dataDict = data;
    this.dataDict = this.dataDict.map(
        (entry: VariableDataDict) => {
            return {
                jd: entry.jd,
                source1: entry.source1,
                source2: entry.source2,
                error1: entry.error1,
                error2: entry.error2,
                errorMSE: errorMSE(entry.error1, entry.error2)
            }
        }
    );
  }
}


export enum VariableStarOptions {
  NONE = "None",
  SOURCE1 = "Source 1",
  SOURCE2 = "Source 2",
}

export interface VariableInterface {
  getVariableStar(): VariableStarOptions;

  setVariableStar(variableStar: VariableStarOptions): void;

  getReferenceStarMagnitude(): number;

  setReferenceStarMagnitude(magnitude: number): void;

  getIsLightCurveOptionValid(): boolean;
}


export interface VariableInterfaceStorageObject {
  variableStar: VariableStarOptions;
  referenceStarMagnitude: number;
}


export class VariableInterfaceImpl implements VariableInterface {
  private variableStar: VariableStarOptions;
  private referenceStarMagnitude: number;

  constructor() {
    this.variableStar = VariableInterfaceImpl.getDefaultInterface().variableStar;
    this.referenceStarMagnitude = VariableInterfaceImpl.getDefaultInterface().referenceStarMagnitude;
  }

  public static getDefaultInterface(): VariableInterfaceStorageObject {
    return {
      variableStar: VariableStarOptions.NONE,
      referenceStarMagnitude: 0,
    };
  }

  getStorageObject(): VariableInterfaceStorageObject {
    return {
      variableStar: this.variableStar,
      referenceStarMagnitude: this.referenceStarMagnitude,
    };
  }

  setStorageObject(storageObject: VariableInterfaceStorageObject): void {
    this.variableStar = storageObject.variableStar;
    this.referenceStarMagnitude = storageObject.referenceStarMagnitude;
  }

  getVariableStar(): VariableStarOptions {
    return this.variableStar;
  }

  setVariableStar(variableStar: VariableStarOptions): void {
    this.variableStar = variableStar;
  }

  getReferenceStarMagnitude(): number {
    return this.referenceStarMagnitude;
  }

  setReferenceStarMagnitude(magnitude: number): void {
    this.referenceStarMagnitude = magnitude;
  }

  getIsLightCurveOptionValid(): boolean {
    return this.variableStar !== VariableStarOptions.NONE
      && !isNaN(this.referenceStarMagnitude);
  }
}


export interface VariableChartInfoStorageObject {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  dataLabels: string[];
  dataLabel: string;
}

export class VariableChartInfo implements ChartInfo {
  public static readonly defaultHash: string = "XQGeSlw7M6";
  private title: string;
  private xAxisLabel: string;
  private yAxisLabel: string;
  private dataLabels: string[];
  private dataLabel: string;

  constructor() {
    this.title = VariableChartInfo.getDefaultChartInfo().title;
    this.xAxisLabel = VariableChartInfo.getDefaultChartInfo().xAxisLabel;
    this.yAxisLabel = VariableChartInfo.getDefaultChartInfo().yAxisLabel;
    this.dataLabels = VariableChartInfo.getDefaultChartInfo().dataLabels;
    this.dataLabel = VariableChartInfo.getDefaultChartInfo().dataLabel;
  }

  public static getDefaultChartInfo(): VariableChartInfoStorageObject {
    return {
      title: "Title",
      xAxisLabel: "x",
      yAxisLabel: "y",
      dataLabels: ["Source 1", "Source 2"],
      dataLabel: VariableChartInfo.defaultHash,
    }
  }

  getChartTitle(): string {
    return this.title;
  }

  getDataLabel(): string {
    return this.dataLabel;
  }

  getDataLabels(): string {
    if (this.dataLabels[0] === "" && this.dataLabels[1] === "") {
      return "";
    } else {
      return this.dataLabels.join(", ");
    }
  }

  getDataLabelArray(): string[] {
    return this.dataLabels;
  }

  setDataLabels(label: string): void {
    if (label.trim() === "") {
      this.dataLabels = ["", ""];
      return;
    }
    const labelArray = label.split(",").map((label: string) => label.trim());
    for (let i = 0; i < this.dataLabels.length && labelArray.length; i++) {
      this.dataLabels[i] = labelArray[i];
    }
  }

  getStorageObject(): VariableChartInfoStorageObject {
    return {
      title: this.title,
      xAxisLabel: this.xAxisLabel,
      yAxisLabel: this.yAxisLabel,
      dataLabels: this.dataLabels,
      dataLabel: this.dataLabel,
    };
  }

  getXAxisLabel(): string {
    return this.xAxisLabel;
  }

  getYAxisLabel(): string {
    return this.yAxisLabel;
  }

  setChartTitle(title: string): void {
    this.title = title;
  }

  setDataLabel(data: string): void {
    this.dataLabel = data;
  }

  setStorageObject(storageObject: VariableChartInfoStorageObject): void {
    this.title = storageObject.title;
    this.xAxisLabel = storageObject.xAxisLabel;
    this.yAxisLabel = storageObject.yAxisLabel;
    this.dataLabels = storageObject.dataLabels;
    this.dataLabel = storageObject.dataLabel;
  }

  setXAxisLabel(xAxis: string): void {
    this.xAxisLabel = xAxis;
  }

  setYAxisLabel(yAxis: string): void {
    this.yAxisLabel = yAxis;
  }

}


export interface VariablePeriodogramStorageObject {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  dataLabel: string;
  startPeriod: number;
  endPeriod: number;
}


export interface VariablePeriodogramInterface {
  getPeriodogramTitle(): string;

  getPeriodogramXAxisLabel(): string;

  getPeriodogramYAxisLabel(): string;

  getPeriodogramDataLabel(): string;

  getPeriodogramStartPeriod(): number;

  getPeriodogramEndPeriod(): number;

  getPeriodogramStorageObject(): VariablePeriodogramStorageObject;

  setPeriodogramTitle(title: string): void;

  setPeriodogramXAxisLabel(xAxis: string): void;

  setPeriodogramYAxisLabel(yAxis: string): void;

  setPeriodogramDataLabel(data: string): void;

  setPeriodogramStartPeriod(startPeriod: number): void;

  setPeriodogramEndPeriod(endPeriod: number): void;

  setPeriodogramStorageObject(storageObject: VariablePeriodogramStorageObject): void;
}


export class VariablePeriodogram implements VariablePeriodogramInterface {
  public static readonly defaultHash: string = "XQGeSlw7M6";
  private title: string;
  private xAxisLabel: string;
  private yAxisLabel: string;
  private dataLabel: string;
  private startPeriod: number;
  private endPeriod: number;


  constructor() {
    this.title = VariablePeriodogram.getDefaultPeriodogram().title;
    this.xAxisLabel = VariablePeriodogram.getDefaultPeriodogram().xAxisLabel;
    this.yAxisLabel = VariablePeriodogram.getDefaultPeriodogram().yAxisLabel;
    this.dataLabel = VariablePeriodogram.getDefaultPeriodogram().dataLabel;
    this.startPeriod = VariablePeriodogram.getDefaultPeriodogram().startPeriod;
    this.endPeriod = VariablePeriodogram.getDefaultPeriodogram().endPeriod;
  }

  public static getDefaultPeriodogram(): VariablePeriodogramStorageObject {
    return {
      title: "Title",
      xAxisLabel: "x",
      yAxisLabel: "y",
      dataLabel: VariablePeriodogram.defaultHash,
      startPeriod: 0.1,
      endPeriod: 1,
    }
  }

  getPeriodogramDataLabel(): string {
    return this.dataLabel;
  }

  getPeriodogramEndPeriod(): number {
    return this.endPeriod;
  }

  getPeriodogramStartPeriod(): number {
    return this.startPeriod;
  }

  getPeriodogramStorageObject(): VariablePeriodogramStorageObject {
    return {
      title: this.title,
      xAxisLabel: this.xAxisLabel,
      yAxisLabel: this.yAxisLabel,
      dataLabel: this.dataLabel,
      startPeriod: this.startPeriod,
      endPeriod: this.endPeriod,
    }
  }

  getPeriodogramTitle(): string {
    return this.title;
  }

  getPeriodogramXAxisLabel(): string {
    return this.xAxisLabel;
  }

  getPeriodogramYAxisLabel(): string {
    return this.yAxisLabel;
  }

  setPeriodogramDataLabel(data: string): void {
    this.dataLabel = data;
  }

  setPeriodogramEndPeriod(endPeriod: number): void {
    this.endPeriod = endPeriod;
  }

  setPeriodogramStartPeriod(startPeriod: number): void {
    this.startPeriod = startPeriod;
  }

  setPeriodogramStorageObject(storageObject: VariablePeriodogramStorageObject): void {
    this.title = storageObject.title;
    this.xAxisLabel = storageObject.xAxisLabel;
    this.yAxisLabel = storageObject.yAxisLabel;
    this.dataLabel = storageObject.dataLabel;
    this.startPeriod = storageObject.startPeriod;
    this.endPeriod = storageObject.endPeriod;
  }

  setPeriodogramTitle(title: string): void {
    this.title = title;
  }

  setPeriodogramXAxisLabel(xAxis: string): void {
    this.xAxisLabel = xAxis;
  }

  setPeriodogramYAxisLabel(yAxis: string): void {
    this.yAxisLabel = yAxis;
  }

}


export enum VariableDisplayPeriod {
  ONE = '1',
  TWO = '2',
}


export interface VariablePeriodFoldingStorageObject {
  displayPeriod: VariableDisplayPeriod;
  period: number;
  phase: number;
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  dataLabel: string;
}


export interface VariablePeriodFoldingInterface {
  getPeriodFoldingDisplayPeriod(): VariableDisplayPeriod;

  getPeriodFoldingPeriod(): number;

  getPeriodFoldingPhase(): number;

  getPeriodFoldingTitle(): string;

  getPeriodFoldingXAxisLabel(): string;

  getPeriodFoldingYAxisLabel(): string;

  getPeriodFoldingDataLabel(): string;

  setPeriodFoldingDisplayPeriod(displayPeriod: VariableDisplayPeriod): void;

  setPeriodFoldingPeriod(period: number): void;

  setPeriodFoldingPhase(phase: number): void;

  setPeriodFoldingTitle(title: string): void;

  setPeriodFoldingXAxisLabel(xAxis: string): void;

  setPeriodFoldingYAxisLabel(yAxis: string): void;

  setPeriodFoldingDataLabel(data: string): void;
}


export class VariablePeriodFolding implements VariablePeriodFoldingInterface {
  public static readonly defaultHash: string = "XQGeSlw7M6";
  private displayPeriod: VariableDisplayPeriod;
  private period: number;
  private phase: number;
  private title: string;
  private xAxisLabel: string;
  private yAxisLabel: string;
  private dataLabel: string;

  constructor() {
    this.displayPeriod = VariablePeriodFolding.getDefaultStorageObject().displayPeriod;
    this.period = VariablePeriodFolding.getDefaultStorageObject().period;
    this.phase = VariablePeriodFolding.getDefaultStorageObject().phase;
    this.title = VariablePeriodFolding.getDefaultStorageObject().title;
    this.xAxisLabel = VariablePeriodFolding.getDefaultStorageObject().xAxisLabel;
    this.yAxisLabel = VariablePeriodFolding.getDefaultStorageObject().yAxisLabel;
    this.dataLabel = VariablePeriodFolding.getDefaultStorageObject().dataLabel;
  }

  public static getDefaultStorageObject(): VariablePeriodFoldingStorageObject {
    return {
      displayPeriod: VariableDisplayPeriod.TWO,
      period: -1,
      phase: 0,
      title: "Title",
      xAxisLabel: "x",
      yAxisLabel: "y",
      dataLabel: VariablePeriodFolding.defaultHash,
    }
  }

  getPeriodFoldingDataLabel(): string {
    return this.dataLabel;
  }

  getPeriodFoldingDisplayPeriod(): VariableDisplayPeriod {
    return this.displayPeriod;
  }

  getPeriodFoldingPeriod(): number {
    return this.period;
  }

  getPeriodFoldingPhase(): number {
    return this.phase;
  }

  getPeriodFoldingTitle(): string {
    return this.title;
  }

  getPeriodFoldingXAxisLabel(): string {
    return this.xAxisLabel;
  }

  getPeriodFoldingYAxisLabel(): string {
    return this.yAxisLabel;
  }

  setPeriodFoldingDataLabel(data: string): void {
    this.dataLabel = data;
  }

  setPeriodFoldingDisplayPeriod(displayPeriod: VariableDisplayPeriod): void {
    this.displayPeriod = displayPeriod;
  }

  setPeriodFoldingPeriod(period: number): void {
    this.period = period;
  }

  setPeriodFoldingPhase(phase: number): void {
    this.phase = phase;
  }

  setPeriodFoldingTitle(title: string): void {
    this.title = title;
  }

  setPeriodFoldingXAxisLabel(xAxis: string): void {
    this.xAxisLabel = xAxis;
  }

  setPeriodFoldingYAxisLabel(yAxis: string): void {
    this.yAxisLabel = yAxis;
  }

  getPeriodFoldingStorageObject(): VariablePeriodFoldingStorageObject {
    return {
      displayPeriod: this.displayPeriod,
      period: this.period,
      phase: this.phase,
      title: this.title,
      xAxisLabel: this.xAxisLabel,
      yAxisLabel: this.yAxisLabel,
      dataLabel: this.dataLabel,
    }
  }

  setPeriodFoldingStorageObject(storageObject: VariablePeriodFoldingStorageObject): void {
    this.displayPeriod = storageObject.displayPeriod;
    this.period = storageObject.period;
    this.phase = storageObject.phase;
    this.title = storageObject.title;
    this.xAxisLabel = storageObject.xAxisLabel;
    this.yAxisLabel = storageObject.yAxisLabel;
    this.dataLabel = storageObject.dataLabel;
  }

}


export class VariableStorage implements MyStorage {
  private dataKey: string = "variableData";
  private interfaceKey: string = "variableInterface";
  private chartInfoKey: string = "variableChartInfo";
  private periodogramKey: string = "variablePeriodogram";
  private tabIndexKey: string = "variableTabIndex";
  private periodFoldingKey: string = "variablePeriodFolding";

  getChartInfo(): VariableChartInfoStorageObject {
    if (localStorage.getItem(this.chartInfoKey)) {
      return JSON.parse(localStorage.getItem(this.chartInfoKey) as string);
    } else {
      return VariableChartInfo.getDefaultChartInfo();
    }
  }

  getData(): VariableDataDict[] {
    if (localStorage.getItem(this.dataKey)) {
      return JSON.parse(localStorage.getItem(this.dataKey) as string);
    } else {
      return VariableData.getDefaultDataDict();
    }
  }

  getInterface(): VariableInterfaceStorageObject {
    if (localStorage.getItem(this.interfaceKey)) {
      return JSON.parse(localStorage.getItem(this.interfaceKey) as string);
    } else {
      return VariableInterfaceImpl.getDefaultInterface();
    }
  }

  getPeriodogram(): VariablePeriodogramStorageObject {
    if (localStorage.getItem(this.periodogramKey)) {
      return JSON.parse(localStorage.getItem(this.periodogramKey) as string);
    } else {
      return VariablePeriodogram.getDefaultPeriodogram();
    }
  }

  getPeriodFolding(): VariablePeriodFoldingStorageObject {
    if (localStorage.getItem(this.periodFoldingKey)) {
      return JSON.parse(localStorage.getItem(this.periodFoldingKey) as string);
    } else {
      return VariablePeriodFolding.getDefaultStorageObject();
    }
  }

  getTabIndex(): number {
    if (localStorage.getItem(this.tabIndexKey)) {
      return JSON.parse(localStorage.getItem(this.tabIndexKey) as string);
    } else {
      return 0;
    }
  }

  resetChartInfo(): void {
    localStorage.setItem(this.chartInfoKey, JSON.stringify(VariableChartInfo.getDefaultChartInfo()));
  }

  resetData(): void {
    localStorage.setItem(this.dataKey, JSON.stringify(VariableData.getDefaultDataDict()));
  }

  resetInterface(): void {
    localStorage.setItem(this.interfaceKey, JSON.stringify(VariableInterfaceImpl.getDefaultInterface()));
  }

  resetPeriodogram(): void {
    localStorage.setItem(this.periodogramKey, JSON.stringify(VariablePeriodogram.getDefaultPeriodogram()));
  }

  saveChartInfo(chartInfo: VariableChartInfoStorageObject): void {
    localStorage.setItem(this.chartInfoKey, JSON.stringify(chartInfo));
  }

  saveData(data: VariableDataDict[]): void {
    localStorage.setItem(this.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: VariableInterfaceStorageObject): void {
    localStorage.setItem(this.interfaceKey, JSON.stringify(interfaceInfo));
  }

  savePeriodogram(periodogram: VariablePeriodogramStorageObject): void {
    localStorage.setItem(this.periodogramKey, JSON.stringify(periodogram));
  }

  savePeriodFolding(periodFolding: VariablePeriodFoldingStorageObject): void {
    localStorage.setItem(this.periodFoldingKey, JSON.stringify(periodFolding));
  }

  saveTabIndex(tabIndex: number): void {
    localStorage.setItem(this.tabIndexKey, JSON.stringify(tabIndex));
  }

}
