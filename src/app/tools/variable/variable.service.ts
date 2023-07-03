import {Injectable} from '@angular/core';
import {
  VariableChartInfo,
  VariableChartInfoStorageObject,
  VariableData,
  VariableDataDict,
  VariableInterface,
  VariableInterfaceImpl,
  VariablePeriodogram,
  VariablePeriodogramInterface,
  VariablePeriodogramStorageObject,
  VariableStarOptions,
  VariableStorage
} from "./variable.service.util";
import {BehaviorSubject} from "rxjs";
import {MyData} from "../shared/data/data.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import * as Highcharts from "highcharts";
import {lombScargleWithError} from "../shared/data/utils";

@Injectable()
export class VariableService implements MyData, VariableInterface, ChartInfo, VariablePeriodogramInterface {
  private variableData: VariableData = new VariableData();
  private variableInterface: VariableInterfaceImpl = new VariableInterfaceImpl();
  private variableChartInfo: VariableChartInfo = new VariableChartInfo();
  private variablePeriodogram: VariablePeriodogram = new VariablePeriodogram();

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
  private periodogramDataSubject: BehaviorSubject<VariableData>
    = new BehaviorSubject<VariableData>(this.variableData);
  public periodogramData$ = this.periodogramDataSubject.asObservable();
  private periodogramFormSubject: BehaviorSubject<VariablePeriodogram>
    = new BehaviorSubject<VariablePeriodogram>(this.variablePeriodogram);
  public periodogramForm$ = this.periodogramFormSubject.asObservable();

  private highChart!: Highcharts.Chart;
  private tabIndex: number;

  constructor() {
    this.variableData.setData(this.variableStorage.getData());
    this.variableInterface.setStorageObject(this.variableStorage.getInterface());
    this.variableChartInfo.setStorageObject(this.variableStorage.getChartInfo());
    this.variablePeriodogram.setPeriodogramStorageObject(this.variableStorage.getPeriodogram());
    this.tabIndex = this.variableStorage.getTabIndex();
  }


  /** Periodogram Interface */

  getPeriodogramTitle(): string {
    return this.variablePeriodogram.getPeriodogramTitle();
  }

  getPeriodogramXAxisLabel(): string {
    return this.variablePeriodogram.getPeriodogramXAxisLabel();
  }

  getPeriodogramYAxisLabel(): string {
    return this.variablePeriodogram.getPeriodogramYAxisLabel();
  }

  getPeriodogramDataLabel(): string {
    if (this.variablePeriodogram.getPeriodogramDataLabel() === VariablePeriodogram.defaultHash) {
      return this.getDefaultDataLabel();
    } else {
      return this.variablePeriodogram.getPeriodogramDataLabel();
    }
  }

  getPeriodogramStartPeriod(): number {
    return this.variablePeriodogram.getPeriodogramStartPeriod();
  }

  getPeriodogramEndPeriod(): number {
    return this.variablePeriodogram.getPeriodogramEndPeriod();
  }

  getPeriodogramStorageObject(): VariablePeriodogramStorageObject {
    return this.variablePeriodogram.getPeriodogramStorageObject();
  }

  setPeriodogramTitle(title: string): void {
    this.variablePeriodogram.setPeriodogramTitle(title);
    this.variableStorage.savePeriodogram(this.variablePeriodogram.getPeriodogramStorageObject());
    this.periodogramFormSubject.next(this.variablePeriodogram);
  }

  setPeriodogramXAxisLabel(xAxis: string): void {
    this.variablePeriodogram.setPeriodogramXAxisLabel(xAxis);
    this.variableStorage.savePeriodogram(this.variablePeriodogram.getPeriodogramStorageObject());
    this.periodogramFormSubject.next(this.variablePeriodogram);
  }

  setPeriodogramYAxisLabel(yAxis: string): void {
    this.variablePeriodogram.setPeriodogramYAxisLabel(yAxis);
    this.variableStorage.savePeriodogram(this.variablePeriodogram.getPeriodogramStorageObject());
    this.periodogramFormSubject.next(this.variablePeriodogram);
  }

  setPeriodogramDataLabel(data: string): void {
    this.variablePeriodogram.setPeriodogramDataLabel(data);
    this.variableStorage.savePeriodogram(this.variablePeriodogram.getPeriodogramStorageObject());
    this.periodogramFormSubject.next(this.variablePeriodogram);
    this.periodogramDataSubject.next(this.variableData);
  }

  setPeriodogramStartPeriod(startPeriod: number): void {
    this.variablePeriodogram.setPeriodogramStartPeriod(startPeriod);
    this.variableStorage.savePeriodogram(this.variablePeriodogram.getPeriodogramStorageObject());
    this.periodogramFormSubject.next(this.variablePeriodogram);
    this.periodogramDataSubject.next(this.variableData);
  }

  setPeriodogramEndPeriod(endPeriod: number): void {
    this.variablePeriodogram.setPeriodogramEndPeriod(endPeriod);
    this.variableStorage.savePeriodogram(this.variablePeriodogram.getPeriodogramStorageObject());
    this.periodogramFormSubject.next(this.variablePeriodogram);
    this.periodogramDataSubject.next(this.variableData);
  }

  setPeriodogramStorageObject(storageObject: VariablePeriodogramStorageObject): void {
    this.variablePeriodogram.setPeriodogramStorageObject(storageObject);
    this.variableStorage.savePeriodogram(this.variablePeriodogram.getPeriodogramStorageObject());
    this.periodogramFormSubject.next(this.variablePeriodogram);
    this.periodogramDataSubject.next(this.variableData);
  }

