import {Injectable} from '@angular/core';
import {DualData, DualDataDict, DualStorage} from "./dual.service.util";
import {BehaviorSubject, Observable} from "rxjs";
import {MyData} from "../shared/data/data.interface";

@Injectable()
export class DualService implements MyData{

  private dualData: DualData = new DualData();

  private dualStorage: DualStorage = new DualStorage();

  private dataSubject: BehaviorSubject<DualData> = new BehaviorSubject<DualData>(this.dualData);
  public data$: Observable<DualData> = this.dataSubject.asObservable();

  constructor() {
    this.dualData.setData(this.dualStorage.getData());
  }

  /**MyData interface implementation**/

  addRow(index: number, amount: number): void {
    this.dualData.addRow(index, amount);
    this.dualStorage.saveData(this.dualData.getData());
    this.dataSubject.next(this.dualData);
  }

  getData(): DualDataDict[] {
    return this.dualData.getData();
  }

  getDataArray(): number[][][] {
    return this.dualData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.dualData.removeRow(index, amount);
    this.dualStorage.saveData(this.dualData.getData());
    this.dataSubject.next(this.dualData);
  }

  setData(data: DualDataDict[]): void {
    this.dualData.setData(data);
    this.dualStorage.saveData(this.dualData.getData());
    this.dataSubject.next(this.dualData);
  }
}
