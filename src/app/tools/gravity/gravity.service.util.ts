import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import {dummyStrainData} from "./constants/chart-gravity-dummydata";
import { ratioMassLogSpace, totalMassLogSpace, phaseList, totalMassLogSpaceStrain } from "./constants/model-grid";

export interface ServerDataRequest {
  job_id?: number
  total_mass_strain?: number
  total_mass_freq?: number
  mass_ratio?: number
  phase?: number
}

export interface StrainDataDict {
  Time: number | null;
  Strain: number | null;
}
export interface SpectogramDataDict {
  x: number | null;
  y: number | null;
  value: number | null;
}
export interface ModelDataDict {
  Time: number | null
  Frequency: number | null
}

export interface range {
  min: number,
  max: number,
}

//For the spectogram
/**
 * @remarks Represents heatmap data for the spectogram
 * @implements {MyData}
 */
export class SpectoData implements MyData {
  private dataArr: number[][];
  private axes: SpectoAxes;
  
  constructor() {
    this.dataArr = [];
    this.axes = {};
  }

  public static getDefaultData(): number[][] {
    return [];
  }

  addRow(index: number, amount: number): void {
    // if (index > 0) {
    //   for (let i = 0; i < amount; i++) {
    //     this.dataDict.splice(index + i, 0, {x: null, y: null, value: null});
    //   }
    // } else {
    //   this.dataDict.push({x: null, y: null, value: null});
    // }
  }

  getData(): SpectogramDataDict[] {
    let data: SpectogramDataDict[] = []
    this.dataArr.forEach((value) => {
      if(value[0] == null || value[0] == null ) return;
      data.push({"x": value[0], 'y':value[1], 'value':value[2]})
    })
    return data; 
  }

  getAxes(): SpectoAxes {
    return this.axes
  }
  
  getDataArray(): number[][] {
    return this.dataArr
  }

  removeRow(index: number, amount: number): void {
    this.dataArr = this.dataArr.slice(0, index).concat(this.dataArr.slice(index + amount));
  }

  setData(data: number[][]): void {
    this.dataArr = data;
  }

  setAxes(axes: SpectoAxes): void {
    this.axes = axes
  }
}

export interface SpectoAxes
{
  zmin?: number
  zmax?: number
  ymin?: number
  ymax?: number
  xmin?: number
  xmax?: number
  dx?: number
}

/**
 * @remarks Represents the frequency curve ploted over the spectogram
 * @implements {MyData}
 */
export class ModelData implements MyData{
  private dataArr: number[][];

  constructor() {
    this.dataArr = [];
  }

  public static getDefaultData(): ModelDataDict[] {
    return [];
  }

  //never use this anyways
  addRow(index: number, amount: number): void {

  }

  getData(): ModelDataDict[] {
    let dataDict: ModelDataDict[] = []
    this.dataArr.forEach((value) => {
      if(value[0] == null || value[1]== null ) return;
      dataDict.push({"Time": +value[0], "Frequency": +value[1]})
    })
    return dataDict; 
  }
  
  getDataArray(): number[][] {
    return this.dataArr
  }

  removeRow(index: number, amount: number): void {
    this.dataArr = this.dataArr.slice(0, index).concat(this.dataArr.slice(index + amount));
  }

  setData(data: number[][]): void {
    this.dataArr = data;
  }
}

/**
 * @remarks Represents a strain waveform
 * @implements {MyData}
 */
export class StrainData implements MyData {
  private dataArr: number[][];
  private axes: SpectoAxes;

  constructor() {
    this.dataArr = [];
    this.axes = {};
  }

  public static getDefaultData():  number[][] 
  {
    return [];
  }

  addRow(index: number, amount: number): void {
    // if (index > 0) {
    //   for (let i = 0; i < amount; i++) {
    //     this.dataDict.splice(index + i, 0, {Time: null, Strain: null},);
    //   }
    // } else {
    //   this.dataDict.push({Time: null, Strain: null},);
    // }
  }

