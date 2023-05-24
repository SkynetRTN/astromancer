import {Inject, Injectable} from '@angular/core';
import {CurveCounts, CurveData, CurveDataDict} from "../../model/curve.model";
import {BehaviorSubject} from "rxjs";
import {HotTableRegisterer} from "@handsontable/angular";
import Handsontable from "handsontable";
import {ChartInfo} from "../shared/types/chart-form-interface";
import {Chart, ChartConfiguration, ChartOptions} from "chart.js";
import {LOCAL_STORAGE, StorageService} from "ngx-webstorage-service";

@Injectable()
export class CurveService implements ChartInfo {
  private static STORAGE_KEY: string = "curveData";
  private curveData: CurveData = new CurveData();
  private curveCount: number = CurveCounts.ONE;
  private isMagnitudeOn: boolean = false;
  private id = "dataTable";
  private hotRegisterer = new HotTableRegisterer();
  private chartInfo: CurveChartInfo = new CurveChartInfo();
  private dataSubject = new BehaviorSubject<CurveDataDict[]>(this.getData());
  data$ = this.dataSubject.asObservable();
  private dataKeysSubject = new BehaviorSubject<string[]>(this.getDataKeys());
  dataKeys$ = this.dataKeysSubject.asObservable();
  private chartInfoSubject = new BehaviorSubject<ChartInfo>(this.chartInfo);
  chartInfo$ = this.chartInfoSubject.asObservable();

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
    if (this.storage.has(CurveService.STORAGE_KEY)) {
      this.setData(JSON.parse(this.storage.get(CurveService.STORAGE_KEY)));
    } else {
      this.storage.set(CurveService.STORAGE_KEY, JSON.stringify(this.getData()));
    }
  }

  public getData(): CurveDataDict[] {
    return this.curveData.getData(this.curveCount);
  }

  public setData(dataDict: CurveDataDict[]): void {
    this.curveData.setData(dataDict);
    this.storage.set(CurveService.STORAGE_KEY, JSON.stringify(this.getData()));
    this.dataSubject.next(this.getData());
  }

  public getDataKeys(): string[] {
    return this.chartInfo.getTableLabels();
  }

  public setDataByCellOnTableChange(changes: any) {
    changes?.forEach(([row, col, , newValue]: any[]) => {
      this.curveData.setDataByCell(newValue, row, col);
    });
    this.storage.set(CurveService.STORAGE_KEY, JSON.stringify(this.getData()));
    this.dataSubject.next(this.getData());
  }

  public resetStorageData(): void {
    this.curveData.setData(this.curveData.getDefaultData());
    this.storage.set(CurveService.STORAGE_KEY, JSON.stringify(this.getData()));
    this.dataSubject.next(this.getData());
  }

  public addRow(index: number, amount: number): void {
    this.curveData.addRow(index, amount);
    this.dataSubject.next(this.getData());
  }

  public removeRow(index: number, amount: number): void {
    this.curveData.removeRow(index, amount);
    this.dataSubject.next(this.getData());
  }

  public setCurveCount(count: number): void {
    this.curveCount = count;
    this.dataKeysSubject.next(this.getDataKeys());
    this.dataSubject.next(this.getData());
    this.chartInfoSubject.next(this.chartInfo);
  }

  public getCurveCount(): number {
    return this.curveCount;
  }

  public setMagnitudeOn(isMagnitudeOn: boolean): void {
    this.isMagnitudeOn = isMagnitudeOn;
    this.chartInfoSubject.next(this.chartInfo);
  }

  public getMagnitudeOn(): boolean {
    return this.isMagnitudeOn;
  }

  public getTable(): Handsontable {
    return this.hotRegisterer.getInstance(this.id);
  }

  public getChartTitle(): string {
    return this.chartInfo.getChartTitle();
  }

  public getDataLabel(): string {
    return this.chartInfo.getDataLabelByCurveCount(this.curveCount);
  }

  public getXAxisLabel(): string {
    return this.chartInfo.getXAxisLabel();
  }

  public getYAxisLabel(): string {
    return this.chartInfo.getYAxisLabel();
  }

  public setChartTitle(title: string): void {
    this.chartInfo.setChartTitle(title);
    this.chartInfoSubject.next(this.chartInfo);
  }

  public setDataLabel(label: string): void {
    this.chartInfo.setDataLabel(label);
    this.chartInfoSubject.next(this.chartInfo);
    this.dataKeysSubject.next(this.getDataKeys());
  }

  public setXAxisLabel(label: string): void {
    this.chartInfo.setXAxisLabel(label);
    this.chartInfoSubject.next(this.chartInfo);
  }

  public setYAxisLabel(label: string): void {
    this.chartInfo.setYAxisLabel(label);
    this.chartInfoSubject.next(this.chartInfo);
  }

  public getChart(): Chart {
    return Chart.getChart("chart") as Chart;
  }

  public getChartData(): ChartConfiguration<'line'>['data'] {
    let result: any = {datasets: []};
    const data = this.getChartDataRaw(this.getData(), this.getCurveCount());
    for (let i = 0; i < this.getCurveCount(); i++) {
      result['datasets'].push({
        label: this.chartInfo.getTableLabels()[i + 1],
        data: data[i],
        borderWidth: 2,
        tension: 0.1,
        fill: false,
      })
    }
    return result;
  }

  public getChartOptions(): ChartOptions<'line'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      hover: {mode: 'nearest'},
      scales: {
        x: {
          title: {text: this.chartInfo.getXAxisLabel(), display: true},
          type: 'linear',
          position: 'bottom',
        },
        y: {
          title: {text: this.chartInfo.getYAxisLabel(), display: true},
          reverse: this.isMagnitudeOn,
        }
      },
      plugins: {
        title: {
          text: this.chartInfo.getChartTitle(),
          display: true,
        }
      },
      animation: {
        duration: 0,
      }
    };
  }

  private getChartDataRaw(dataDict: CurveDataDict[], curveCount: number): any[][] {
    const data = dataDict;
    let result: any[][] = [[], [], [], []];
    if (data.length == 0)
      return result;
    for (let i = 0; i < data.length; i++) {
      if (curveCount >= CurveCounts.ONE && data[i].y1 != null)
        result[0].push({x: data[i].x, y: data[i].y1});
      if (curveCount >= CurveCounts.TWO && data[i].y2 != null)
        result[1].push({x: data[i].x, y: data[i].y2});
      if (curveCount >= CurveCounts.THREE && data[i].y3 != null)
        result[2].push({x: data[i].x, y: data[i].y3});
      if (curveCount >= CurveCounts.FOUR && data[i].y4 != null)
        result[3].push({x: data[i].x, y: data[i].y4});
    }
    return result;
  }
}

