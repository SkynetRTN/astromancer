import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";

export interface VariableDataDict {
  jd: number | null;
  source1: number | null;
  source2: number | null;
  error1: number | null;
  error2: number | null;
}

export class VariableData implements MyData {
  private dataDict: VariableDataDict[];

  constructor() {
    this.dataDict = VariableData.getDefaultDataDict();
  }

  public static getDefaultDataDict(): VariableDataDict[] {
    const data: VariableDataDict[] = [];
    for (let i = 0; i < 14; i++) {
      data.push({
        jd: i * 10 + Math.random() * 10 - 5,
        source1: Math.random() * 20,
        source2: Math.random() * 20,
        error1: 1,
        error2: 1,
      });
    }
    return data;
  }

  addRow(index: number, amount: number): void {
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.dataDict.splice(index + i, 0,
          {jd: null, source1: null, source2: null, error1: null, error2: null});
      }
    } else {
      this.dataDict.push({jd: null, source1: null, source2: null, error1: null, error2: null});
    }
  }

  getData(): VariableDataDict[] {
    return this.dataDict;
  }

  getDataArray(): (number|null)[][] {
    return this.dataDict.map((entry: VariableDataDict) =>
      [entry.jd, entry.source1, entry.source2, entry.error1, entry.error2]);
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: VariableDataDict[]): void {
    this.dataDict = data;
  }
}


export class VariableStorage implements MyStorage {
  private dataKey: string = "variableData";
  getChartInfo(): any {
  }

  getData(): VariableDataDict[] {
    if (localStorage.getItem(this.dataKey)) {
      return JSON.parse(localStorage.getItem(this.dataKey) as string);
    } else {
      return VariableData.getDefaultDataDict();
    }
  }

  getInterface(): any {
  }

  resetChartInfo(): void {
  }

  resetData(): void {
    localStorage.setItem(this.dataKey, JSON.stringify(VariableData.getDefaultDataDict()));
  }

  resetInterface(): void {
  }

  saveChartInfo(chartInfo: any): void {
  }

  saveData(data: VariableDataDict[]): void {
    localStorage.setItem(this.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: any): void {
  }

}
