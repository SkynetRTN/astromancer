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
      {x1:0, y1:25, x2: 1, y2:10},
      {x1:1, y1:16, x2: 2, y2:14.1421356237309},
      {x1:2, y1:9, x2: 3, y2:17.3205080756887},
      {x1:3, y1:4, x2: 4, y2:20},
      {x1:4, y1:1, x2: 5, y2:22.3606797749978},
      {x1:5, y1:4, x2: 6, y2:24.4948974278317},
      {x1:6, y1:9, x2: 7, y2:26.4575131106459},
      {x1:7, y1:16, x2: 8, y2:28.2842712474619},
      {x1:8, y1:25, x2: 9, y2:30},
      {x1:9, y1:36, x2: 10, y2:31.6227766016837},
      {x1:null, y1:null, x2: 11, y2:33.166247903554},
      {x1:null, y1:null, x2: 12, y2:34.6410161513775},
      {x1:null, y1:null, x2: 13, y2:36.0555127546398},
      {x1:null, y1:null, x2: 14, y2:37.4165738677394},
      {x1:null, y1:null, x2: 15, y2:38.7298334620741},
      {x1:null, y1:null, x2: 16, y2:40},
      {x1:null, y1:null, x2: 17, y2:41.2310562561766},
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
