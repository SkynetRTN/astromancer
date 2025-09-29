import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import { NumberValueAccessor } from "@angular/forms";

export interface PulsarDataDict {
  jd: number | null;
  source1: number | null;
  source2: number | null;
}

export function errorMSE(error1: number | null, error2: number | null): number | null {
  if (error1 == null || error2 == null) {
    return null;
  } else {
    return Math.sqrt(error1 ** 2 + error2 ** 2) / 2;
  }
}


export interface PulsarChartInfoStorageObject {
  chartTitle: string;
  frequencyLabel: string;
  channel1Label: string;
}
/*
export interface PulsarInterface {
  getbackScale(): number;

  setbackScale(magnitude: number): void;

  getIsLightCurveOptionValid(): boolean;
}
  */

export interface PulsarInterfaceStorageObject {
  backScale: number;
  LightCurveOptionValid: boolean;
}

// Class managing chart information


export enum PulsarStarOptions {
  NONE = "None",
  SOURCE1 = "Source 1",
  SOURCE2 = "Source 2",
}

export interface PulsarInterface {
  getPulsarStar(): PulsarStarOptions;

  setPulsarStar(pulsarStar: PulsarStarOptions): void;

  getbackScale(): number;

  setbackScale(magnitude: number): void;

  getIsLightCurveOptionValid(): boolean;
}


export interface PulsarInterfaceStorageObject {
  pulsarStar: PulsarStarOptions;
  backScale: number;
}


export class PulsarInterfaceImpl implements PulsarInterface {
  private pulsarStar: PulsarStarOptions;
  private backScale: number;
  private LightCurveOptionValid: boolean;

  constructor() {
    this.pulsarStar = PulsarInterfaceImpl.getDefaultInterface().pulsarStar;
    this.backScale = PulsarInterfaceImpl.getDefaultInterface().backScale;
    this.LightCurveOptionValid = true;
  }

  public static getDefaultInterface(): PulsarInterfaceStorageObject {
    return {
      pulsarStar: PulsarStarOptions.NONE,
      backScale: 3,
      LightCurveOptionValid: true,
    };
  }

  getStorageObject(): PulsarInterfaceStorageObject {
    return {
      pulsarStar: this.pulsarStar,
      backScale: this.backScale,
      LightCurveOptionValid: this.LightCurveOptionValid,
    };
  }

  setStorageObject(storageObject: PulsarInterfaceStorageObject): void {
    this.pulsarStar = storageObject.pulsarStar;
    this.backScale = storageObject.backScale;
    this.LightCurveOptionValid = storageObject.LightCurveOptionValid;
  }

  getPulsarStar(): PulsarStarOptions {
    return this.pulsarStar;
  }

  setPulsarStar(pulsarStar: PulsarStarOptions): void {
    this.pulsarStar = pulsarStar;
  }

  getbackScale(): number {
    return this.backScale;
  }

  setbackScale(backScale: number): void {
    this.backScale = backScale;
  }

  getIsLightCurveOptionValid(): boolean {
    return !this.LightCurveOptionValid;
  }

  setLightCurveOptionValid(Valid: boolean): void {
    this.LightCurveOptionValid = Valid;
  }
}


export interface PulsarChartInfoStorageObject {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  dataLabels: string[];
  dataLabel: string;
}

export class PulsarChartInfo implements ChartInfo {
  public static readonly defaultHash: string = "XQGeSlw7M6";
  private title: string;
  private xAxisLabel: string;
  private yAxisLabel: string;
  private dataLabels: string[];
  private dataLabel: string;

  constructor() {
    this.title = PulsarChartInfo.getDefaultChartInfo().title;
    this.xAxisLabel = PulsarChartInfo.getDefaultChartInfo().xAxisLabel;
    this.yAxisLabel = PulsarChartInfo.getDefaultChartInfo().yAxisLabel;
    this.dataLabels = PulsarChartInfo.getDefaultChartInfo().dataLabels;
    this.dataLabel = PulsarChartInfo.getDefaultChartInfo().dataLabel;
  }

