import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";

export interface MoonDataDict {
  julianDate: number | null;
  angularSeparation: number | null;
}

export class MoonData implements MyData {
  private moonDataDict!: MoonDataDict[];

  constructor() {
    this.setData(MoonData.getDefaultData());
  }

  public static getDefaultData(): MoonDataDict[] {
    return [
      {julianDate: 0.678068081541067, angularSeparation: 68.8317496406889},
      {julianDate: 3.88220266882816, angularSeparation: 60.8832019426422},
      {julianDate: 4.00257863614228, angularSeparation: 55.5114455497664},
      {julianDate: 6.04550228545733, angularSeparation: 76.919338562074},
      {julianDate: 9.88276841776618, angularSeparation: 60.8906879224334},
      {julianDate: 11.6014421002906, angularSeparation: 62.6268697230885},
      {julianDate: 13.4725797086606, angularSeparation: 32.800634704227},
      {julianDate: 15.0955821156675, angularSeparation: 75.8537444888792},
      {julianDate: 17.3118375861181, angularSeparation: 47.9843650393894},
      {julianDate: 19.3216532252681, angularSeparation: 40.9112797512196},
    ]
  }

  addRow(index: number, amount: number): void {
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.moonDataDict.splice(index + i, 0, {julianDate: null, angularSeparation: null});
      }
    } else {
      this.moonDataDict.push({julianDate: null, angularSeparation: null});
    }
  }

  getData(): MoonDataDict[] {
    return this.moonDataDict;
  }

  getDataArray(): any[] {
    let result = [];
    for (const entry of this.moonDataDict) {
      result.push([entry.julianDate, entry.angularSeparation]);
    }
    return result;
  }

  removeRow(index: number, amount: number): void {
    this.moonDataDict = this.moonDataDict.slice(0, index).concat(this.moonDataDict.slice(index + amount));
  }

  setData(data: MoonDataDict[]): void {
    this.moonDataDict = data;
  }

}


export class MoonStorage implements MyStorage {
  private readonly dataKey: string = 'moonData';

  getChartInfo(): any {
  }

  getData(): any[] {
    if (localStorage.getItem(this.dataKey)) {
      return JSON.parse(localStorage.getItem(this.dataKey) as string);
    } else {
      return MoonData.getDefaultData();
    }
  }

  getInterface(): any {
  }

  resetChartInfo(): void {
  }

  resetData(): void {
    localStorage.setItem(this.dataKey, JSON.stringify(MoonData.getDefaultData()));
  }

  resetInterface(): void {
  }

  saveChartInfo(chartInfo: any): void {
  }

  saveData(data: MoonDataDict[]): void {
    localStorage.setItem(this.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: any): void {
  }

}
