import {Injectable} from '@angular/core';
import {ScatterData, ScatterDataDict, ScatterStorage} from "./scatter.service.util";
import {MyData} from "../shared/data/data.interface";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class ScatterService implements MyData {

  private scatterData: ScatterData = new ScatterData();

  private scatterStorage: ScatterStorage = new ScatterStorage();

  private dataSubject: BehaviorSubject<MyData> = new BehaviorSubject<MyData>(this.scatterData);
  public data$ = this.dataSubject.asObservable();

  constructor() {
    this.scatterData.setData(this.scatterStorage.getData());
  }

  addRow(index: number, amount: number): void {
    this.scatterData.addRow(index, amount);
    this.scatterStorage.saveData(this.scatterData.getData());
    this.dataSubject.next(this.scatterData);
  }

  getData(): ScatterDataDict[] {
    return this.scatterData.getData();
  }

  getDataArray(): (number | null)[][] {
    return this.scatterData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.scatterData.removeRow(index, amount);
    this.scatterStorage.saveData(this.scatterData.getData());
    this.dataSubject.next(this.scatterData);
  }

  setData(data: ScatterDataDict[]): void {
    this.scatterData.setData(data);
    this.scatterStorage.saveData(this.scatterData.getData());
    this.dataSubject.next(this.scatterData);
  }

  resetData(): void {
    this.scatterStorage.resetData();
    this.scatterData.setData(this.scatterStorage.getData());
    this.dataSubject.next(this.scatterData);
  }

}
