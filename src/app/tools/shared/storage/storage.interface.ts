export interface MyStorage {
  getData(): any[];

  saveData(data: any[]): void;

  getChartInfo(): any;

  saveChartInfo(chartInfo: any): void;

  getInterface(): any;

  saveInterface(interfaceInfo: any): void;

  resetData(): void;

  resetInterface(): void;

  resetChartInfo(): void;
}
