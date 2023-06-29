import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";

export interface DualDataDict {
  x1: number | null;
  y1: number | null;
  x2: number | null;
  y2: number | null;
}

export class DualData implements MyData {
  private dataDict: DualDataDict[];

  constructor() {
    this.dataDict = DualData.getDefaultData();
  }

  public static getDefaultData(): DualDataDict[] {
    return [
      {x1: null, y1: null, x2: null, y2: null}
    ];
  }

  addRow(index: number, amount: number): void {
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.dataDict.splice(index + i, 0, {x1: null, y1: null, x2: null, y2: null});
      }
    } else {
      this.dataDict.push({x1: null, y1: null, x2: null, y2: null});
    }
  }

  getData(): DualDataDict[] {
    return this.dataDict;
  }

  getDataArray(): number[][][] {
    return [
      this.dataDict.filter((entry: DualDataDict) => {
        return entry.x1 !== null && entry.y1 !== null;
      }).map(
        (entry: DualDataDict) => {
          return [entry.x1, entry.y1];
        }) as number[][],
      this.dataDict.filter((entry: DualDataDict) => {
        return entry.x2 !== null && entry.y2 !== null;
      }).map(
        (entry: DualDataDict) => {
          return [entry.x2, entry.y2];
        }) as number[][]
    ]
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: DualDataDict[]): void {
    this.dataDict = data;
  }

}


export class DualStorage implements MyStorage {
  private dataKey: string = 'dualData';

  getChartInfo(): any {
  }

  getData(): DualDataDict[] {
    if (localStorage.getItem(this.dataKey)) {
      return JSON.parse(localStorage.getItem(this.dataKey) as string);
    } else {
      return DualData.getDefaultData();
    }
  }

  getInterface(): any {
  }

  resetChartInfo(): void {
  }

  resetData(): void {
    localStorage.setItem(this.dataKey, JSON.stringify(DualData.getDefaultData()));
  }

  resetInterface(): void {
  }

  saveChartInfo(chartInfo: any): void {
  }

  saveData(data: DualDataDict[]): void {
    localStorage.setItem(this.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: any): void {
  }

}
