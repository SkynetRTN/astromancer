import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";

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
    const result: ScatterDataDict[] = [];
    for (let i = 0; i < 15; i++) {
      result.push({
        longitude: Math.random() * 40.0 - 20.0,
        latitude: Math.random() * 40.0 - 20.0,
        distance: Math.random() * 20.0
      });
    }
    return result;
  }

  addRow(index: number, amount: number): void {
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.dataDict.splice(index + i, 0, {longitude: null, latitude: null, distance: null});
      }
    } else {
      this.dataDict.push({longitude: null, latitude: null, distance: null});
    }
  }

  getData(): any[] {
    return this.dataDict;
  }

  /**
   * Transforms longitude, latitude and distance to x and y
   *  coordinates to be rendered in the chart
   */
  getDataArray(): (number | null)[][] {
    return this.dataDict.filter(
      (scatterDataDict: ScatterDataDict) => {
        return scatterDataDict.longitude !== null
          && scatterDataDict.latitude !== null
          && scatterDataDict.distance !== null;
      }
    ).map(
      (entry: ScatterDataDict) => {
        return [
          Math.cos(entry.latitude! / 180 * Math.PI) * entry.distance! * Math.cos(entry.longitude! / 180 * Math.PI),
          Math.cos(entry.latitude! / 180 * Math.PI) * entry.distance! * Math.sin(entry.longitude! / 180 * Math.PI),
        ];
      }
    );
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: ScatterDataDict[]): void {
    this.dataDict = data;
  }

}


export class ScatterStorage implements MyStorage {
  private static readonly dataKey: string = "scatterData";

  getChartInfo(): any {
  }

  getData(): ScatterDataDict[] {
    if (localStorage.getItem(ScatterStorage.dataKey)) {
      return JSON.parse(localStorage.getItem(ScatterStorage.dataKey) as string);
    } else {
      return ScatterData.getDefaultDataDict();
    }
  }

  getInterface(): any {
  }

  resetChartInfo(): void {
  }

  resetData(): void {
    localStorage.setItem(ScatterStorage.dataKey, JSON.stringify(ScatterData.getDefaultDataDict()));
  }

  resetInterface(): void {
  }

  saveChartInfo(chartInfo: any): void {
  }

  saveData(data: ScatterDataDict[]): void {
    localStorage.setItem(ScatterStorage.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: any): void {
  }

}