  public static getDefaultChartInfo(): PulsarChartInfoStorageObject {
    return {
      chartTitle: "Title",
      frequencyLabel: "Frequency",
      channel1Label: "Polarization XX",
      title: "Title",
      xAxisLabel: "Time (s)",
      yAxisLabel: "Intensity",
      dataLabels: ["Polarization XX", "Polarization YY"],
      dataLabel: "Polarization YY",
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

  getStorageObject(): PulsarChartInfoStorageObject {
    return {
      chartTitle: this.title,
      frequencyLabel: this.xAxisLabel,
      channel1Label: this.yAxisLabel,
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

  setDataLabelArray(data: string[]): void{
    this.dataLabels = data;
  }

  setStorageObject(storageObject: PulsarChartInfoStorageObject): void {
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


// Class for managing data
export class PulsarData implements MyData {
  private frequencyData: number[] = [];
  private channel1Data: number[] = [];
  private pulsarDataDict: PulsarDataDict[] = [];
  private pulsarCombinedDataDict: PulsarDataDict[] = [];
  private pulsarRawDataDict: PulsarDataDict[] = [];
  private pulsarTableType: string = 'raw';
  private chartComputedPeriodogramDataArray: [Array<Number>, Array<Number>] = [[0],[0]];

  getData(): PulsarDataDict[] {
    return this.pulsarDataDict;
  }

  getCombinedData(): PulsarDataDict[] {
    return this.pulsarCombinedDataDict;
  }

  getRawData(): PulsarDataDict[] {
    return this.pulsarRawDataDict;
  }

  getChartComputedPeriodogramDataArray(): [Array<Number>, Array<Number>] {
    return this.chartComputedPeriodogramDataArray;
  }
  
  getTableType(): string {
    return this.pulsarTableType;
  }

  getDataArray(): any[] {
    return [this.frequencyData, this.channel1Data];
  }

  setData(data: PulsarDataDict[]): void {
    this.pulsarDataDict = data;
    this.frequencyData = data.map(d => d.source1 ?? 0);
    this.channel1Data = data.map(d => d.source2 ?? 0);
  }

  setCombinedData(data: PulsarDataDict[]): void {
    this.pulsarCombinedDataDict = data;
  }

  setRawData(data: PulsarDataDict[]): void {
    this.pulsarRawDataDict = data;
  }

  setChartComputedPeriodogramDataArray(data: [Array<Number>, Array<Number>]): void {
    this.chartComputedPeriodogramDataArray = data;
  }

  setTableType(type: string): void {
    this.pulsarTableType = type;
  }

  addRow(index: number, amount: number): void {
    const newRow: PulsarDataDict = { jd: null, source1: null, source2: null };
    this.pulsarDataDict.splice(index, 0, newRow);
    this.frequencyData.splice(index, 0, 0);
    this.channel1Data.splice(index, 0, 0);
  }

  removeRow(index: number, amount: number): void {
    this.pulsarDataDict.splice(index, amount);
    this.frequencyData.splice(index, amount);
    this.channel1Data.splice(index, amount);
  }

  filterData(predicate: (data: PulsarDataDict) => boolean): PulsarDataDict[] {
    return this.pulsarDataDict.filter(predicate);
  }

  map<T>(callback: (data: PulsarDataDict) => T): T[] {
    return this.pulsarDataDict.map(callback);
  }

  public static getDefaultDataDict(): PulsarDataDict[] {
    const data: PulsarDataDict[] = [];
    for (let i = 0; i < 100; i++) {
      const randomData = (): number => parseFloat((Math.random() * 10000).toFixed(2));
      data.push({
        jd: i,
        source1: randomData(),
        source2: randomData(),
      });
    }
    return data;
  }
}

export interface PulsarPeriodogramStorageObject {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  dataLabel: string;
  points: number;
  method: boolean;
  startPeriodLabel: string;
  endPeriodLabel: string;
  startPeriod: number;
  endPeriod: number;
}


export interface PulsarPeriodogramInterface {
  getPeriodogramTitle(): string;

  getPeriodogramXAxisLabel(): string;

  getPeriodogramYAxisLabel(): string;

  getPeriodogramDataLabel(): string;

  getPeriodogramPoints(): number;

  getPeriodogramMethod(): boolean;

  getPeriodogramStartPeriod(): number;

  getPeriodogramEndPeriod(): number;

  getPeriodogramStorageObject(): PulsarPeriodogramStorageObject;

  setPeriodogramTitle(title: string): void;

  setPeriodogramXAxisLabel(xAxis: string): void;

  setPeriodogramYAxisLabel(yAxis: string): void;

  setPeriodogramDataLabel(data: string): void;

  setPeriodogramPoints(points: number): void;

  setPeriodogramMethod(method: boolean): void;

  setPeriodogramStartPeriod(startPeriod: number): void;

  setPeriodogramEndPeriod(endPeriod: number): void;

  setPeriodogramStorageObject(storageObject: PulsarPeriodogramStorageObject): void;
}


export class PulsarPeriodogram implements PulsarPeriodogramInterface {
  public static readonly defaultHash: string = "XQGeSlw7M6";
  private title: string;
  private xAxisLabel: string;
  private yAxisLabel: string;
  private dataLabel: string;
  private points: number;
  private method: boolean;
  private startPeriodLabel: string;
  private endPeriodLabel: string;
  private startPeriod: number;
  private endPeriod: number;


  constructor() {
    this.title = PulsarPeriodogram.getDefaultPeriodogram().title;
    this.xAxisLabel = PulsarPeriodogram.getDefaultPeriodogram().xAxisLabel;
    this.yAxisLabel = PulsarPeriodogram.getDefaultPeriodogram().yAxisLabel;
    this.dataLabel = PulsarPeriodogram.getDefaultPeriodogram().dataLabel;
    this.points = PulsarPeriodogram.getDefaultPeriodogram().points;
    this.method = PulsarPeriodogram.getDefaultPeriodogram().method;
    this.startPeriodLabel = PulsarPeriodogram.getDefaultPeriodogram().startPeriodLabel;
    this.endPeriodLabel = PulsarPeriodogram.getDefaultPeriodogram().endPeriodLabel;
    this.startPeriod = PulsarPeriodogram.getDefaultPeriodogram().startPeriod;
    this.endPeriod = PulsarPeriodogram.getDefaultPeriodogram().endPeriod;
  }

  public static getDefaultPeriodogram(): PulsarPeriodogramStorageObject {
    return {
      title: "Title",
      xAxisLabel: "Period (s)",
      yAxisLabel: "Intensity",
      dataLabel: PulsarPeriodogram.defaultHash,
      points: 1000,
      method: false,
      startPeriodLabel: "Start Period (s)",
      endPeriodLabel: "End Period (s)",
      startPeriod: 0.1,
      endPeriod: 2,
    }
  }

  getPeriodogramDataLabel(): string {
    return this.dataLabel;
  }

  getPeriodogramPoints(): number {
    return this.points;
  }

  getPeriodogramMethod(): boolean {
    return this.method;
  } 

  getPeriodogramStartPeriodLabel(): string {
    return this.startPeriodLabel;
  }

  getPeriodogramEndPeriodLabel(): string {
    return this.endPeriodLabel;
  }

  getPeriodogramStartPeriod(): number {
    return this.startPeriod;
  }

  getPeriodogramEndPeriod(): number {
    return this.endPeriod;
  }

  getPeriodogramStorageObject(): PulsarPeriodogramStorageObject {
    return {
      title: this.title,
      xAxisLabel: this.xAxisLabel,
      yAxisLabel: this.yAxisLabel,
      dataLabel: this.dataLabel,
      points: this.points,
      method: this.method,
      startPeriodLabel: this.startPeriodLabel,
      endPeriodLabel: this.endPeriodLabel,
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

  setPeriodogramPoints(points: number): void {
    this.points = points;
  } 
  
  setPeriodogramMethod(method: boolean): void {
    this.method = method;
  } 

  setPeriodogramStartPeriodLabel(startPeriodLabel: string): void {
    this.startPeriodLabel = startPeriodLabel;
  }

  setPeriodogramEndPeriodLabel(endPeriodLabel: string): void {
    this.endPeriodLabel = endPeriodLabel;
  }

  setPeriodogramEndPeriod(endPeriod: number): void {
    this.endPeriod = endPeriod;
  }

  setPeriodogramStartPeriod(startPeriod: number): void {
    this.startPeriod = startPeriod;
  }

  setPeriodogramStorageObject(storageObject: PulsarPeriodogramStorageObject): void {
    this.title = storageObject.title;
    this.xAxisLabel = storageObject.xAxisLabel;
    this.yAxisLabel = storageObject.yAxisLabel;
    this.points = storageObject.points;
    this.method = storageObject.method;
    this.dataLabel = storageObject.dataLabel;
    this.startPeriod = storageObject.startPeriod;
    this.endPeriod = storageObject.endPeriod;
    this.startPeriodLabel = storageObject.startPeriodLabel;
    this.endPeriodLabel = storageObject.endPeriodLabel;
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


export enum PulsarDisplayPeriod {
  ONE = '1',
  TWO = '2',
}


export interface PulsarPeriodFoldingStorageObject {
  displayPeriod: PulsarDisplayPeriod;
  period: number;
  periodMin: number;
  periodMax: number;
  phase: number;
  cal: number;
  speed: number;
  bins: number;
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  dataLabel: string;
}


export interface PulsarPeriodFoldingInterface {
  getPeriodFoldingDisplayPeriod(): PulsarDisplayPeriod;

  getPeriodFoldingPeriod(): number;

  getPeriodFoldingPhase(): number;

  getPeriodFoldingCal(): number;

  getPeriodFoldingTitle(): string;

  getPeriodFoldingXAxisLabel(): string;

  getPeriodFoldingYAxisLabel(): string;

  getPeriodFoldingDataLabel(): string;

  setPeriodFoldingDisplayPeriod(displayPeriod: PulsarDisplayPeriod): void;

  setPeriodFoldingPeriod(period: number): void;

  setPeriodFoldingPeriodMin(periodMin: number): void;

  setPeriodFoldingPeriodMax(periodMax: number): void;

  setPeriodFoldingPhase(phase: number): void;

  setPeriodFoldingTitle(title: string): void;

  setPeriodFoldingXAxisLabel(xAxis: string): void;

  setPeriodFoldingYAxisLabel(yAxis: string): void;

  setPeriodFoldingDataLabel(data: string): void;
}


export class PulsarPeriodFolding implements PulsarPeriodFoldingInterface {
  public static readonly defaultHash: string = "XQGeSlw7M6";
  private displayPeriod: PulsarDisplayPeriod;
  private period: number;
  private periodMin: number;
  private periodMax: number;
  private phase: number;
  private cal: number;
  private speed: number;
  private bins: number;
  private title: string;
  private xAxisLabel: string;
  private yAxisLabel: string;
  private dataLabel: string;

  constructor() {
    this.displayPeriod = PulsarPeriodFolding.getDefaultStorageObject().displayPeriod;
    this.period = PulsarPeriodFolding.getDefaultStorageObject().period;
    this.periodMin = PulsarPeriodFolding.getDefaultStorageObject().periodMin;
    this.periodMax = PulsarPeriodFolding.getDefaultStorageObject().periodMax;
    this.phase = PulsarPeriodFolding.getDefaultStorageObject().phase;
    this.cal = PulsarPeriodFolding.getDefaultStorageObject().cal;
    this.speed = PulsarPeriodFolding.getDefaultStorageObject().speed;
    this.bins = PulsarPeriodFolding.getDefaultStorageObject().bins;
    this.title = PulsarPeriodFolding.getDefaultStorageObject().title;
    this.xAxisLabel = PulsarPeriodFolding.getDefaultStorageObject().xAxisLabel;
    this.yAxisLabel = PulsarPeriodFolding.getDefaultStorageObject().yAxisLabel;
    this.dataLabel = PulsarPeriodFolding.getDefaultStorageObject().dataLabel;
  }

  public static getDefaultStorageObject(): PulsarPeriodFoldingStorageObject {
    return {
      displayPeriod: PulsarDisplayPeriod.ONE,
      period: 0.2,
      periodMin: 0.1,
      periodMax: 2,
      phase: 0,
      cal: 1.0,
      speed: 1.0,
      bins: 100,
      title: "Title",
      xAxisLabel: "Time (s)",
      yAxisLabel: "Intensity",
      dataLabel: PulsarPeriodFolding.defaultHash,
    }
  }

  getPeriodFoldingDataLabel(): string {
    return this.dataLabel;
  }

  getPeriodFoldingDisplayPeriod(): PulsarDisplayPeriod {
    return this.displayPeriod;
  }

  getPeriodFoldingPeriod(): number {
    return this.period;
  }

  getPeriodFoldingPeriodMin(): number {
    return this.periodMin;
  }

  getPeriodFoldingPeriodMax(): number {
    return this.periodMax;
  }

  getPeriodFoldingPhase(): number {
    return this.phase;
  }

  getPeriodFoldingCal(): number {
    return this.cal;
  }

  getPeriodFoldingSpeed(): number {
    return this.speed;
  }

  getPeriodFoldingBins(): number {
    return this.bins;
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

  setPeriodFoldingDisplayPeriod(displayPeriod: PulsarDisplayPeriod): void {
    this.displayPeriod = displayPeriod;
  }

  setPeriodFoldingPeriod(period: number): void {
    this.period = period;
  }

  setPeriodFoldingPeriodMin(period: number): void {
    this.periodMin = period;
  }

  setPeriodFoldingPeriodMax(period: number): void {
    this.periodMax = period;
  }

  setPeriodFoldingPhase(phase: number): void {
    this.phase = phase;
  }

  setPeriodFoldingCal(cal: number): void {
    this.cal = cal;
  }

  setPeriodFoldingSpeed(speed: number): void {
    this.speed = speed;
  }

  setPeriodFoldingBins(bins: number): void {
    this.bins = bins;
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

  getPeriodFoldingStorageObject(): PulsarPeriodFoldingStorageObject {
    return {
      displayPeriod: this.displayPeriod,
      period: this.period,
      periodMin: this.periodMin,
      periodMax: this.periodMax,
      phase: this.phase,
      cal: this.cal,
      speed: this.speed,
      bins: this.bins,
      title: this.title,
      xAxisLabel: this.xAxisLabel,
      yAxisLabel: this.yAxisLabel,
      dataLabel: this.dataLabel,
    }
  }

  setPeriodFoldingStorageObject(storageObject: PulsarPeriodFoldingStorageObject): void {
    this.displayPeriod = storageObject.displayPeriod;
    this.period = storageObject.period;
    this.periodMin = storageObject.periodMin;
    this.periodMax = storageObject.periodMax;
    this.phase = storageObject.phase;
    this.cal = storageObject.cal;
    this.speed = storageObject.speed;
    this.bins = storageObject.bins;
    this.title = storageObject.title;
    this.xAxisLabel = storageObject.xAxisLabel;
    this.yAxisLabel = storageObject.yAxisLabel;
    this.dataLabel = storageObject.dataLabel;
  }
}


export class PulsarStorage implements MyStorage {
  private dataKey: string = "pulsarData";
  private rawDataKey: string = "pulsarRawData"
  private combinedDataKey: string = "pulsarCombinedData";
  private computedPeriodogramDataArrayKey: string = "computedPeriodogramDataArrayKey";
  private tableTypeKey: string = "pulsarTableType";
  private interfaceKey: string = "pulsarInterface";
  private chartInfoKey: string = "pulsarChartInfo";
  private periodogramKey: string = "pulsarPeriodogram";
  private tabIndexKey: string = "pulsarTabIndex";
  private periodFoldingKey: string = "pulsarPeriodFolding";

  getChartInfo(): PulsarChartInfoStorageObject {
    if (localStorage.getItem(this.chartInfoKey)) {
      return JSON.parse(localStorage.getItem(this.chartInfoKey) as string);
    } else {
      return PulsarChartInfo.getDefaultChartInfo();
    }
  }

  getData(): PulsarDataDict[] {
      if (localStorage.getItem(this.dataKey)) {
        return JSON.parse(localStorage.getItem(this.dataKey) as string);
      } else {
        return PulsarData.getDefaultDataDict();
      }
  }

  getRawData(): PulsarDataDict[] {
      if (localStorage.getItem(this.rawDataKey)) {
        return JSON.parse(localStorage.getItem(this.rawDataKey) as string);
      } else {
        return PulsarData.getDefaultDataDict();
      }
  }

  getCombinedData(): PulsarDataDict[] {
      if (localStorage.getItem(this.combinedDataKey)) {
        return JSON.parse(localStorage.getItem(this.combinedDataKey) as string);
      } else {
        return PulsarData.getDefaultDataDict();
      }
  }

  getChartComputedPeriodogramDataArray(): [Array<Number>, Array<Number>] {
      if (localStorage.getItem(this.computedPeriodogramDataArrayKey)) {
        return JSON.parse(localStorage.getItem(this.computedPeriodogramDataArrayKey) as string);
      } else {
        return [[0], [0]];
      }
  }

  getInterface(): PulsarInterfaceStorageObject {
    if (localStorage.getItem(this.interfaceKey)) {
      return JSON.parse(localStorage.getItem(this.interfaceKey) as string);
    } else {
      return PulsarInterfaceImpl.getDefaultInterface();
    }
  }

  getPeriodogram(): PulsarPeriodogramStorageObject {
    if (localStorage.getItem(this.periodogramKey)) {
      return JSON.parse(localStorage.getItem(this.periodogramKey) as string);
    } else {
      return PulsarPeriodogram.getDefaultPeriodogram();
    }
  }

  getPeriodFolding(): PulsarPeriodFoldingStorageObject {
    if (localStorage.getItem(this.periodFoldingKey)) {
      return JSON.parse(localStorage.getItem(this.periodFoldingKey) as string);
    } else {
      return PulsarPeriodFolding.getDefaultStorageObject();
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
    localStorage.setItem(this.chartInfoKey, JSON.stringify(PulsarChartInfo.getDefaultChartInfo()));
  }

  resetData(): void {
    localStorage.setItem(this.dataKey, JSON.stringify(PulsarData.getDefaultDataDict()));
  }

  resetInterface(): void {
    localStorage.setItem(this.interfaceKey, JSON.stringify(PulsarInterfaceImpl.getDefaultInterface()));
  }

  resetPeriodogram(): void {
    localStorage.setItem(this.periodogramKey, JSON.stringify(PulsarPeriodogram.getDefaultPeriodogram()));
  }

  saveChartInfo(chartInfo: PulsarChartInfoStorageObject): void {
    localStorage.setItem(this.chartInfoKey, JSON.stringify(chartInfo));
  }

  saveData(data: PulsarDataDict[]): void {
    localStorage.setItem(this.dataKey, JSON.stringify(data));
  }

  saveRawData(data: PulsarDataDict[]): void {
    localStorage.setItem(this.rawDataKey, JSON.stringify(data));
  }

  saveChartComputedPeriodogramDataArray(data: [Array<Number>, Array<Number>]): void {
    localStorage.setItem(this.computedPeriodogramDataArrayKey, JSON.stringify(data));
  }

  saveTableType(data: string): void {
    localStorage.setItem(this.tableTypeKey, JSON.stringify(data));
  }


  saveCombinedData(data: PulsarDataDict[]): void {
    localStorage.setItem(this.combinedDataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: PulsarInterfaceStorageObject): void {
    localStorage.setItem(this.interfaceKey, JSON.stringify(interfaceInfo));
  }

  savePeriodogram(periodogram: PulsarPeriodogramStorageObject): void {
    localStorage.setItem(this.periodogramKey, JSON.stringify(periodogram));
  }

  savePeriodFolding(periodFolding: PulsarPeriodFoldingStorageObject): void {
    localStorage.setItem(this.periodFoldingKey, JSON.stringify(periodFolding));
  }

  saveTabIndex(tabIndex: number): void {
    localStorage.setItem(this.tabIndexKey, JSON.stringify(tabIndex));
  }

}