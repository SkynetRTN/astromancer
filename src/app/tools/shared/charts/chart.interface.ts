import {ChartConfiguration, ChartOptions} from "chart.js";
import {MyData} from "../data/data.interface";

export interface ChartInfo {
  getChartTitle(): string;

  getXAxisLabel(): string;

  getYAxisLabel(): string;

  getDataLabel(): string;

  getStorageObject(): any;

  setChartTitle(title: string): void;

  setXAxisLabel(xAxis: string): void;

  setYAxisLabel(yAxis: string): void;

  setDataLabel(data: string): void;

  setStorageObject(storageObject: any): void;

}

export interface MyChart {
  generateChartConfig(data: MyData, chartInfo: ChartInfo, toolInterface: any): ChartConfiguration<'line'>['data'];

  generateChartOptions(chartInfo: ChartInfo, toolInterface: any): ChartOptions<'line'>;

  renderChart(): void;
}
