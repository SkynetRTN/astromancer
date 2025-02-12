/**
 * @remarks Interface for chart data
 * @method getData returns an array of objects each representing a data point
 * @method setData sets the data for this object 
 * @method getDataArray returns an array of arrays, each representing a data point
 * @method addRow append a data point
 * @method removeRow remove a data point
 */
export interface MyData {
  getData(): any[];

  getDataArray(): any[];

  setData(data: any[]): void;

  addRow(index: number, amount: number): void;

  removeRow(index: number, amount: number): void;
}

