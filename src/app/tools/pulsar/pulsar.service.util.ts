import { ChartInfo } from "../shared/charts/chart.interface";
import { MyData } from "../shared/data/data.interface";
import { MyStorage } from "../shared/storage/storage.interface";

// Enum and interface definitions
export interface PulsarDataDict {
  frequency: number | null;
  intensity: number | null;
}

export interface PulsarChartInfoStorageObject {
  chartTitle: string;
  frequencyLabel: string;
  intensityLabel: string;
}

// Class managing chart information
export class PulsarChartInfo implements ChartInfo {
  private chartTitle: string;
  private frequencyLabel: string;
  private intensityLabel: string;

  constructor() {
    this.chartTitle = "Periodogram";
    this.frequencyLabel = "Frequency";
    this.intensityLabel = "Intensity";
  }

  static getDefaultStorageObject(): PulsarChartInfoStorageObject {
    return {
      chartTitle: "Periodogram",
      frequencyLabel: "Frequency",
      intensityLabel: "Intensity"
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
    return this.intensityLabel;
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
    this.intensityLabel = label;
  }

  getStorageObject(): PulsarChartInfoStorageObject {
    return {
      chartTitle: this.chartTitle,
      frequencyLabel: this.frequencyLabel,
      intensityLabel: this.intensityLabel
    };
  }

  setStorageObject(storageObject: PulsarChartInfoStorageObject): void {
    this.chartTitle = storageObject.chartTitle;
    this.frequencyLabel = storageObject.frequencyLabel;
    this.intensityLabel = storageObject.intensityLabel;
  }
}

// Class for managing data
export class PulsarData implements MyData {
  private frequencyData: number[] = [];
  private intensityData: number[] = [];
  private pulsarDataDict: PulsarDataDict[] = [];

  constructor() {
    this.setData(PulsarData.getDefaultDataAsArray());
  }

  // Convert default data to PulsarDataDict[]
  public static getDefaultDataAsArray(): PulsarDataDict[] {
    return [
      { frequency: 38, intensity: 2302 },
      { frequency: 159, intensity: 1601 },
      { frequency: 178, intensity: 1556 },
      { frequency: 1491.5, intensity: 908 },
      { frequency: 1400, intensity: 922 },
      { frequency: 5000, intensity: 668 }
    ];
  }

  public static getDefaultData(): { frequency: number[], intensity: number[] } {
    return {
      frequency: [100, 200, 300, 400, 500],
      intensity: [1.5, 2.0, 2.5, 3.0, 3.5]
    };
  }

  // Retrieve data as a PulsarDataDict[]
  public getData(): PulsarDataDict[] {
    return this.pulsarDataDict;
  }

  // Retrieve data as an array of [frequency, intensity] pairs
  public getDataArray(): number[][] {
    return this.pulsarDataDict.map(({ frequency, intensity }) => [frequency, intensity] as [number, number]);
  }

  // Set data with type checking and persistence
  public setData(data: PulsarDataDict[]): void {
    this.pulsarDataDict = data;
    this.frequencyData = data.map(item => item.frequency!); // Assumes data validation has been handled elsewhere
    this.intensityData = data.map(item => item.intensity!);
    PulsarStorage.saveData(this.pulsarDataDict); // Persist data on setting
  }

  public addRow(index: number, amount: number): void {
    for (let i = 0; i < amount; i++) {
      this.pulsarDataDict.splice(index + i, 0, { frequency: null, intensity: null});
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
