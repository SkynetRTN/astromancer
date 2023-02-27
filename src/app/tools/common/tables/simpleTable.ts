export interface SimpleTable {
  addRow(): void

  getCols(): (string | number)[]

  removeCol(colIndex: number): void

  showCol(colIndex: number): void

  hideCol(colIndex: number): void
}
