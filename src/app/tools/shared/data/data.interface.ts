export interface MyData {
  getData(): any[];

  setData(data: any[]): void;

  addRow(index: number, amount: number): void;

  removeRow(index: number, amount: number): void;
}
