import {Injectable} from '@angular/core';
import {
  VariableData,
  VariableDataDict,
  VariableInterface,
  VariableInterfaceImpl,
  VariableStarOptions,
  VariableStorage
} from "./variable.service.util";
import {BehaviorSubject} from "rxjs";
import {MyData} from "../shared/data/data.interface";

@Injectable()
export class VariableService implements MyData, VariableInterface {
  private variableData: VariableData = new VariableData();
  private variableInterface: VariableInterfaceImpl = new VariableInterfaceImpl();

  private variableStorage: VariableStorage = new VariableStorage();

  private dataSubject: BehaviorSubject<VariableData>
    = new BehaviorSubject<VariableData>(this.variableData);
  public data$ = this.dataSubject.asObservable();
  private interfaceSubject: BehaviorSubject<VariableInterface>
    = new BehaviorSubject<VariableInterface>(this.variableInterface);
  public interface$ = this.interfaceSubject.asObservable();

  constructor() {
    this.variableData.setData(this.variableStorage.getData());
    this.variableInterface.setStorageObject(this.variableStorage.getInterface());
  }


  /** VariableInterface implementation */


  getVariableStar(): VariableStarOptions {
    return this.variableInterface.getVariableStar();
  }

  setVariableStar(variableStar: VariableStarOptions): void {
    this.variableInterface.setVariableStar(variableStar);
    this.variableStorage.saveInterface(this.variableInterface.getStorageObject());
    this.interfaceSubject.next(this.variableInterface);
  }

  getReferenceStarMagnitude(): number {
    return this.variableInterface.getReferenceStarMagnitude();
  }

  setReferenceStarMagnitude(magnitude: number): void {
    this.variableInterface.setReferenceStarMagnitude(magnitude);
    this.variableStorage.saveInterface(this.variableInterface.getStorageObject());
    this.interfaceSubject.next(this.variableInterface);
  }

  getIsLightCurveOptionValid(): boolean {
    return this.variableInterface.getIsLightCurveOptionValid();
  }


  /** MyData implementation */

  addRow(index: number, amount: number): void {
    this.variableData.addRow(index, amount);
    this.variableStorage.saveData(this.variableData.getData());
    this.dataSubject.next(this.variableData);
  }

  getData(): VariableDataDict[] {
    return this.variableData.getData();
  }

  getDataArray(): (number|null)[][] {
    return this.variableData.getDataArray();
  }

  removeRow(index: number, amount: number): void {
    this.variableData.removeRow(index, amount);
    this.variableStorage.saveData(this.variableData.getData());
    this.dataSubject.next(this.variableData);
  }

  setData(data: any[]): void {
    this.variableData.setData(data);
    this.variableStorage.saveData(this.variableData.getData());
    this.dataSubject.next(this.variableData);
  }

  resetData(): void {
    this.variableData.setData(VariableData.getDefaultDataDict());
    this.variableStorage.saveData(this.variableData.getData());
    this.dataSubject.next(this.variableData);
  }


}
