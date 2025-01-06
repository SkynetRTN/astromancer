import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { ChartInfo } from "../shared/charts/chart.interface";
import { Chart } from "chart.js";
import {
    PulsarChartInfo,
    PulsarData,
    PulsarDataDict,
    PulsarDataSeries,
    PulsarStorage
  } from "./pulsar.service.util";
import { MyData } from "../shared/data/data.interface";
import * as Highcharts from 'highcharts';
import { UpdateSource } from "../shared/data/utils";
import { HttpClient } from '@angular/common/http';


@Injectable()
export class PulsarService implements MyData {
    private chartInfo: PulsarChartInfo = new PulsarChartInfo();
    private pulsarData: PulsarData = new PulsarData();
    private highChart!: Highcharts.Chart;
    private pulsarStorage: PulsarStorage = new PulsarStorage();

    private highChartLightCurve!: Highcharts.Chart;
    private highChartPeriodogram!: Highcharts.Chart;
    private highChartPeriodFolding!: Highcharts.Chart;
    private tabIndex: number;

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

    public setTabIndex(index: number): void {
        this.tabIndex = index;
        this.pulsarStorage.saveTabIndex(this.tabIndex);
    }

    public getTabIndex(): number {
        return this.tabIndex;
    }
}
