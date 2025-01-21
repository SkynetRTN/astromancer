import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import {dummyStrainData} from "./default-data/chart-gravity-dummydata";

export enum GravityChart
{
  SPECTO = "Specto",
  STRAIN = "Strain"
}

export interface StrainDataDict {
  Time: number | null;
  Strain: number | null;
  Model: number | null;
}
export interface SpectogramDataDict {
  x: number | null;
  y: number | null;
  value: number | null;
}

export class SpectoData implements MyData {
  private dataDict: SpectogramDataDict[];

  constructor() {
    this.dataDict = [];
  }

  public static getDefaultData(): SpectogramDataDict[] {
    return [];
  }

  addRow(index: number, amount: number): void {
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.dataDict.splice(index + i, 0, {x: null, y: null, value: null});
      }
    } else {
      this.dataDict.push({x: null, y: null, value: null});
    }
  }

  getData(): SpectogramDataDict[] {
    return this.dataDict;
  }
  
  getDataArray(): number[][] {
    let data: number[][] = [[]]
    this.dataDict.forEach((value) => {
      if(value.x == null || value.y == null ) return;
      data.push([value.x, value.y, value.value? value.value : 0 ])
    })
    return data; 
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: SpectogramDataDict[]): void {
    this.dataDict = data;
  }

}

export class StrainData implements MyData {
  private dataDict: StrainDataDict[];

  constructor() {
    this.dataDict = StrainData.getDefaultData();
  }


  public static getDefaultData(): StrainDataDict[] {
    return dummyStrainData;
  }

  addRow(index: number, amount: number): void {
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.dataDict.splice(index + i, 0, {Time: null, Strain: null, Model: null},);
      }
    } else {
      this.dataDict.push({Time: null, Strain: null, Model: null},);
    }
  }

  getData(): StrainDataDict[] {
    return this.dataDict;
  }

  getDataArray(): number[][][] {
    return [
      this.dataDict.filter(
        (GravityDataDict: StrainDataDict) => {
          return GravityDataDict.Time !== null
            && GravityDataDict.Model !== null;
        }
      ).map((entry: StrainDataDict) => [entry.Time, entry.Model]) as number[][],
      this.dataDict.filter(
        (gravityDataDict: StrainDataDict) => {
          return gravityDataDict.Time !== null
            && gravityDataDict.Strain !== null;
        }
      ).map((entry: StrainDataDict) => [entry.Time, entry.Strain]) as number[][],
    ]
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: StrainDataDict[]): void {
    this.dataDict = data;
  }

}

export interface GravityInterface {
  getMergerTime(): number;

  getTotalMass(): number;

  getMassRatio(): number;

  getPhaseShift(): number;

  getDistance(): number;

  getInclination(): number;

  setMergerTime(mergerTime: number): void;

  setTotalMass(totalMass: number): void;

  setMassRatio(massRatio: number): void;

  setPhaseShift(phaseShift: number): void;

  setDistance(distance: number): void;

  setInclination(inclination: number): void;

  resetInterface(): void;
}

export interface GravityInterfaceStorageObject {
  mergerTime: number;
  totalMass: number;
  massRatio: number;
  phaseShift: number;
  distance: number;
  inclination: number;
}


export class GravityInterfaceImpl implements GravityInterface {

  private mergerTime!: number;
  private totalMass!: number;
  private massRatio!: number;
  private phaseShift!: number;
  private distance!: number;
  private inclination!: number;

  getMergerTime(): number{
    return this.mergerTime
  }

  getTotalMass(): number{
    return this.totalMass
  }

  getMassRatio(): number{
    return this.massRatio
  }

  getPhaseShift(): number{
    return this.phaseShift
  }

  getDistance(): number{
    return this.distance
  }

  getInclination(): number{
    return this.inclination
  }

  resetInterface(): void {
    this.setStorageObject(this.getDefaultStorageObject());
  }

  setMergerTime(mergerTime: number): void{
    this.mergerTime = mergerTime
  }

  setTotalMass(totalMass: number): void{
    this.totalMass = totalMass
  }

  setMassRatio(massRatio: number): void{
    this.massRatio = massRatio
  }

  setPhaseShift(phaseShift: number): void{
    this.phaseShift = phaseShift
  }

  setDistance(distance: number): void{
    this.distance = distance
  }

  setInclination(inclination: number): void{
    this.inclination = inclination
  }

  getStorageObject(): GravityInterfaceStorageObject {
    return {
      mergerTime: this.mergerTime,
      totalMass: this.totalMass,
      massRatio: this.massRatio,
      phaseShift: this.phaseShift,
      distance: this.distance,
      inclination: this.inclination
    };
  }

