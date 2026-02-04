import {Injectable} from '@angular/core';
import {Chart} from "chart.js/dist/types";
import {addEXIFToImage, dataURLtoBlob, formatTime, getDateString} from "../charts/utils";
import {saveAs} from 'file-saver';
import {ECharts} from "echarts";
import * as Highcharts from 'highcharts';
import HC_exporting from "highcharts/modules/exporting";
import HC_offline_exporting from "highcharts/modules/offline-exporting";
import html2canvas from "html2canvas";
import {BehaviorSubject, from, lastValueFrom, mergeMap, skip, Subject, take, tap} from "rxjs";

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
    public saveImage(chart: Chart, signature: string, chartType: string): void {
        const canvas = chart.canvas;
        this.saveCanvasAsJpg(canvas, signature, chartType);
    }

    public saveCanvasOffline(canvasElement: HTMLCanvasElement, ChartType: string, signature: string) {
        return html2canvas(canvasElement, {}).then(
            (canvas) => {
                this.saveCanvasAsJpg(canvas, signature, ChartType);
            }
        );
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

    public saveImageHighChartOffline(chart: Highcharts.Chart, ChartType: string, signature: string) {
        const container = chart.container as HTMLElement;
        return html2canvas(container, {}).then(
            (canvas) => {
                this.saveCanvasAsJpg(canvas, signature, ChartType);
            }
        );
    }

    public saveImageEChartOffline(chart: ECharts, chartType: string, signature: string) {
        const container = chart.getDom();
        return html2canvas(container, {}).then(
            (canvas) => {
                this.saveCanvasAsJpg(canvas, signature, chartType);
            }
        );
    }

    public saveImageEChartsOffline(charts: ECharts[], columns: number, signature: string, chartType: string): Promise<void> {
        if (charts.length === 1) {
            return this.saveImageEChartOffline(charts[0], chartType, signature);
        }
        const canvasTile: HTMLCanvasElement[] = [];
        return lastValueFrom(
            from(charts).pipe(
                mergeMap((chart) => {
                    const container = chart.getDom() as HTMLElement;
                    return from(html2canvas(container, {})).pipe(
                        tap(canvas => canvasTile.push(canvas))
                    );
                })
            )
        ).then(() => {
            return this.saveCanvasTilesAsJpg(canvasTile, columns, signature, chartType);
        });
    }

    public saveImageHighChartsOffline(charts: Highcharts.Chart[], column: number, signature: string, chartType: string): Promise<void> {
        if (charts.length === 1) {
            return this.saveImageHighChartOffline(charts[0], chartType, signature);
        }
        const canvasTile: HTMLCanvasElement[] = [];
        return lastValueFrom(
            from(charts).pipe(
                mergeMap((chart) => {
                    const container = chart.container as HTMLElement;
                    return from(html2canvas(container, {})).pipe(
                        // Wrap html2canvas in from() to return an observable
                        tap(canvas => canvasTile.push(canvas))
                    );
                })
            )
        ).then(() => {
            return this.saveCanvasTilesAsJpg(canvasTile, column, signature, chartType);
        });
    }

    public saveCanvasAsJpg(canvas: HTMLCanvasElement, signature: string, chartType?: string): void {
        this.saveCanvasTilesAsJpg([canvas], 1, signature, chartType);
    }

    private saveCanvasTilesAsJpg(canvasTile: HTMLCanvasElement[], columns: number, signature: string, chartType?: string): void {
        if (canvasTile.length === 0)
            return;
        const destCanvas = document.createElement('canvas');
        const unitWidth = canvasTile[0].width;
        const unitHeight = canvasTile[0].height;
        destCanvas.width = unitWidth * columns;
        destCanvas.height = unitHeight * Math.ceil(canvasTile.length / columns);
        const destCtx = destCanvas.getContext('2d');
        if (!destCtx)
            return;
        destCtx.fillStyle = '#FFFFFF';
        destCtx.fillRect(0, 0, destCanvas.width, destCanvas.height);
        for (let i = 0; i < canvasTile.length; i++) {
            destCtx.drawImage(canvasTile[i], (i % columns) * unitWidth, Math.floor(i / columns) * unitHeight);
        }
        const time = getDateString();
        const exifImage = addEXIFToImage(destCanvas.toDataURL('image/jpeg', 1.0), signature, time);
        //create image
        saveAs(dataURLtoBlob(exifImage), this.generateFileName(chartType, signature) + '.jpg');
        destCanvas.remove();
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
