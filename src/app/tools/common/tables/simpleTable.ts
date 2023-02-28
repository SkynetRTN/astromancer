export interface SimpleTable {
  addRow(): void

  getColNames(): (string | number)[]

  removeCol(colIndex: number): void

  showCol(colIndex: number): void

  hideCol(colIndex: number): void

}

export interface SimpleTableInitArgs {
  data: any[];
  height: number;

  hiddenCols: number[];
}
