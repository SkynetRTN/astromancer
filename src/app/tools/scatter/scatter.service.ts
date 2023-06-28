import {Injectable} from '@angular/core';
import {ScatterData, ScatterDataDict} from "./scatter.service.util";
import {MyData} from "../shared/data/data.interface";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class ScatterService implements MyData {

  private ScatterData: MyData = new ScatterData();

  private dataSubject: BehaviorSubject<MyData> = new BehaviorSubject<MyData>(this.ScatterData);
  public data$ = this.dataSubject.asObservable();

  constructor() {
  }

  addRow(index: number, amount: number): void {
    this.ScatterData.addRow(index, amount);
    this.dataSubject.next(this.ScatterData);
  }

  getData(): ScatterDataDict[] {
    return this.ScatterData.getData();
  }

  getDataArray(): (number | null)[][] {
    return this.ScatterData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.ScatterData.removeRow(index, amount);
    this.dataSubject.next(this.ScatterData);
  }

  setData(data: ScatterDataDict[]): void {
    this.ScatterData.setData(data);
    this.dataSubject.next(this.ScatterData);
  }

}