class CurveChartInfo implements ChartInfo {
  private chartTitle: string;
  private xAxisLabel: string;
  private yAxisLabel: string;
  private dataLabels: string[];

  constructor() {
    this.chartTitle = "Title";
    this.xAxisLabel = "x";
    this.yAxisLabel = "y";
    this.dataLabels = ["y1", "y2", "y3", "y4"];
  }

  getChartTitle(): string {
    return this.chartTitle;
  }

  getDataLabel(): string {
    return this.dataLabels.join(", ");
  }

  getTableLabels(): string[] {
    return ["x"].concat(this.dataLabels);
  }

  getDataLabelByCurveCount(curveCount: number): string {
    const result = this.dataLabels;
    return result.slice(0, curveCount).join(", ");
  }

  getXAxisLabel(): string {
    return this.xAxisLabel;
  }

  getYAxisLabel(): string {
    return this.yAxisLabel;
  }

  setChartTitle(title: string): void {
    this.chartTitle = title;
  }

  setDataLabel(dataLabel: string): void {
    const dataLabelArray = dataLabel.split(",").map((label) => label.trim());
    for (let i = 0; i < Math.min(this.dataLabels.length, dataLabelArray.length); i++) {
      this.dataLabels[i] = dataLabelArray[i];
    }
  }

  setXAxisLabel(xAxisLabel: string): void {
    this.xAxisLabel = xAxisLabel;
  }

  setYAxisLabel(yAxisLabel: string): void {
    this.yAxisLabel = yAxisLabel;
  }

}
