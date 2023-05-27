import {Chart} from "chart.js/dist/types";
import * as piexif from 'piexif-ts';

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

/**
 * Add EXIF information to image
 * @param jpegData data of a jpeg file
 * @param signature signature of the user
 * @param time time of download initiation
 * @returns
 */
export function addEXIFToImage(jpegData: string, signature: string, time: string): string {
  const zeroth: piexif.IExifElement = {};
  const exif: piexif.IExifElement = {};
  zeroth[piexif.TagValues.ImageIFD.Artist] = signature;
  exif[piexif.TagValues.ExifIFD.DateTimeOriginal] = time;
  exif[piexif.TagValues.ExifIFD.FileSource] = window.location.href;

  const exifObj = {'0th': zeroth, 'Exif': exif};
  const exifBytes = piexif.dump(exifObj);
  return piexif.insert(exifBytes, jpegData);
}

/**
 * Get the current date in the format of "YYYY:MM:DD HH:MM:SS"
 */
export function getDateString() {
  let date = new Date();
  let year = '' + date.getFullYear();
  let month = dateAppendZero(date.getMonth() + 1); //Date.getMonth() gives you month from 0 to 11!
  let days = dateAppendZero(date.getDate());

  let hour = dateAppendZero(date.getHours());
  let minute = dateAppendZero(date.getMinutes());
  let second = dateAppendZero(date.getSeconds());

  return year + ':' + month + ':' + days + ' ' + hour + ':' + minute + ':' + second;
}

/**
 *
 * @param time A string in returned by getDateString()
 * @returns Formatted time string as Year-Month-DayTHourMinuteSecond
 */
export function formatTime(time: string) {
  const tarray = time.split(' ');
  tarray[0] = tarray[0].split(':').join('-');
  tarray[1] = tarray[1].split(':').join('');
  return tarray.join('T');
}

/**
 * Pre-fix a number with '0' if it is less then 10. Otherwise just convert it to string.
 * @param num: A number between 1 and 99.
 * @returns two-character string containing the number and a leading 0 if necessary.
 */
function dateAppendZero(num: number): string {
  return num < 10 ? '0' + num : '' + num;
}

/**
 * Turn dataurl into a blob object
 * @param dataurl
 * @returns Blob object
 * Credits: https://stackoverflow.com/a/30407959/1154380
 */
export function dataURLtoBlob(dataurl: string): Blob {
  // @ts-ignore
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime});
}