  resetPeriodogram(): void {
    this.variablePeriodogram.setPeriodogramStorageObject(VariablePeriodogram.getDefaultPeriodogram());
    this.variableStorage.savePeriodogram(this.variablePeriodogram.getPeriodogramStorageObject());
    this.periodogramFormSubject.next(this.variablePeriodogram);
    this.periodogramDataSubject.next(this.variableData);
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
      if (this.variableChartInfo.getDataLabel() === VariableChartInfo.defaultHash) {
        return this.getDefaultDataLabel();
      } else {
        return this.variableChartInfo.getDataLabel();
      }
    }
  }

  getDataLabelArray(): string[] {
    return this.variableChartInfo.getDataLabelArray();
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
    this.variableStorage.saveChartInfo(this.variableChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.variableChartInfo);
    this.dataSubject.next(this.variableData);
  }

  setStorageObject(storageObject: VariableChartInfoStorageObject): void {
    this.variableChartInfo.setStorageObject(storageObject);
    this.variableStorage.saveChartInfo(this.variableChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.variableChartInfo);
  }


  resetChartInfo(): void {
    this.variableChartInfo.setStorageObject(VariableChartInfo.getDefaultChartInfo());
    this.variableStorage.saveChartInfo(this.variableChartInfo.getStorageObject());
    this.chartInfoSubject.next(this.variableChartInfo);
    this.dataSubject.next(this.variableData);
  }

  setVariableStar(variableStar: VariableStarOptions): void {
    this.variableInterface.setVariableStar(variableStar);
    this.variableStorage.saveInterface(this.variableInterface.getStorageObject());
    this.interfaceSubject.next(this.variableInterface);
    this.chartInfoSubject.next(this.variableChartInfo);
    this.periodogramDataSubject.next(this.variableData);
  }


  /** VariableInterface implementation */


  getVariableStar(): VariableStarOptions {
    return this.variableInterface.getVariableStar();
  }

  setReferenceStarMagnitude(magnitude: number): void {
    this.variableInterface.setReferenceStarMagnitude(magnitude);
    this.variableStorage.saveInterface(this.variableInterface.getStorageObject());
    this.interfaceSubject.next(this.variableInterface);
    this.chartInfoSubject.next(this.variableChartInfo);
    this.dataSubject.next(this.variableData);
    this.periodogramFormSubject.next(this.variablePeriodogram);
    this.periodogramDataSubject.next(this.variableData);
  }

  getReferenceStarMagnitude(): number {
    return this.variableInterface.getReferenceStarMagnitude();
  }

  getChartVariableDataArray(): (number | null)[][] {
    if (this.getVariableStar() === VariableStarOptions.NONE) {
      return [];
    } else if (this.getVariableStar() === VariableStarOptions.SOURCE1) {
      return this.getData().filter((row: VariableDataDict) =>
        row.jd !== null && row.source1 !== null && row.source2 !== null)
        .map((row: VariableDataDict) => [row.jd, row.source1! - row.source2! - this.getReferenceStarMagnitude()])
    } else {
      return this.getData().filter((row: VariableDataDict) =>
        row.jd !== null && row.source1 !== null && row.source2 !== null)
        .map((row: VariableDataDict) => [row.jd, row.source2! - row.source1! - this.getReferenceStarMagnitude()])
    }
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

  getDataArray(): (number | null)[][] {
    return this.variableData.getDataArray();
  }

  getChartSourcesDataArray(): (number | null)[][][] {
    return this.variableData.getChartSourcesDataArray();
  }

  getChartSourcesErrorArray(): (number | null)[][][] {
    return this.variableData.getChartSourcesErrorArray();
  }

  getChartVariableErrorArray(): (number | null)[][] {
    if (this.getVariableStar() === VariableStarOptions.NONE) {
      return [];
    } else if (this.getVariableStar() === VariableStarOptions.SOURCE1) {
      return this.getData().filter(
        (row: VariableDataDict) => row.jd !== null && row.source1 !== null && row.source2 !== null && row.error1 !== null)
        .map((row: VariableDataDict) =>
          [row.jd, row.source1! - row.source2! - this.getReferenceStarMagnitude() - row.error1!,
            row.source1! - row.source2! - this.getReferenceStarMagnitude() + row.error1!])
    } else {
      return this.getData().filter(
        (row: VariableDataDict) => row.jd !== null && row.source1 !== null && row.source2 !== null && row.error2 !== null)
        .map((row: VariableDataDict) =>
          [row.jd, row.source2! - row.source1! - this.getReferenceStarMagnitude() - row.error2!,
            row.source2! - row.source1! - this.getReferenceStarMagnitude() + row.error2!])
    }
  }

  getChartPeriodogramDataArray(start: number, end: number): (number | null)[][] {
    const variableData = this.getChartVariableDataArray();
    const jdArray = variableData.map((entry) => entry[0]) as number[];
    const magArray = variableData.map((entry) => entry[1]) as number[];
    const errorArray = this.getData().map((row: VariableDataDict) =>
      this.getVariableStar() === VariableStarOptions.SOURCE1 ? row.error1 : row.error2) as number[];
    const error: any[] = [];
    for (let i = 0; i < magArray.length; i++) {
      error.push(
        errorArray[3 * i + 2]! - magArray[i]!
      )
    }
    return lombScargleWithError(jdArray, magArray, errorArray, start, end, Math.abs(end-start)*6900);
  }

  private getDefaultDataLabel(): string {
    return `Variable Star Mag + (${this.getReferenceStarMagnitude()} - Reference Star Mag)`
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


  setHighChart(highChart: Highcharts.Chart): void {
    this.highChart = highChart;
  }

  getHighChart(): Highcharts.Chart {
    return this.highChart;
  }

  setTabIndex(index: number): void {
    this.tabIndex = index;
    this.variableStorage.saveTabIndex(this.tabIndex);
  }

  getTabIndex(): number {
    return this.tabIndex;
  }

}
