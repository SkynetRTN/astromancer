import {Injectable} from '@angular/core';
import {
  VariableChartInfo,
  VariableChartInfoStorageObject,
  VariableData,
  VariableDataDict,
  VariableInterface,
  VariableInterfaceImpl,
  VariableStarOptions,
  VariableStorage
} from "./variable.service.util";
import {BehaviorSubject} from "rxjs";
import {MyData} from "../shared/data/data.interface";
import {ChartInfo} from "../shared/charts/chart.interface";

@Injectable()
export class VariableService implements MyData, VariableInterface, ChartInfo {
  private variableData: VariableData = new VariableData();
  private variableInterface: VariableInterfaceImpl = new VariableInterfaceImpl();
  private variableChartInfo: VariableChartInfo = new VariableChartInfo();

  private variableStorage: VariableStorage = new VariableStorage();

  private dataSubject: BehaviorSubject<VariableData>
    = new BehaviorSubject<VariableData>(this.variableData);
  public data$ = this.dataSubject.asObservable();
  private interfaceSubject: BehaviorSubject<VariableInterface>
    = new BehaviorSubject<VariableInterface>(this.variableInterface);
  public interface$ = this.interfaceSubject.asObservable();
  private chartInfoSubject: BehaviorSubject<VariableChartInfo>
    = new BehaviorSubject<VariableChartInfo>(this.variableChartInfo);
  public chartInfo$ = this.chartInfoSubject.asObservable();

  constructor() {
    this.variableData.setData(this.variableStorage.getData());
    this.variableInterface.setStorageObject(this.variableStorage.getInterface());
    this.loadChartInfoStorage();
  }

  /** ChartInfo implementation */


  getChartTitle(): string {
    return this.variableChartInfo.getChartTitle();
  }

  getXAxisLabel(): string {
    return this.variableChartInfo.getXAxisLabel();
  }

  getYAxisLabel(): string {
    return this.variableChartInfo.getYAxisLabel();
  }

  getDataLabel(): string {
    if (this.getVariableStar() === VariableStarOptions.NONE) {
      return this.variableChartInfo.getDataLabels();
    } else {
      return this.variableChartInfo.getDataLabel();
    }
  }

  getStorageObject() {
    return this.variableChartInfo.getStorageObject();
  }

  setChartTitle(title: string): void {
    this.variableChartInfo.setChartTitle(title);
    this.variableStorage.saveChartInfo(this.variableChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.variableChartInfo);
  }

  setXAxisLabel(xAxis: string): void {
    this.variableChartInfo.setXAxisLabel(xAxis);
    this.variableStorage.saveChartInfo(this.variableChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.variableChartInfo);
  }

  setYAxisLabel(yAxis: string): void {
    this.variableChartInfo.setYAxisLabel(yAxis);
    this.variableStorage.saveChartInfo(this.variableChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.variableChartInfo);
  }

  setDataLabel(data: string): void {
    if (this.getVariableStar() === VariableStarOptions.NONE) {
      this.variableChartInfo.setDataLabels(data);
    } else {
      this.variableChartInfo.setDataLabel(data);
    }
    console.log(this.variableChartInfo.getStorageObject());
    this.variableStorage.saveChartInfo(this.variableChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.variableChartInfo);
  }

  setStorageObject(storageObject: VariableChartInfoStorageObject): void {
    this.variableChartInfo.setStorageObject(storageObject);
    this.variableStorage.saveChartInfo(this.variableChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.variableChartInfo);
  }

  loadChartInfoStorage(): void {
    this.variableChartInfo.setStorageObject(this.variableStorage.getChartInfo());
    if (this.variableChartInfo.getDataLabel() === VariableChartInfo.defaultHash) {

      this.variableStorage.saveChartInfo(this.variableChartInfo.getStorageObject());
    }
  }

  resetChartInfo(): void {
    this.variableChartInfo.setStorageObject(VariableChartInfo.getDefaultChartInfo());
    this.setDefaultDataLabel();
    this.variableStorage.saveChartInfo(this.variableChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.variableChartInfo);
  }

  setVariableStar(variableStar: VariableStarOptions): void {
    this.variableInterface.setVariableStar(variableStar);
    this.variableStorage.saveInterface(this.variableInterface.getStorageObject());
    this.interfaceSubject.next(this.variableInterface);
    this.chartInfoSubject.next(this.variableChartInfo);
  }


  /** VariableInterface implementation */


  getVariableStar(): VariableStarOptions {
    return this.variableInterface.getVariableStar();
  }

  private setDefaultDataLabel(): void {
    this.variableChartInfo.setDataLabel(
      `Variable Star Mag + (${this.getReferenceStarMagnitude()} - Reference Star Mag)`);
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
