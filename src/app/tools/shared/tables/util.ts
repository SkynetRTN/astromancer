import {MyTable} from "./table-interface";

export function beforePaste(data: any[], coords: any, table: MyTable): void {
  if (data && coords) {
    const rowDiff = data.length + coords[0]['startRow'] - table.getData().length;
    if (rowDiff > 0) {
      table.getTable().alter('insert_row_below', table.getData().length, rowDiff);
    }
  }
}
