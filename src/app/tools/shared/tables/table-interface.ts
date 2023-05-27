import Handsontable from "handsontable";

export interface MyTable {
  getTable(): Handsontable;

  renderTable(): void;
}
