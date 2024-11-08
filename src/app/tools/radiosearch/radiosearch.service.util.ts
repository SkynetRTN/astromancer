import { ChartInfo } from "../shared/charts/chart.interface";
import { MyData } from "../shared/data/data.interface";
import { MyStorage } from "../shared/storage/storage.interface";

// Enum and interface definitions
export enum RadioSearchParam {
  FREQUENCY = 'frequency',
  FLUX = 'flux'
}

export interface RadioSearchDataDict {
  frequency: number | null;
  flux: number | null;
  flux_fit: number | null;
  highlight?: boolean;
}

export interface RadioSearchChartInfoStorageObject {
  chartTitle: string;
  frequencyLabel: string;
  fluxLabel: string;
}

// Class managing chart information
export class RadioSearchChartInfo implements ChartInfo {
  private chartTitle: string;
  private frequencyLabel: string;
  private fluxLabel: string;

  constructor() {
    this.chartTitle = "Radio Search Results";
    this.frequencyLabel = "Frequency";
    this.fluxLabel = "Flux";
  }

  static getDefaultStorageObject(): RadioSearchChartInfoStorageObject {
    return {
      chartTitle: "Radio Search Results",
      frequencyLabel: "Frequency",
      fluxLabel: "Flux"
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
    return this.fluxLabel;
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
    this.fluxLabel = label;
  }

  getStorageObject(): RadioSearchChartInfoStorageObject {
    return {
      chartTitle: this.chartTitle,
      frequencyLabel: this.frequencyLabel,
      fluxLabel: this.fluxLabel
    };
  }

  setStorageObject(storageObject: RadioSearchChartInfoStorageObject): void {
    this.chartTitle = storageObject.chartTitle;
    this.frequencyLabel = storageObject.frequencyLabel;
    this.fluxLabel = storageObject.fluxLabel;
  }
}

// Class for managing data
export class RadioSearchData implements MyData {
  private frequencyData: number[] = [];
  private fluxData: number[] = [];
  private radioSearchDataDict: RadioSearchDataDict[] = [];

  constructor() {
    this.setData(RadioSearchData.getDefaultDataAsArray());
  }

  // Convert default data to RadioSearchDataDict[]
  public static getDefaultDataAsArray(): RadioSearchDataDict[] {
    return [
      { frequency: 100, flux: 1.5, flux_fit: 1.5 },
      { frequency: 200, flux: 2.0, flux_fit: 2.0 },
      { frequency: 300, flux: 2.5, flux_fit: 2.5 },
      { frequency: 400, flux: 3.0, flux_fit: 3.0 },
      { frequency: 500, flux: 3.5, flux_fit: 3.5 }
    ];
  }

  public static getDefaultData(): { frequency: number[], flux: number[] } {
    return {
      frequency: [100, 200, 300, 400, 500],
      flux: [1.5, 2.0, 2.5, 3.0, 3.5]
    };
  }

  // Retrieve data as a RadioSearchDataDict[]
  public getData(): RadioSearchDataDict[] {
    return this.radioSearchDataDict;
  }

  // Retrieve data as an array of [frequency, flux] pairs
  public getDataArray(): number[][] {
    return this.radioSearchDataDict.map(({ frequency, flux, flux_fit }) => [frequency, flux, flux_fit] as [number, number, number]);
  }

  // Set data with type checking and persistence
  public setData(data: RadioSearchDataDict[]): void {
    this.radioSearchDataDict = data;
    this.frequencyData = data.map(item => item.frequency!); // Assumes data validation has been handled elsewhere
    this.fluxData = data.map(item => item.flux!);
    RadioSearchStorage.saveData(this.radioSearchDataDict); // Persist data on setting
  }

  public addRow(index: number, amount: number): void {
    for (let i = 0; i < amount; i++) {
      this.radioSearchDataDict.splice(index + i, 0, { frequency: null, flux: null, flux_fit: null });
    }
    RadioSearchStorage.saveData(this.radioSearchDataDict); // Persist updates
  }

  public removeRow(index: number, amount: number): void {
    this.radioSearchDataDict.splice(index, amount);
    RadioSearchStorage.saveData(this.radioSearchDataDict); // Persist updates
  }
}

// Class for managing storage
export class RadioSearchStorage {
  private static readonly dataKey: string = "radio-search-data";
  private static readonly chartInfoKey: string = "radio-search-chart-info";
  private static readonly defaultData: RadioSearchDataDict[] = RadioSearchData.getDefaultDataAsArray();
  private static readonly defaultChartInfo: RadioSearchChartInfoStorageObject = RadioSearchChartInfo.getDefaultStorageObject();

  static getChartInfo(): RadioSearchChartInfoStorageObject {
    const storedData = localStorage.getItem(this.chartInfoKey);
    return storedData ? JSON.parse(storedData) : this.defaultChartInfo;
  }

  static getData(): RadioSearchDataDict[] {
    const storedData = localStorage.getItem(this.dataKey);
    return storedData ? JSON.parse(storedData) : this.defaultData;
  }

  static saveChartInfo(chartInfoObject: RadioSearchChartInfoStorageObject): void {
    localStorage.setItem(this.chartInfoKey, JSON.stringify(chartInfoObject));
  }

  static saveData(data: RadioSearchDataDict[]): void {
    localStorage.setItem(this.dataKey, JSON.stringify(data));
  }

  static resetChartInfo(): void {
    this.saveChartInfo(this.defaultChartInfo);
  }

  static resetData(): void {
    this.saveData(this.defaultData);
  }
}