  getData(): StrainDataDict[] {
    return this.dataArr.filter(
      (value) => {
        return value[0] !== null;
      }
    ).map( (entry) => { return {"Time": entry[0], "Strain": entry[1]} as StrainDataDict  })
  }

  getDataArray(): number[][] {
    return this.dataArr
  }

  getAxes(): SpectoAxes {
    return this.axes
  }

  removeRow(index: number, amount: number): void {
    this.dataArr = this.dataArr.slice(0, index).concat(this.dataArr.slice(index + amount));
  }

  setData(data: number[][]): void {
    this.dataArr = data;
  }

  setAxes(axes: SpectoAxes): void {
    this.axes = axes
  }

}

export interface GravityInterface {
  getMergerTime(): number;

  getMergerRange(): range;

  getTotalMass(): number;

  getMassRatio(): number;

  getPhaseShift(): number;

  getDistance(): number;

  getInclination(): number;

  setMergerTime(mergerTime: number): void;

  setMergerRange(range: range): void;

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

  private mergerRange: range = {'min':10, 'max':20};
  private mergerTime: number = 16;
  private totalMass: number = 50;
  private massRatio: number = 1;
  private phaseShift: number = 0;
  private distance: number = 300;
  private inclination: number = 0;

  getMergerTime(): number{
    return this.mergerTime
  }

  getMergerRange(): range {
    return this.mergerRange
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

  setMergerRange(range: range): void {
    this.mergerRange = range;
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
      xAxis: "Time",
      yAxis: "Strain",
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

  //TODO: Store the job instead of the data
  getData(): number[][] {
    if (localStorage.getItem(StrainStorage.dataKey)) {
      return JSON.parse(localStorage.getItem(StrainStorage.dataKey)!) as number[][];
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

  saveData(data: number[][]): void {
    // localStorage.setItem(GravityStorage.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: GravityInterfaceStorageObject): void {
    localStorage.setItem(StrainStorage.interfaceKey, JSON.stringify(interfaceInfo));
  }

}

/**
 * @remarks Models are generated for specific input values. This function finds the values of the closest extant model for the provided values.
 * @param totalMass Total mass of the two objects
 * @param massRatio Ratio of mass between the objects
 * @param phase  Angle of the plane of the merger against out view? I'm still not sure.
 * @returns Valid values in a generic object for a server request
 */
export function fitValuesToGrid(totalMass: number, massRatio: number, phase: number):  { [key: string]: number } {

  // Fitting the sliders to each logspace

  let roundedMassRatio = approx(massRatio, ratioMassLogSpace)
  let roundedTotalMassStrain = approx(totalMass, totalMassLogSpaceStrain)
  let roundedTotalMassFreq = approx(totalMass, totalMassLogSpace)
  let roundedPhase     = approx(phase, phaseList)

  return {'total_mass_strain': roundedTotalMassStrain, 'total_mass_freq': roundedTotalMassFreq, 'mass_ratio': roundedMassRatio, 'phase': roundedPhase}

  // returns the element of array closest to value (if array is presorted, which it is)
  function approx(value: number, array: number[]): number
  {
    // Case: value is greater than every element. Result: if-statement never runs, roundedValue is left as the greatest element.
    let roundedValue = array[array.length-1]

    for (let i = 0; i < array.length - 1; i++) {
      let low = array[i], high = array[i+1]
      if(high > value)
      {
        // Case: value is below the first element in array. Result: if-statement runs on first loop, high>low, so low (the first element in array) is returned.
        roundedValue = (value-low < value-high)?low:high
        break
      }
    }

    return roundedValue
  }
}

export function calculateMassLoss(totalMass: number, massRatio: number){

  let mass_diff: number = +(((0.053073) - (0.016603 * Math.log(massRatio))) * totalMass)

  if (mass_diff < 0){
    mass_diff = 0
  }

  return mass_diff
}