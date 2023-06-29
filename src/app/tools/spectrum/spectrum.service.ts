import { Injectable } from '@angular/core';
import {SpectrumData, SpectrumDataDict, SpectrumStorage} from "./spectrum.service.util";
import {BehaviorSubject} from "rxjs";
import {MyData} from "../shared/data/data.interface";

@Injectable()
export class SpectrumService implements MyData{
  private spectrumData: SpectrumData = new SpectrumData();

  private spectrumStorage: SpectrumStorage = new SpectrumStorage();

  private dataSubject: BehaviorSubject<SpectrumData> = new BehaviorSubject<SpectrumData>(this.spectrumData);
  public data$ = this.dataSubject.asObservable();

  constructor() {
    this.spectrumData.setData(this.spectrumStorage.getData());
  }


  /** MyData Methods**/


  addRow(index: number, amount: number): void {
    this.spectrumData.addRow(index, amount);
    this.spectrumStorage.saveData(this.spectrumData.getData());
    this.dataSubject.next(this.spectrumData);
  }

  getData(): SpectrumDataDict[] {
    return this.spectrumData.getData();
  }

  getDataArray(): number[][][] {
    return this.spectrumData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.spectrumData.removeRow(index, amount);
    this.spectrumStorage.saveData(this.spectrumData.getData());
    this.dataSubject.next(this.spectrumData);
  }

  setData(data: SpectrumDataDict[]): void {
    this.spectrumData.setData(data);
    this.spectrumStorage.saveData(this.spectrumData.getData());
    this.dataSubject.next(this.spectrumData);
  }

  resetData(): void {
    this.spectrumData.setData(SpectrumData.getDefaultData());
    this.spectrumStorage.saveData(this.spectrumData.getData());
    this.dataSubject.next(this.spectrumData);
  }
}
