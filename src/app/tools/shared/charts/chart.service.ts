import {Injectable} from '@angular/core';
import {Chart} from "chart.js/dist/types";
import {addEXIFToImage, dataURLtoBlob, formatTime, getDateString} from "./utils";
import {saveAs} from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() {
  }

  saveImage(chart: Chart, signature: string) {
    const destCanvas = document.createElement('canvas');
    const canvas = chart.canvas;
    destCanvas.width = canvas.width;
    destCanvas.height = canvas.height;
    const destCtx = destCanvas.getContext('2d');
    if (!destCtx)
      return;
    destCtx.fillStyle = '#FFFFFF';
    destCtx.fillRect(0, 0, destCanvas.width, destCanvas.height);
    destCtx.drawImage(canvas, 0, 0);
    const time = getDateString();
    const exifImage = addEXIFToImage(destCanvas.toDataURL('image/jpeg', 1.0), signature, time);
    //create image
    saveAs(dataURLtoBlob(exifImage), 'chart-' + formatTime(time) + '.jpg');
  }
}
