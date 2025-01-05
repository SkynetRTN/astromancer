import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import {dummyData} from "./default-data/chart-gravity-dummydata";

export interface GravityDataDict {
  Time: number | null;
  Strain: number | null;
  Model: number | null;
}

export class GravityData implements MyData {
  private dataDict: GravityDataDict[];

  constructor() {
    this.dataDict = GravityData.getDefaultData();
  }


  public static getDefaultData(): GravityDataDict[] {
    return dummyData;
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

  getData(): GravityDataDict[] {
    return this.dataDict;
  }

  getDataArray(): number[][][] {
    return [
      this.dataDict.filter(
        (GravityDataDict: GravityDataDict) => {
          return GravityDataDict.Time !== null
            && GravityDataDict.Model !== null;
        }
      ).map((entry: GravityDataDict) => [entry.Time, entry.Model]) as number[][],
      this.dataDict.filter(
        (gravityDataDict: GravityDataDict) => {
          return gravityDataDict.Time !== null
            && gravityDataDict.Strain !== null;
        }
      ).map((entry: GravityDataDict) => [entry.Time, entry.Strain]) as number[][],
    ]
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: GravityDataDict[]): void {
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

export interface GravityChartInfoStorageObject {
  title: string;
  xAxis: string;
  yAxis: string;
  data: string;
}

export class GravityChartInfo implements ChartInfo {
  private chartTitle: string;
  private xAxisLabel: string;
  private yAxisLabel: string;
  private dataLabel: string;

  constructor() {
    this.chartTitle = GravityChartInfo.getDefaultChartInfo().title;
    this.xAxisLabel = GravityChartInfo.getDefaultChartInfo().xAxis;
    this.yAxisLabel = GravityChartInfo.getDefaultChartInfo().yAxis;
    this.dataLabel = GravityChartInfo.getDefaultChartInfo().data;
  }

  public static getDefaultChartInfo(): GravityChartInfoStorageObject {
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

  getStorageObject(): GravityChartInfoStorageObject {
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

  setStorageObject(storageObject: GravityChartInfoStorageObject): void {
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


export class GravityStorage implements MyStorage {
  private static readonly dataKey: string = 'gravityData';
  private static readonly interfaceKey: string = 'gravityInterface';
  private static readonly chartInfoKey: string = 'gravityChartInfo';

  getChartInfo(): GravityChartInfoStorageObject {
    if (localStorage.getItem(GravityStorage.chartInfoKey)) {
      return JSON.parse(localStorage.getItem(GravityStorage.chartInfoKey)!) as GravityChartInfoStorageObject;
    } else {
      return GravityChartInfo.getDefaultChartInfo();
    }
  }

  getData(): GravityDataDict[] {
    if (localStorage.getItem(GravityStorage.dataKey)) {
      return JSON.parse(localStorage.getItem(GravityStorage.dataKey)!) as GravityDataDict[];
    } else {
      return GravityData.getDefaultData();
    }
  }

  getInterface(): GravityInterfaceStorageObject {
    if (localStorage.getItem(GravityStorage.interfaceKey)) {
      return JSON.parse(localStorage.getItem(GravityStorage.interfaceKey) as string);
    } else {
      return new GravityInterfaceImpl().getDefaultStorageObject();
    }
  }

  resetChartInfo(): void {
    localStorage.setItem(GravityStorage.chartInfoKey, JSON.stringify(GravityChartInfo.getDefaultChartInfo()));
  }

  resetData(): void {
    localStorage.setItem(GravityStorage.dataKey, JSON.stringify(GravityData.getDefaultData()));
  }

  resetInterface(): void {
    localStorage.setItem(GravityStorage.interfaceKey, JSON.stringify(new GravityInterfaceImpl().getDefaultStorageObject()));
  }

  saveChartInfo(chartInfo: GravityChartInfoStorageObject): void {
    localStorage.setItem(GravityStorage.chartInfoKey, JSON.stringify(chartInfo));
  }

  saveData(data: GravityDataDict[]): void {
    localStorage.setItem(GravityStorage.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: GravityInterfaceStorageObject): void {
    localStorage.setItem(GravityStorage.interfaceKey, JSON.stringify(interfaceInfo));
  }

}
