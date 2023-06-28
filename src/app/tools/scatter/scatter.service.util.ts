import {MyData} from "../shared/data/data.interface";

export interface ScatterDataDict {
  longitude: number | null;
  latitude: number | null;
  distance: number | null;
}

export class ScatterData implements MyData {
  private dataDict: ScatterDataDict[];

  constructor() {
    this.dataDict = ScatterData.getDefaultDataDict();
  }

  public static getDefaultDataDict(): ScatterDataDict[] {
    return [
      {
        longitude: 1,
        latitude: 1,
        distance: 1,
      }
    ];
  }

  addRow(index: number, amount: number): void {
    if (index < 0) {
      this.dataDict.push({longitude: null, latitude: null, distance: null});
    } else {
      for (let i = 0; i < amount; i++) {
        this.dataDict.splice(index, 0, {longitude: null, latitude: null, distance: null});
      }
    }
  }

  getData(): any[] {
    return this.dataDict;
  }

  getDataArray(): any[] {
    return [];
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: ScatterDataDict[]): void {
    this.dataDict = data;
  }

}