  setStorageObject(storageObject: GravityInterfaceStorageObject): void {
    this.setMergerTime(storageObject.mergerTime);
    this.setTotalMass(storageObject.totalMass);
    this.setMassRatio(storageObject.massRatio);
    this.setPhaseShift(storageObject.phaseShift);
    this.setDistance(storageObject.distance);
    this.setInclination(storageObject.inclination);
  }

  getDefaultStorageObject(): GravityInterfaceStorageObject {
    return {
      mergerTime: 16,
      totalMass: 25,
      massRatio: 1,
      phaseShift: 0,
      distance: 300,
      inclination: 0
    };
  }
}

export interface StrainChartInfoStorageObject {
  title: string;
  xAxis: string;
  yAxis: string;
  data: string;
}

export class StrainChartInfo implements ChartInfo {
  private chartTitle: string;
  private xAxisLabel: string;
  private yAxisLabel: string;
  private dataLabel: string;

  constructor() {
    this.chartTitle = StrainChartInfo.getDefaultChartInfo().title;
    this.xAxisLabel = StrainChartInfo.getDefaultChartInfo().xAxis;
    this.yAxisLabel = StrainChartInfo.getDefaultChartInfo().yAxis;
    this.dataLabel = StrainChartInfo.getDefaultChartInfo().data;
  }

  public static getDefaultChartInfo(): StrainChartInfoStorageObject {
    return {
      title: "Title",
      xAxis: "",
      yAxis: "",
      data: "Model",
    }
  }

  getChartTitle(): string {
    return this.chartTitle;
  }

  getDataLabel(): string {
    return this.dataLabel;
  }

  getStorageObject(): StrainChartInfoStorageObject {
    return {
      title: this.chartTitle,
      xAxis: this.xAxisLabel,
      yAxis: this.yAxisLabel,
      data: this.dataLabel,
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

  setStorageObject(storageObject: StrainChartInfoStorageObject): void {
    this.chartTitle = storageObject.title;
    this.xAxisLabel = storageObject.xAxis;
    this.yAxisLabel = storageObject.yAxis;
    this.dataLabel = storageObject.data;
  }

  setXAxisLabel(xAxis: string): void {
    this.xAxisLabel = xAxis;
  }

  setYAxisLabel(yAxis: string): void {
    this.yAxisLabel = yAxis;
  }

}

export class SpectoChartInfo extends StrainChartInfo {

  constructor() {
    super()
  }
}

export class StrainStorage implements MyStorage {
  private static readonly dataKey: string = 'strainData';
  private static readonly interfaceKey: string = 'strainInterface';
  private static readonly chartInfoKey: string = 'strainChartInfo';

  getChartInfo(): StrainChartInfoStorageObject {
    if (localStorage.getItem(StrainStorage.chartInfoKey)) {
      return JSON.parse(localStorage.getItem(StrainStorage.chartInfoKey)!) as StrainChartInfoStorageObject;
    } else {
      return StrainChartInfo.getDefaultChartInfo();
    }
  }

  getData(): StrainDataDict[] {
    if (localStorage.getItem(StrainStorage.dataKey)) {
      return JSON.parse(localStorage.getItem(StrainStorage.dataKey)!) as StrainDataDict[];
    } else {
      return StrainData.getDefaultData();
    }
  }

  getInterface(): GravityInterfaceStorageObject {
    if (localStorage.getItem(StrainStorage.interfaceKey)) {
      return JSON.parse(localStorage.getItem(StrainStorage.interfaceKey) as string);
    } else {
      return new GravityInterfaceImpl().getDefaultStorageObject();
    }
  }

  resetChartInfo(): void {
    localStorage.setItem(StrainStorage.chartInfoKey, JSON.stringify(StrainChartInfo.getDefaultChartInfo()));
  }

  resetData(): void {
    localStorage.setItem(StrainStorage.dataKey, JSON.stringify(StrainData.getDefaultData()));
  }

  resetInterface(): void {
    localStorage.setItem(StrainStorage.interfaceKey, JSON.stringify(new GravityInterfaceImpl().getDefaultStorageObject()));
  }

  saveChartInfo(chartInfo: StrainChartInfoStorageObject): void {
    localStorage.setItem(StrainStorage.chartInfoKey, JSON.stringify(chartInfo));
  }

  saveData(data: StrainDataDict[]): void {
    // localStorage.setItem(GravityStorage.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: GravityInterfaceStorageObject): void {
    localStorage.setItem(StrainStorage.interfaceKey, JSON.stringify(interfaceInfo));
  }

}
