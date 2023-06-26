import {Injectable} from '@angular/core';
import {MyData} from "../shared/data/data.interface";
import {VenusData, VenusDataDict, VenusStorage} from "./venus.service.util";
import {BehaviorSubject, Observable} from "rxjs";
import {MyStorage} from "../shared/storage/storage.interface";

@Injectable()
export class VenusService implements MyData {

  private venusStorage: MyStorage = new VenusStorage();
  private venusData: MyData = new VenusData();


  private dataSubject: BehaviorSubject<VenusDataDict[]>
    = new BehaviorSubject<VenusDataDict[]>(this.venusData.getData());
  public data$: Observable<VenusDataDict[]> = this.dataSubject.asObservable();

  constructor() {
    this.venusData.setData(this.venusStorage.getData());
  }

  addRow(index: number, amount: number): void {
    this.venusData.addRow(index, amount);
    this.venusStorage.saveData(this.venusData.getData());
    this.dataSubject.next(this.venusData.getData());
  }

  getData(): VenusDataDict[] {
    return this.venusData.getData();
  }

  getDataArray(): (number | null)[][] {
    return this.venusData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.venusData.removeRow(index, amount);
    this.venusStorage.saveData(this.venusData.getData());
    this.dataSubject.next(this.venusData.getData());
  }

  setData(data: any[]): void {
    this.venusData.setData(data);
    this.venusStorage.saveData(data);
    this.dataSubject.next(this.venusData.getData());
  }

  resetData(): void {
    this.setData(VenusData.getDefaultData());
  }

}
