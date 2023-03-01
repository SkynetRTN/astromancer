import {Chart} from "chart.js/dist/types";

/**
 *  This function takes the data in a dictionary object and updates a Chart object with the data. The
 *  dataset number for the Chart object and the keys for the x and y values are given in order to
 *  correctly update when there are multiple datasets in the Chart object or in the dictionary.
 *  @param tableData:   The dictionary object that provides data
 *  @param myChart:     The Chart object
 *  @param dataSetIndex:The index of the dataset to be updated in the Chart object.
 *  @param xKey:        The key for x values in the dictionary.
 *  @param yKey:        The key for y values in the dictionary.
 */
export function updateLine(tableData: any[], myChart: Chart, dataSetIndex = 0, xKey = 'x', yKey = 'y') {
  let start = 0;
  let data = myChart.data.datasets[dataSetIndex].data;
  for (let i = 0; i < tableData.length; i++) {
    if (tableData[i][xKey] === '' || tableData[i][yKey] === '' ||
      tableData[i][xKey] === null || tableData[i][yKey] === null) {
      continue;
    }
    data[start++] = {x: tableData[i][xKey], y: tableData[i][yKey]};
  }
  while (data.length !== start) {
    data.pop();
  }
  myChart.update('none');
}
