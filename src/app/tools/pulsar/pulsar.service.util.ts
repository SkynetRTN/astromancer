import { ChartInfo } from "../shared/charts/chart.interface";
import { MyData } from "../shared/data/data.interface";
import { MyStorage } from "../shared/storage/storage.interface";

// Enum and interface definitions
export interface PulsarDataDict {
  frequency: number | null;
  channel1: number | null;
  channel2: number | null;
}

export interface PulsarDataSeries {
  name: string;               // Name for the series, e.g., 'YY1' or 'XX1'
  data: PulsarDataDict[];     // Data points for the series
}


export interface PulsarChartInfoStorageObject {
  chartTitle: string;
  frequencyLabel: string;
  channel1Label: string;
}

export interface PulsarInterface {
  getbackScale(): number;

  setbackScale(magnitude: number): void;

  getIsLightCurveOptionValid(): boolean;
}

export interface PulsarInterfaceStorageObject {
  backScale: number;
}

export class PulsarInterfaceImpl implements PulsarInterface {
  private backScale: number = 3;
  private LightCurveOptionValid: boolean;

  constructor() {
    this.backScale = this.getbackScale();
    this.LightCurveOptionValid = true;
  }
/*
  public static getDefaultInterface(): PulsarInterfaceStorageObject {
    return {
      backScale: 2,
    };
  }
*/
  getStorageObject(): PulsarInterfaceStorageObject {
    return {
      backScale: this.backScale,
    };
  }

  setStorageObject(storageObject: PulsarInterfaceStorageObject): void {
    this.backScale = storageObject.backScale;
  }



  getbackScale(): number {
    return this.backScale;
  }

  setbackScale(magnitude: number): void {
    this.backScale = magnitude;
  }

  getIsLightCurveOptionValid(): boolean {
    return this.LightCurveOptionValid;
  }

  setLightCurveOptionValid(Valid: boolean): void {
    this.LightCurveOptionValid = Valid;
  }
}

// Class managing chart information
export class PulsarChartInfo implements ChartInfo {
  private chartTitle: string;
  private frequencyLabel: string;
  private channel1Label: string;

  constructor() {
    this.chartTitle = "Periodogram";
    this.frequencyLabel = "Frequency";
    this.channel1Label = "Intensity";
  }

  static getDefaultStorageObject(): PulsarChartInfoStorageObject {
    return {
      chartTitle: "Periodogram",
      frequencyLabel: "Frequency",
      channel1Label: "Intensity"
    };
  }

  getChartTitle(): string {
    return this.chartTitle;
  }

  setDataLabel(): any {

  }

  getXAxisLabel(): string {
    return this.frequencyLabel;
  }

  getYAxisLabel(): string {
    return this.channel1Label;
  }

  getDataLabel(): string {
    return this.frequencyLabel;
  }

  setChartTitle(title: string): void {
    this.chartTitle = title;
  }

  setXAxisLabel(label: string): void {
    this.frequencyLabel = label;
  }

  setYAxisLabel(label: string): void {
    this.channel1Label = label;
  }

  getStorageObject(): PulsarChartInfoStorageObject {
    return {
      chartTitle: this.chartTitle,
      frequencyLabel: this.frequencyLabel,
      channel1Label: this.channel1Label
    };
  }

  setStorageObject(storageObject: PulsarChartInfoStorageObject): void {
    this.chartTitle = storageObject.chartTitle;
    this.frequencyLabel = storageObject.frequencyLabel;
    this.channel1Label = storageObject.channel1Label;
  }
}


// Class for managing data
export class PulsarData implements MyData {
  private frequencyData: number[] = [];
  private channel1Data: number[] = [];
  private pulsarDataDict: PulsarDataDict[] = [];

  constructor() {
    this.setData(PulsarData.getDefaultDataAsArray());
  }

  // Convert default data to PulsarDataDict[]
  public static getDefaultDataAsArray(): PulsarDataDict[] {
    return [
      { frequency: 38, channel1: 2302, channel2: 1200 },
      { frequency: 159, channel1: 1601, channel2: 1241 },
      { frequency: 178, channel1: 1556, channel2: 6321 },
      { frequency: 1491.5, channel1: 908, channel2: 2123 },
      { frequency: 1400, channel1: 922, channel2: 7342 },
      { frequency: 5000, channel1: 668, channel2: 2353 }
    ];
  }
  public static getDefaultData(): { frequency: number[], channel1: number[] } {
    return {
      frequency: [100, 200, 300, 400, 500],
      channel1: [1.5, 2.0, 2.5, 3.0, 3.5]
    };
  }

  // Retrieve data as a PulsarDataDict[]
  public getData(): PulsarDataDict[] {
    return this.pulsarDataDict;
  }

  // Retrieve data as an array of [frequency, channel1] pairs
  public getDataArray(): number[][] {
    return this.pulsarDataDict.map(({ frequency, channel1 }) => [frequency, channel1] as [number, number]);
  }

  // Set data with type checking and persistence
  public setData(data: PulsarDataDict[]): void {
    this.pulsarDataDict = data;
    this.frequencyData = data.map(item => item.frequency!); // Assumes data validation has been handled elsewhere
    this.channel1Data = data.map(item => item.channel1!);
    PulsarStorage.saveData(this.pulsarDataDict); // Persist data on setting
  }

  public addRow(index: number, amount: number): void {
    for (let i = 0; i < amount; i++) {
      this.pulsarDataDict.splice(index + i, 0, { frequency: null, channel1: null, channel2: null});
    }
    PulsarStorage.saveData(this.pulsarDataDict); // Persist updates
  }

  public removeRow(index: number, amount: number): void {
    this.pulsarDataDict.splice(index, amount);
    PulsarStorage.saveData(this.pulsarDataDict); // Persist updates
  }
}

// Class for managing storage
export class PulsarStorage {
  private static readonly dataKey: string = "radio-search-data";
  private static readonly dataKeyParam: string = "radio-search-param-data";
  private static readonly chartInfoKey: string = "radio-search-chart-info";
  private static readonly defaultData: PulsarDataDict[] = PulsarData.getDefaultDataAsArray();
  private static readonly defaultChartInfo: PulsarChartInfoStorageObject = PulsarChartInfo.getDefaultStorageObject();
  private tabIndexKey: string = "pulsarTabIndex";

  static getChartInfo(): PulsarChartInfoStorageObject {
    const storedData = localStorage.getItem(this.chartInfoKey);
    return storedData ? JSON.parse(storedData) : this.defaultChartInfo;
  }

  static getData(): PulsarDataDict[] {
    const storedData = localStorage.getItem(this.dataKey);
    return storedData ? JSON.parse(storedData) : this.defaultData;
  }

  static saveChartInfo(chartInfoObject: PulsarChartInfoStorageObject): void {
    localStorage.setItem(this.chartInfoKey, JSON.stringify(chartInfoObject));
  }

  static saveData(data: PulsarDataDict[]): void {
    localStorage.setItem(this.dataKey, JSON.stringify(data));
  }

  static resetChartInfo(): void {
    this.saveChartInfo(this.defaultChartInfo);
  }

  static resetData(): void {
    this.saveData(this.defaultData);
  }

  getTabIndex(): number {
    if (localStorage.getItem(this.tabIndexKey)) {
      return JSON.parse(localStorage.getItem(this.tabIndexKey) as string);
    } else {
      return 0;
    }
  }
  saveTabIndex(tabIndex: number): void {
    localStorage.setItem(this.tabIndexKey, JSON.stringify(tabIndex));
  }
}
