import {MyData} from "../shared/data/data.interface";
import {MyStorage} from "../shared/storage/storage.interface";

export interface SpectrumDataDict {
  wavelength: number | null;
  channel1: number | null;
  channel2: number | null;
}

export class SpectrumData implements MyData {
  private dataDict: SpectrumDataDict[];

  constructor() {
    this.dataDict = SpectrumData.getDefaultData();
  }

  /**
   * Generate random data as the demo dataset
   */
  public static getDefaultData(): SpectrumDataDict[] {
    const result: SpectrumDataDict[] = [];
    for (let i = 0; i < 200; i++) {
      let wl = i / 200 * 0.03 + 21.09;
      result.push({
        wavelength: wl,
        channel1: 100 - Math.pow(100 * (wl - 21.105), 2) / 0.015 + Math.random() * 21,
        channel2: 100 - Math.pow(100 * (wl - 21.105), 2) / 0.015 + Math.random() * 21,
      });
    }
    return result;
  }

  addRow(index: number, amount: number): void {
    if (index > 0) {
      for (let i = 0; i < amount; i++) {
        this.dataDict.splice(index + i, 0, {wavelength: null, channel1: null, channel2: null},);
      }
    } else {
      this.dataDict.push({wavelength: null, channel1: null, channel2: null},);
    }
  }

  getData(): SpectrumDataDict[] {
    return this.dataDict;
  }

  getDataArray(): number[][][] {
    return [
      this.dataDict.filter(
        (spectrumDataDict: SpectrumDataDict) => {
          return spectrumDataDict.wavelength !== null
            && spectrumDataDict.channel1 !== null;
        }
      ).map((entry: SpectrumDataDict) => [entry.wavelength, entry.channel1]) as number[][],
      this.dataDict.filter(
        (spectrumDataDict: SpectrumDataDict) => {
          return spectrumDataDict.wavelength !== null
            && spectrumDataDict.channel2 !== null;
        }
      ).map((entry: SpectrumDataDict) => [entry.wavelength, entry.channel2]) as number[][],
    ]
  }

  removeRow(index: number, amount: number): void {
    this.dataDict = this.dataDict.slice(0, index).concat(this.dataDict.slice(index + amount));
  }

  setData(data: SpectrumDataDict[]): void {
    this.dataDict = data;
  }

}


export class SpectrumStorage implements MyStorage {
  private static readonly dataKey: string = 'spectrumData';

  getChartInfo(): any {
  }

  getData(): SpectrumDataDict[] {
    if (localStorage.getItem(SpectrumStorage.dataKey)) {
      return JSON.parse(localStorage.getItem(SpectrumStorage.dataKey)!) as SpectrumDataDict[];
    } else {
      return SpectrumData.getDefaultData();
    }
  }

  getInterface(): any {
  }

  resetChartInfo(): void {
  }

  resetData(): void {
    localStorage.setItem(SpectrumStorage.dataKey, JSON.stringify(SpectrumData.getDefaultData()));
  }

  resetInterface(): void {
  }

  saveChartInfo(chartInfo: any): void {
  }

  saveData(data: SpectrumDataDict[]): void {
    localStorage.setItem(SpectrumStorage.dataKey, JSON.stringify(data));
  }

  saveInterface(interfaceInfo: any): void {
  }

}
