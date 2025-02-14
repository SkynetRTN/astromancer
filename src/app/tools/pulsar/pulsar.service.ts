import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ChartInfo } from "../shared/charts/chart.interface";
import { Chart } from "chart.js";
import {
    PulsarChartInfo,
    PulsarData,
    PulsarDataDict,
    PulsarDataSeries,
    PulsarStorage,
    PulsarInterfaceImpl,

  } from "./pulsar.service.util";
import { MyData } from "../shared/data/data.interface";
import * as Highcharts from 'highcharts';
import { UpdateSource } from "../shared/data/utils";
import { HttpClient } from '@angular/common/http';


@Injectable()
export class PulsarService implements MyData {
    private chartInfo: PulsarChartInfo = new PulsarChartInfo();
    private pulsarData: PulsarData = new PulsarData();
    private pulsarInterface: PulsarInterfaceImpl = new PulsarInterfaceImpl();
    private highChart!: Highcharts.Chart;
    private pulsarStorage: PulsarStorage = new PulsarStorage();


    private highChartLightCurve!: Highcharts.Chart;
    private highChartPeriodogram!: Highcharts.Chart;
    private highChartPeriodFolding!: Highcharts.Chart;
    private tabIndex: number;
    private LightCurveOptionValid: boolean = true;

    constructor() {
        this.tabIndex = this.pulsarStorage.getTabIndex();
    }

    // BehaviorSubjects for observables
    private dataSubject = new BehaviorSubject<PulsarDataDict[]>(this.pulsarData.getData());
    data$ = this.dataSubject.asObservable();

    private dataKeysSubject = new BehaviorSubject<string[]>(this.getDataLabelArray());
    dataKeys$ = this.dataKeysSubject.asObservable();

    private chartInfoSubject = new BehaviorSubject<UpdateSource>(UpdateSource.INIT);
    chartInfo$ = this.chartInfoSubject.asObservable();

    private backScaleSubject = new BehaviorSubject<number>(3);
    backScale$ = this.backScaleSubject.asObservable();

    private tabIndexSubject = new BehaviorSubject<number>(0);
    tabIndex$ = this.tabIndexSubject.asObservable();

    private combinedDataSubject = new BehaviorSubject<any[]>([]);
    combinedData$ = this.combinedDataSubject.asObservable();
    
    private lightCurveOptionValidSubject = new BehaviorSubject<boolean>(false);
    lightCurveOptionValid$ = this.lightCurveOptionValidSubject.asObservable();

    // ChartInfo Methods
    public getChartTitle(): string {
        return this.chartInfo.getChartTitle();
    }

    public getXAxisLabel(): string {
        return this.chartInfo.getXAxisLabel();
    }

    public getYAxisLabel(): string {
        return this.chartInfo.getYAxisLabel();
    }

    public getDataLabel(): string {
        return this.chartInfo.getDataLabel();
    }

    public getDataLabelArray(): string[] {
        return [this.chartInfo.getXAxisLabel(), this.chartInfo.getYAxisLabel()];
    }

    setHighChartLightCurve(highChart: Highcharts.Chart): void {
        this.highChartLightCurve = highChart;
    }

    getHighChartLightCurve(): Highcharts.Chart {
        return this.highChartLightCurve;
    }

    public setChartTitle(title: string): void {
        this.chartInfo.setChartTitle(title);
        this.chartInfoSubject.next(UpdateSource.INTERFACE);
    }

    public setXAxisLabel(label: string): void {
        this.chartInfo.setXAxisLabel(label);
        this.chartInfoSubject.next(UpdateSource.INTERFACE);
    }

    public setYAxisLabel(label: string): void {
        this.chartInfo.setYAxisLabel(label);
        this.chartInfoSubject.next(UpdateSource.INTERFACE);
    }

    public setDataLabel(label: string): void {
        this.chartInfo.setDataLabel();
        this.chartInfoSubject.next(UpdateSource.INTERFACE);
        this.dataKeysSubject.next(this.getDataLabelArray());
    }

