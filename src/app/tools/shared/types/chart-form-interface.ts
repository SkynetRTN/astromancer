
export interface ChartInfo {
  getChartTitle(): string;
  getXAxisLabel(): string;
  getYAxisLabel(): string;
  getDataLabel(): string;
  setChartTitle(title: string): void;
  setXAxisLabel(xAxis: string): void;
  setYAxisLabel(yAxis: string): void;
  setDataLabel(data: string): void;
}
