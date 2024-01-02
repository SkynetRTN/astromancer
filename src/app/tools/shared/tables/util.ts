import {MyTable} from "./table-interface";

export function beforePaste(data: any[], coords: any, table: MyTable): boolean | void {
  let isValid: boolean = true;
  if (data && coords) {
    const rowDiff = data.length + coords[0]['startRow'] - table.getData().length;
    if (rowDiff > 0) {
      table.getTable().alter('insert_row_below', table.getData().length, rowDiff);
    }
    // generate new paste data if needed
    let new_data = '';
    for (let i = 0; i < data.length; i++) {
      if (data[i].length == 1 && data[i][0] == '')    // skip empty rows
        continue;
      if (i !== 0)      // add new line
        new_data += '\n';
      for (let j = 0; j < data[i].length; j++) {
        if (j !== 0)    // add tab to separate columns
          new_data += '\t';
        // replace variety of dashes with minus sign (holy fuck there are so many types of dashes)
        if (data[i][j].indexOf('–') !== -1 || data[i][j].indexOf('—') !== -1) {
          new_data += data[i][j].replace('–', '-').replace('—', '-');
          isValid = false;
        } else {
          new_data += data[i][j];
        }
      }
    }
    // if the input is not valid, fire a new paste cycle with manipulated data
    if (!isValid) {
      table.getTable().getPlugin('copyPaste').paste(new_data, coords);
    }
  }
  // return if another cycle of paste is necessary
  return isValid;
}