    public updateData(newData: PulsarDataDict[]): void {
        this.pulsarData.setData(newData);
        this.dataSubject.next(this.pulsarData.getData());
    }

    // MyData Methods
    public getData(): PulsarDataDict[] {
        return this.pulsarData.getData();
    }

    public getDataArray(): number[][] {
        return this.pulsarData.getDataArray();
    }

    getChartSourcesDataArray(): (number | null)[][][] {
        return [
          this.pulsarData.getData().filter(
            (entry: PulsarDataDict) => entry.frequency !== null && entry.channel1 !== null)
            .map(
              (entry: PulsarDataDict) => [entry.frequency, entry.channel1]),
          this.pulsarData.getData().filter(
            (entry: PulsarDataDict) => entry.frequency !== null && entry.channel2 !== null)
            .map(
              (entry: PulsarDataDict) => [entry.frequency, entry.channel2])
        ]
      }
    

    public setData(dataDict: PulsarDataDict[]): void {
        this.pulsarData.setData(dataDict);
        this.dataSubject.next(this.getData());
    }

    public addRow(index: number, amount: number): void {
        this.pulsarData.addRow(index, amount);
        this.dataSubject.next(this.getData());
    }

    public removeRow(index: number, amount: number): void {
        this.pulsarData.removeRow(index, amount);
        this.dataSubject.next(this.getData());
    }

    // Reset Methods
    public resetData(): void {
        const defaultData = PulsarData.getDefaultDataAsArray();
        this.setData(defaultData);
        this.setCombinedData(defaultData)
        this.dataSubject.next(this.getData());
    }

    public resetChartInfo(): void {
        const defaultChartInfo = PulsarChartInfo.getDefaultStorageObject();
        this.chartInfo.setStorageObject(defaultChartInfo);
        this.chartInfoSubject.next(UpdateSource.RESET);
        this.dataKeysSubject.next(this.getDataLabelArray());
    }

    public setHighChart(highChart: Highcharts.Chart): void {
        this.highChart = highChart;
    }

    public getHighChart(): Highcharts.Chart {
        return this.highChart;
    }

    getTabIndex(): number {
        return this.tabIndexSubject.getValue();
    }

    setTabIndex(index: number): void {
        this.tabIndexSubject.next(index);
        this.pulsarStorage.saveTabIndex(index);
    }

    setCombinedData(data: any[]): void {
        this.combinedDataSubject.next(data);
      }
    
      getCombinedData(): any[] {
        return this.combinedDataSubject.getValue();
      }

      backgroundSubtraction(frequency: number[], flux: number[], dt: number): number[] {
        //console.log("I am in background subtraction", dt);
        let n = Math.min(frequency.length, flux.length);
        const subtracted = [];
        let jmin = 0;
        let jmax = 0;
        for (let i = 0; i < n; i++) {
            while (jmin < n && frequency[jmin] < frequency[i] - (dt / 2)) {
                jmin++;
            }
            while (jmax < n && frequency[jmax] <= frequency[i] + (dt / 2)) {
                jmax++;
            }
            let fluxmed = this.median(flux.slice(jmin, jmax));
            subtracted.push(flux[i] - fluxmed);
        }
       // console.log("subtracted", subtracted);
        return subtracted;
    }   
    
    median(arr: number[]) {
        arr = arr.filter(num => !isNaN(num));
        const mid = Math.floor(arr.length / 2);
        const nums = arr.sort((a, b) => a - b);
        return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    }

    getbackScale(): number {
        return this.backScaleSubject.getValue();
    }

    setbackScale(scale: number): void {
        this.backScaleSubject.next(scale);
    }

    getIsLightCurveOptionValid(): boolean {
        return this.lightCurveOptionValidSubject.getValue();
    }

    setLightCurveOptionValid(valid: boolean): void {
        this.lightCurveOptionValidSubject.next(valid);
    }

}
