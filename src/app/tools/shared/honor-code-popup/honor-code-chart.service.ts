import {Injectable} from '@angular/core';
import {Chart} from "chart.js/dist/types";
import {addEXIFToImage, dataURLtoBlob, formatTime, getDateString} from "../charts/utils";
import {saveAs} from 'file-saver';
import * as Highcharts from 'highcharts';
import HC_exporting from "highcharts/modules/exporting";
import HC_offline_exporting from "highcharts/modules/offline-exporting";
import html2canvas from "html2canvas";

/**
 * Services for charts to perform
 */
@Injectable({
  providedIn: 'root'
})
export class HonorCodeChartService {

  constructor() {
    HC_exporting(Highcharts);
    HC_offline_exporting(Highcharts);
  }

  /**
   * Save image to user's device as jpg.
   * @param chart The chart.js that needs to be saved
   * @param signature User's signature
   */
  saveImage(chart: Chart, signature: string, chartType: string): void {
    const canvas = chart.canvas;
    this.saveCanvasAsJpg(canvas, signature, chartType);
  }

  public saveImageHighChart(chart: Highcharts.Chart, chartType: string, signature: string): void {
    if (chartType && signature) {
      chart.exportChart(
        {
          filename: this.generateFileName(chartType, signature),
          type: 'image/jpeg',
        },
        {credits: {text: this.generateSignature(signature)}});
    }
  }

  public saveImageHighChartOffline(chart: Highcharts.Chart, ChartType: string, signature: string): void {
    if (ChartType && signature) {
      html2canvas(chart.container, {}).then(
        (canvas) => {
          this.saveCanvasAsJpg(canvas, signature, ChartType);
        }
      );
    }
  }

  private saveCanvasAsJpg(canvas: HTMLCanvasElement, signature: string, chartType?: string): void {
    const destCanvas = document.createElement('canvas');
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
    saveAs(dataURLtoBlob(exifImage), this.generateFileName(chartType, signature) + '.jpg');
  }

  private generateFileName(chartType?: string, signature?: string): string {
    let result = "";
    if (chartType)
      result += chartType + '-';
    if (signature)
      result += signature + '-';
    result += formatTime(getDateString());
    return result;
  }

  private generateSignature(signature: string): string {
    return "Created by " + signature + " at skynet.unc.edu";
  }
}
