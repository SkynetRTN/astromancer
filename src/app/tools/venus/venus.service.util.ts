import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";

export interface VenusDataDict {
  diameter: number | null;
  phase: number | null;
}


export class VenusData implements MyData {
  private dataDict: VenusDataDict[];

  constructor() {
    this.dataDict = VenusData.getDefaultData();
  }

  addRow(index: number, amount: number): void {
    if (index < 0) {
      this.dataDict.push({diameter: null, phase: null});
    } else {
      for (let i = 0; i < amount; i++) {
        this.dataDict.splice(index + i, 0, {diameter: null, phase: null});
      }
    }
  }

  getData(): VenusDataDict[] {
    return this.dataDict;
  }

  getDataArray(): (number|null)[][] {
    return this.dataDict.map(
      (entry: VenusDataDict) => {
      return [entry.diameter, entry.phase];
    });
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: VenusDataDict[]): void {
    this.dataDict = data;
  }

  public static getDefaultData(): VenusDataDict[] {
    return [
      {diameter: 15, phase: 0.7},
      {diameter: 30, phase: 0.53},
      {diameter: 45, phase: 0.27},
      {diameter: 60, phase: 0},
      {diameter: null, phase: null},
      {diameter: null, phase: null},
      {diameter: null, phase: null},
      {diameter: null, phase: null},
      {diameter: null, phase: null},
      {diameter: null, phase: null},
    ];
  }
}


export class VenusStorage implements MyStorage {
  private readonly dataKey: string = "venusData";
  getChartInfo(): any {
  }

  getData(): VenusDataDict[] {
    if (localStorage.getItem(this.dataKey)) {
      return JSON.parse(localStorage.getItem(this.dataKey) as string);
    } else {
      this.saveData(VenusData.getDefaultData());
      return VenusData.getDefaultData();
    }
  }

  getInterface(): any {
  }

  resetChartInfo(): void {
  }

  resetData(): void {
    this.saveData(VenusData.getDefaultData());
  }

  resetInterface(): void {
  }

  saveChartInfo(chartInfo: any): void {
  }

  saveData(data: VenusDataDict[]): void {
    localStorage.setItem(this.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: any): void {
  }

}

