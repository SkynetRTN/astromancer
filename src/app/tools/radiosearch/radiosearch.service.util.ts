import { ChartInfo } from "../shared/charts/chart.interface";
import { MyData } from "../shared/data/data.interface";
import { MyStorage } from "../shared/storage/storage.interface";

// Enum and interface definitions
export interface RadioSearchDataDict {
  frequency: number | null;
  flux: number | null;
  flux_fit: number | null;
  highlight?: boolean;
}

export interface FittingResult {
  slope: number;
  intercept: number;
}

export interface Source {
  name: string;  // Name of the source
  ra: number;    // Right Ascension (in degrees)
  dec: number;   // Declination (in degrees)
}

/**
 * One object as returned by POST /radiosearch/radio-catalog/query.
 *
 * This mirrors the backend wire format exactly - the single-letter keys
 * L/S/C/X are the 1400/2695/5000/8400 MHz survey bands. Do not rename them.
 * Every flux field is optional; the component maps absent ones to 'Unknown'.
 */
export interface RadioCatalogObject {
  SIMBAD?: string;
  id: number;
  ra: number;
  dec: number;
  galLat: number;
  galLong: number;
  catalog: string;
  identifier: string;
  MHz38?: number;
  MHz159?: number;
  MHz178?: number;
  MHz750?: number;
  L?: number;
  S?: number;
  C?: number;
  X?: number;
}

export interface RadioCatalogResponse {
  objects: RadioCatalogObject[];
}

/** A catalogue source's sky position, as used for the canvas overlay. */
export interface CatalogSource {
  name: string;
  id: number;
  ra: number;
  dec: number;
  galLat: number;
  galLong: number;
  catalog: string;
  identifier: string;
}

/**
 * The eight survey fluxes for one source. `'Unknown'` is the sentinel the
 * component substitutes for a missing band, preserved from the original.
 */
export interface SourceFluxes {
  name: string;
  id: number | 'Unknown';
  MHz38: number | 'Unknown';
  MHz159: number | 'Unknown';
  MHz178: number | 'Unknown';
  MHz750: number | 'Unknown';
  L1400: number | 'Unknown';
  S2695: number | 'Unknown';
  C5000: number | 'Unknown';
  X8400: number | 'Unknown';
}

export interface RadioSearchParamDataDict {
  targetFreq: number | null;
  catalog: string | null;
  identifier: string | null;
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
  private radioSearchDataDict: RadioSearchDataDict[] = [];
  private radioSearchParamDataDict: RadioSearchParamDataDict[] = [];

  constructor() {
    this.setData(RadioSearchData.getDefaultDataAsArray());
    this.setParamData(RadioSearchData.getDefaultParamDataAsArray());
  }

  // Convert default data to RadioSearchDataDict[]
  public static getDefaultDataAsArray(): RadioSearchDataDict[] {
    return [
      { frequency: null, flux: null, flux_fit: null },
    ];
  }

  public static getDefaultParamDataAsArray(): RadioSearchParamDataDict[] {
    return [
      { targetFreq: null, catalog: null, identifier: null}
    ];
  }

  // Retrieve data as a RadioSearchDataDict[]
  public getData(): RadioSearchDataDict[] {
    return this.radioSearchDataDict;
  }

  public getParamData(): RadioSearchParamDataDict[] {
    return this.radioSearchParamDataDict;
  }

  // Retrieve data as an array of [frequency, flux, flux_fit] triples
  public getDataArray(): number[][] {
    return this.radioSearchDataDict.map(({ frequency, flux, flux_fit }) => [frequency, flux, flux_fit] as [number, number, number]);
  }

  public getParamDataArray(): [number, string, string][] {
    return this.radioSearchParamDataDict.map(({ targetFreq, catalog, identifier }) => [targetFreq, catalog, identifier] as [number, string, string]);
  }

  // Mutate in-memory state only. Persistence is the service's job — the util
  // constructor used to call setData(default) which immediately wrote defaults
  // to localStorage, wiping any persisted chart-info / scatter / param data
  // every time the service was instantiated (i.e. every navigation to the tool).
  public setData(data: RadioSearchDataDict[]): void {
    this.radioSearchDataDict = data;
  }

  public setParamData(data: RadioSearchParamDataDict[]): void {
    this.radioSearchParamDataDict = data;
  }

  public addRow(index: number, amount: number): void {
    for (let i = 0; i < amount; i++) {
      this.radioSearchDataDict.splice(index + i, 0, { frequency: null, flux: null, flux_fit: null });
    }
  }

  public removeRow(index: number, amount: number): void {
    this.radioSearchDataDict.splice(index, amount);
  }
}

// Class for managing storage
export class RadioSearchStorage {
  private static readonly dataKey: string = "radio-search-data";
  private static readonly dataKeyParam: string = "radio-search-param-data";
  private static readonly chartInfoKey: string = "radio-search-chart-info";
  private static readonly defaultData: RadioSearchDataDict[] = RadioSearchData.getDefaultDataAsArray();
  private static readonly defaultParamData: RadioSearchParamDataDict[] = RadioSearchData.getDefaultParamDataAsArray();
  private static readonly defaultChartInfo: RadioSearchChartInfoStorageObject = RadioSearchChartInfo.getDefaultStorageObject();

  static getChartInfo(): RadioSearchChartInfoStorageObject {
    const storedData = localStorage.getItem(this.chartInfoKey);
    return storedData ? JSON.parse(storedData) : this.defaultChartInfo;
  }

  static getData(): RadioSearchDataDict[] {
    const storedData = localStorage.getItem(this.dataKey);
    return storedData ? JSON.parse(storedData) : this.defaultData;
  }

  static getParamData(): RadioSearchParamDataDict[] {
    const storedData = localStorage.getItem(this.dataKeyParam);
    return storedData ? JSON.parse(storedData) : this.defaultParamData;
  }

  static saveChartInfo(chartInfoObject: RadioSearchChartInfoStorageObject): void {
    localStorage.setItem(this.chartInfoKey, JSON.stringify(chartInfoObject));
  }

  static saveData(data: RadioSearchDataDict[]): void {
    localStorage.setItem(this.dataKey, JSON.stringify(data));
  }

  static saveParamData(data: RadioSearchParamDataDict[]): void {
    localStorage.setItem(this.dataKeyParam, JSON.stringify(data));
  }

  static resetChartInfo(): void {
    this.saveChartInfo(this.defaultChartInfo);
  }

  static resetData(): void {
    this.saveData(this.defaultData);
  }
}
