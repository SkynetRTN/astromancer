import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ChartInfo } from "../shared/charts/chart.interface";
import { Chart } from "chart.js";
import {
    PulsarChartInfo,
    PulsarChartInfoStorageObject,
    PulsarData,
    PulsarDataDict,
    PulsarDisplayPeriod,
    PulsarInterface,
    PulsarInterfaceImpl,
    PulsarPeriodFolding,
    PulsarPeriodFoldingInterface,
    PulsarPeriodogram,
    PulsarPeriodogramInterface,
    PulsarPeriodogramStorageObject,
    PulsarStarOptions,
    PulsarStorage
} from "./pulsar.service.util";
import {MyData} from "../shared/data/data.interface";
import * as Highcharts from "highcharts";
import {floatMod, lombScargle, UpdateSource} from "../shared/data/utils";

@Injectable()
export class PulsarService implements MyData, PulsarInterface, ChartInfo, PulsarPeriodogramInterface, PulsarPeriodFoldingInterface {
    private pulsarData: PulsarData = new PulsarData();
    private pulsarInterface: PulsarInterfaceImpl = new PulsarInterfaceImpl();
    private highChart!: Highcharts.Chart;
    private pulsarStorage: PulsarStorage = new PulsarStorage();

    private pulsarChartInfo: PulsarChartInfo = new PulsarChartInfo();
    private pulsarPeriodogram: PulsarPeriodogram = new PulsarPeriodogram();
    private pulsarPeriodFolding: PulsarPeriodFolding = new PulsarPeriodFolding();

    private dataSubject: BehaviorSubject<PulsarData>
        = new BehaviorSubject<PulsarData>(this.pulsarData);
    public data$ = this.dataSubject.asObservable();

    private interfaceSubject: BehaviorSubject<PulsarInterface>
        = new BehaviorSubject<PulsarInterface>(this.pulsarInterface);
    public interface$ = this.interfaceSubject.asObservable();
    private chartInfoSubject: BehaviorSubject<PulsarChartInfo>
        = new BehaviorSubject<PulsarChartInfo>(this.pulsarChartInfo);
    public chartInfo$ = this.chartInfoSubject.asObservable();
    private periodogramDataSubject: BehaviorSubject<PulsarData>
        = new BehaviorSubject<PulsarData>(this.pulsarData);
    public periodogramData$ = this.periodogramDataSubject.asObservable();
    private periodogramFormSubject: BehaviorSubject<PulsarPeriodogram>
        = new BehaviorSubject<PulsarPeriodogram>(this.pulsarPeriodogram);
    public periodogramForm$ = this.periodogramFormSubject.asObservable();
    private periodFoldingDataSubject: BehaviorSubject<PulsarData>
        = new BehaviorSubject<PulsarData>(this.pulsarData);
    public periodFoldingData$ = this.periodFoldingDataSubject.asObservable();
    private periodFoldingFormSubject: BehaviorSubject<UpdateSource>
        = new BehaviorSubject<UpdateSource>(UpdateSource.INIT);
    public periodFoldingForm$ = this.periodFoldingFormSubject.asObservable();

    private highChartLightCurve!: Highcharts.Chart;
    private highChartPeriodogram!: Highcharts.Chart;
    private highChartPeriodFolding!: Highcharts.Chart;
    private tabIndex: number;
    private LightCurveOptionValid: boolean = true;

    constructor() {
        this.pulsarData.setData(this.pulsarStorage.getData());
        this.pulsarInterface.setStorageObject(this.pulsarStorage.getInterface());
        this.pulsarChartInfo.setStorageObject(this.pulsarStorage.getChartInfo());
        this.pulsarPeriodogram.setPeriodogramStorageObject(this.pulsarStorage.getPeriodogram());
        this.pulsarPeriodFolding.setPeriodFoldingStorageObject(this.pulsarStorage.getPeriodFolding());
        this.tabIndex = this.pulsarStorage.getTabIndex();
    }

    /** PeriodFolding Interface */

    private backScaleSubject = new BehaviorSubject<number>(3);
    backScale$ = this.backScaleSubject.asObservable();

    private tabIndexSubject = new BehaviorSubject<number>(0);
    tabIndex$ = this.tabIndexSubject.asObservable();

    private combinedDataSubject = new BehaviorSubject<any[]>([]);
    combinedData$ = this.combinedDataSubject.asObservable();
    
    private LightCurveOptionValidSubject = new BehaviorSubject<boolean>(true);
    lightCurveOptionValid$ = this.LightCurveOptionValidSubject.asObservable();

    // ChartInfo Methods
    getPeriodFoldingDisplayPeriod(): PulsarDisplayPeriod {
        return this.pulsarPeriodFolding.getPeriodFoldingDisplayPeriod();
    }

    getPeriodFoldingPeriod(): number {
        if (this.pulsarPeriodFolding.getPeriodFoldingPeriod() < 0)
            return this.getJdRange();
        else
            return this.pulsarPeriodFolding.getPeriodFoldingPeriod();
    }

    getPeriodFoldingPhase(): number {
        return this.pulsarPeriodFolding.getPeriodFoldingPhase();
    }

    getPeriodFoldingCal(): number {
        return this.pulsarPeriodFolding.getPeriodFoldingCal();
    }

    getPeriodFoldingTitle(): string {
        return this.pulsarPeriodFolding.getPeriodFoldingTitle();
    }
    getPeriodFoldingXAxisLabel(): string {
        return this.pulsarPeriodFolding.getPeriodFoldingXAxisLabel();
    }

    getPeriodFoldingYAxisLabel(): string {
        return this.pulsarPeriodFolding.getPeriodFoldingYAxisLabel();
    }

    getPeriodFoldingDataLabel(): string {
        if (this.pulsarPeriodFolding.getPeriodFoldingDataLabel() === PulsarPeriodFolding.defaultHash) {
            return this.getDefaultDataLabel();
        } else {
            return this.pulsarPeriodFolding.getPeriodFoldingDataLabel();
        }
    }

    setPeriodFoldingDisplayPeriod(displayPeriod: PulsarDisplayPeriod): void {
        this.pulsarPeriodFolding.setPeriodFoldingDisplayPeriod(displayPeriod);
        this.pulsarStorage.savePeriodFolding(this.pulsarPeriodFolding.getPeriodFoldingStorageObject());
        this.periodFoldingFormSubject.next(UpdateSource.INTERFACE);
        this.periodFoldingDataSubject.next(this.pulsarData);
    }

    setPeriodFoldingPeriod(period: number): void {
        this.pulsarPeriodFolding.setPeriodFoldingPeriod(period);
        this.pulsarStorage.savePeriodFolding(this.pulsarPeriodFolding.getPeriodFoldingStorageObject());
        this.periodFoldingFormSubject.next(UpdateSource.INTERFACE);
        this.periodFoldingDataSubject.next(this.pulsarData);
    }

    setPeriodFoldingPhase(phase: number): void {
        this.pulsarPeriodFolding.setPeriodFoldingPhase(phase);
        this.pulsarStorage.savePeriodFolding(this.pulsarPeriodFolding.getPeriodFoldingStorageObject());
        this.periodFoldingFormSubject.next(UpdateSource.INTERFACE);
        this.periodFoldingDataSubject.next(this.pulsarData);
    }

    setPeriodFoldingCal(cal: number): void {
        this.pulsarPeriodFolding.setPeriodFoldingCal(cal);
        this.pulsarStorage.savePeriodFolding(this.pulsarPeriodFolding.getPeriodFoldingStorageObject());
        this.periodFoldingFormSubject.next(UpdateSource.INTERFACE);
        this.periodFoldingDataSubject.next(this.pulsarData);
    }

    setPeriodFoldingTitle(title: string): void {
        this.pulsarPeriodFolding.setPeriodFoldingTitle(title);
        this.pulsarStorage.savePeriodFolding(this.pulsarPeriodFolding.getPeriodFoldingStorageObject());
        this.periodFoldingFormSubject.next(UpdateSource.INTERFACE);
    }

    setPeriodFoldingXAxisLabel(xAxis: string): void {
        this.pulsarPeriodFolding.setPeriodFoldingXAxisLabel(xAxis);
        this.pulsarStorage.savePeriodFolding(this.pulsarPeriodFolding.getPeriodFoldingStorageObject());
        this.periodFoldingFormSubject.next(UpdateSource.INTERFACE);
    }

    setPeriodFoldingYAxisLabel(yAxis: string): void {
        this.pulsarPeriodFolding.setPeriodFoldingYAxisLabel(yAxis);
        this.pulsarStorage.savePeriodFolding(this.pulsarPeriodFolding.getPeriodFoldingStorageObject());
        this.periodFoldingFormSubject.next(UpdateSource.INTERFACE);
    }

    setPeriodFoldingDataLabel(data: string): void {
        this.pulsarPeriodFolding.setPeriodFoldingDataLabel(data);
        this.pulsarStorage.savePeriodFolding(this.pulsarPeriodFolding.getPeriodFoldingStorageObject());
        this.periodFoldingFormSubject.next(UpdateSource.INTERFACE);
        this.periodFoldingDataSubject.next(this.pulsarData);

    }

    resetPeriodFoldingForm(): void {
        this.pulsarPeriodFolding.setPeriodFoldingStorageObject(PulsarPeriodFolding.getDefaultStorageObject());
        this.pulsarStorage.savePeriodFolding(this.pulsarPeriodFolding.getPeriodFoldingStorageObject());
        this.periodFoldingFormSubject.next(UpdateSource.RESET);
        this.periodFoldingDataSubject.next(this.pulsarData);
    }

    getPeriodFoldingChartData(): { [key: string]: number[][] } {
        console.log('Checking my data', this.getChartPulsarDataArray());
    
        // Handle case when no pulsar star is selected
        //if (this.getPulsarStar() === PulsarStarOptions.NONE)
          //++  return { data: [], data2: [] }; // Return empty for both series
    
        // Get and filter valid data
        const data = this.getChartPulsarDataArray()
            .filter((entry) => entry[0] !== null) // Ensure JD is not null
            .sort((a, b) => a[0]! - b[0]!); // Sort by JD
    
        // Extract period and phase
        const minJD = data[0][0]!;
        const period = this.getPeriodFoldingPeriod();
        const phase = this.getPeriodFoldingPhase();
    
        // Initialize arrays for two series
        let pfData1: number[][] = []; // For source1
        let pfData2: number[][] = []; // For source2 (optional)
    
        if (period !== 0 && period !== null) {
            for (let i = 0; i < data.length; i++) {
                // Calculate x-axis (phase folded JD)
                let temp_x = phase * period + floatMod((data[i][0]! - minJD), period);
                if (temp_x > period) {
                    temp_x -= period;
                }
    
                // Push data for series 1
                pfData1.push([temp_x, data[i][1]!]);
    
                // Conditionally push data for series 2 if it is not null
                if (data[i][2] !== null) {
                    pfData2.push([temp_x, data[i][2]!]);
                }
    
                // Handle double period display
                if (this.getPeriodFoldingDisplayPeriod() === PulsarDisplayPeriod.TWO) {
                    let new_x = temp_x + parseFloat(period as any);
    
                    // Push second cycle for series 1
                    pfData1.push([new_x, data[i][1]!]);
    
                    // Push second cycle for series 2 if not null
                    if (data[i][2] !== null) {
                        pfData2.push([new_x, data[i][2]!]);
                    }
                }
            }
        }
    
        // Sort data
        pfData1.sort((a, b) => b[0] - a[0]);
        pfData2.sort((a, b) => b[0] - a[0]);
    
        // Return two datasets, only including 'data2' if it has values
        console.log('pfData1', pfData1);
        return pfData2.length > 0
            ? { data: pfData1, data2: pfData2 }
            : { data: pfData1 };
                }
    
    


    /** Periodogram Interface */

    
    getPeriodogramTitle(): string {
        return this.pulsarPeriodogram.getPeriodogramTitle();
    }

    getPeriodogramXAxisLabel(): string {
        return this.pulsarPeriodogram.getPeriodogramXAxisLabel();
    }

    getPeriodogramYAxisLabel(): string {
        return this.pulsarPeriodogram.getPeriodogramYAxisLabel();
    }

    getPeriodogramDataLabel(): string {
        if (this.pulsarPeriodogram.getPeriodogramDataLabel() === PulsarPeriodogram.defaultHash) {
            return this.getDefaultDataLabel();
        } else {
            return this.pulsarPeriodogram.getPeriodogramDataLabel();
        }
    }

    getPeriodogramPoints(): number {
        return this.pulsarPeriodogram.getPeriodogramPoints();
    }

    getPeriodogramMethod(): boolean {
        return this.pulsarPeriodogram.getPeriodogramMethod();
    }

    getPeriodogramStartPeriod(): number {
        return this.pulsarPeriodogram.getPeriodogramStartPeriod();
    }

    getPeriodogramEndPeriod(): number {
        return this.pulsarPeriodogram.getPeriodogramEndPeriod();
    }

    getPeriodogramStorageObject(): PulsarPeriodogramStorageObject {
        return this.pulsarPeriodogram.getPeriodogramStorageObject();
    }

    setPeriodogramTitle(title: string): void {
        this.pulsarPeriodogram.setPeriodogramTitle(title);
        this.pulsarStorage.savePeriodogram(this.pulsarPeriodogram.getPeriodogramStorageObject());
        this.periodogramFormSubject.next(this.pulsarPeriodogram);
    }

    setPeriodogramXAxisLabel(xAxis: string): void {
        this.pulsarPeriodogram.setPeriodogramXAxisLabel(xAxis);
        this.pulsarStorage.savePeriodogram(this.pulsarPeriodogram.getPeriodogramStorageObject());
        this.periodogramFormSubject.next(this.pulsarPeriodogram);
    }

    setPeriodogramYAxisLabel(yAxis: string): void {
        this.pulsarPeriodogram.setPeriodogramYAxisLabel(yAxis);
        this.pulsarStorage.savePeriodogram(this.pulsarPeriodogram.getPeriodogramStorageObject());
        this.periodogramFormSubject.next(this.pulsarPeriodogram);
    }

    setPeriodogramDataLabel(data: string): void {
        this.pulsarPeriodogram.setPeriodogramDataLabel(data);
        this.pulsarStorage.savePeriodogram(this.pulsarPeriodogram.getPeriodogramStorageObject());
        this.periodogramFormSubject.next(this.pulsarPeriodogram);
        this.periodogramDataSubject.next(this.pulsarData);
    }

    setPeriodogramPoints(points: number): void {
        this.pulsarPeriodogram.setPeriodogramPoints(points);
        this.pulsarStorage.savePeriodogram(this.pulsarPeriodogram.getPeriodogramStorageObject());
        this.periodogramFormSubject.next(this.pulsarPeriodogram);
        this.periodogramDataSubject.next(this.pulsarData);
    }

    setPeriodogramMethod(method: boolean): void {
        this.pulsarPeriodogram.setPeriodogramMethod(method);
        this.pulsarStorage.savePeriodogram(this.pulsarPeriodogram.getPeriodogramStorageObject());
        this.periodogramFormSubject.next(this.pulsarPeriodogram);
        this.periodogramDataSubject.next(this.pulsarData);
    }

    setPeriodogramStartPeriod(startPeriod: number): void {
        this.pulsarPeriodogram.setPeriodogramStartPeriod(startPeriod);
        this.pulsarStorage.savePeriodogram(this.pulsarPeriodogram.getPeriodogramStorageObject());
        this.periodogramFormSubject.next(this.pulsarPeriodogram);
        this.periodogramDataSubject.next(this.pulsarData);
        this.periodFoldingFormSubject.next(UpdateSource.INIT);
    }

    setPeriodogramEndPeriod(endPeriod: number): void {
        this.pulsarPeriodogram.setPeriodogramEndPeriod(endPeriod);
        this.pulsarStorage.savePeriodogram(this.pulsarPeriodogram.getPeriodogramStorageObject());
        this.periodogramFormSubject.next(this.pulsarPeriodogram);
        this.periodogramDataSubject.next(this.pulsarData);
    }

    setPeriodogramStorageObject(storageObject: PulsarPeriodogramStorageObject): void {
        this.pulsarPeriodogram.setPeriodogramStorageObject(storageObject);
        this.pulsarStorage.savePeriodogram(this.pulsarPeriodogram.getPeriodogramStorageObject());
        this.periodogramFormSubject.next(this.pulsarPeriodogram);
        this.periodogramDataSubject.next(this.pulsarData);
    }

    resetPeriodogram(): void {
        this.pulsarPeriodogram.setPeriodogramStorageObject(PulsarPeriodogram.getDefaultPeriodogram());
        this.pulsarStorage.savePeriodogram(this.pulsarPeriodogram.getPeriodogramStorageObject());
        this.periodogramFormSubject.next(this.pulsarPeriodogram);
        this.periodogramDataSubject.next(this.pulsarData);
        this.periodFoldingFormSubject.next(UpdateSource.INIT);
    }

    getJdRange(): number {
        const jdArray = this.getData().map((row: PulsarDataDict) => row.jd)
            .filter((jd: number | null) => jd !== null) as number[];
        return parseFloat((Math.max(...jdArray) - Math.min(...jdArray)).toFixed(4));
    }


    getLabels(isHz: boolean): { startPeriodLabel: string, endPeriodLabel: string } {
        let startPeriodLabel: string;
        let endPeriodLabel: string;
    
        const currentStart = Number(this.getPeriodogramStartPeriod());
        const currentEnd = Number(this.getPeriodogramEndPeriod());
    
        if (isHz) {
            startPeriodLabel = 'Start Period (Hz)';
            endPeriodLabel = 'End Period (Hz)';
            this.setPeriodogramEndPeriod(1 / currentStart);
            this.setPeriodogramStartPeriod(1 / currentEnd);
        } else {
            startPeriodLabel = 'Start Period (sec)';
            endPeriodLabel = 'End Period (sec)';
            this.setPeriodogramEndPeriod(1 / currentStart);
            this.setPeriodogramStartPeriod(1 / currentEnd);
        }
    
        // Return both labels
        return { startPeriodLabel, endPeriodLabel };
    }
    



    /** ChartInfo implementation */


    getChartTitle(): string {
        return this.pulsarChartInfo.getChartTitle();
    }

    getXAxisLabel(): string {
        return this.pulsarChartInfo.getXAxisLabel();
    }

    getYAxisLabel(): string {
        return this.pulsarChartInfo.getYAxisLabel();
    }

    getDataLabel(): string {
        return this.pulsarChartInfo.getDataLabel();
    }

    getDataLabelArray(): string[] {
        return this.pulsarChartInfo.getDataLabelArray();
    }

    getStorageObject() {
        return this.pulsarChartInfo.getStorageObject();
    }

    setChartTitle(title: string): void {
        this.pulsarChartInfo.setChartTitle(title);
        this.pulsarStorage.saveChartInfo(this.pulsarChartInfo.getStorageObject());
        this.chartInfoSubject.next(this.pulsarChartInfo);
    }

    setXAxisLabel(xAxis: string): void {
        this.pulsarChartInfo.setXAxisLabel(xAxis);
        this.pulsarStorage.saveChartInfo(this.pulsarChartInfo.getStorageObject());
        this.chartInfoSubject.next(this.pulsarChartInfo);
    }

    setYAxisLabel(yAxis: string): void {
        this.pulsarChartInfo.setYAxisLabel(yAxis);
        this.pulsarStorage.saveChartInfo(this.pulsarChartInfo.getStorageObject());
        this.chartInfoSubject.next(this.pulsarChartInfo);
    }

    setDataLabel(data: string): void {
        if (this.getPulsarStar() === PulsarStarOptions.NONE) {
            this.pulsarChartInfo.setDataLabels(data);
        } else {
            this.pulsarChartInfo.setDataLabel(data);
        }
        this.pulsarStorage.saveChartInfo(this.pulsarChartInfo.getStorageObject());
        this.chartInfoSubject.next(this.pulsarChartInfo);
        this.dataSubject.next(this.pulsarData);
    }

    setDataLabelArray(data: string): void{
        let LabelArray = data.split(',')
        this.pulsarChartInfo.setDataLabelArray(LabelArray);
        this.pulsarStorage.saveChartInfo(this.pulsarChartInfo.getStorageObject());
        this.chartInfoSubject.next(this.pulsarChartInfo);
    }

    setStorageObject(storageObject: PulsarChartInfoStorageObject): void {
        this.pulsarChartInfo.setStorageObject(storageObject);
        this.pulsarStorage.saveChartInfo(this.pulsarChartInfo.getStorageObject());
        this.chartInfoSubject.next(this.pulsarChartInfo);
    }


    resetChartInfo(): void {
        this.pulsarChartInfo.setStorageObject(PulsarChartInfo.getDefaultChartInfo());
        this.pulsarStorage.saveChartInfo(this.pulsarChartInfo.getStorageObject());
        this.chartInfoSubject.next(this.pulsarChartInfo);
        this.dataSubject.next(this.pulsarData);
    }

    setbackScale(backScale: number): void {
        this.pulsarInterface.setbackScale(backScale);
       // this.pulsarStorage.saveInterface(this.pulsarInterface.getStorageObject());
        //this.interfaceSubject.next(this.pulsarInterface);
        //this.chartInfoSubject.next(this.pulsarChartInfo);
        //this.periodogramDataSubject.next(this.pulsarData);
        //this.periodFoldingDataSubject.next(this.pulsarData);
        this.backScaleSubject.next(backScale);
    }

    getIsLightCurveOptionValid(): boolean {
        return this.LightCurveOptionValidSubject.getValue();
    }

    setLightCurveOptionValid(valid: boolean): void {
        this.pulsarInterface.setLightCurveOptionValid(valid);
        this.LightCurveOptionValidSubject.next(valid);
        this.LightCurveOptionValid = valid;
        console.log("light curve was set in pulsar.service", this.LightCurveOptionValid);
    }

    setPulsarStar(pulsarStar: PulsarStarOptions): void {
        this.pulsarInterface.setPulsarStar(pulsarStar);
        this.pulsarStorage.saveInterface(this.pulsarInterface.getStorageObject());
        this.interfaceSubject.next(this.pulsarInterface);
        this.chartInfoSubject.next(this.pulsarChartInfo);
        this.periodogramDataSubject.next(this.pulsarData);
        this.periodFoldingDataSubject.next(this.pulsarData);
    }
    

    /** PulsarInterface implementation */

    getbackScale(): number {
        return this.backScaleSubject.getValue();

    }

    getPulsarStar(): PulsarStarOptions {
        return this.pulsarInterface.getPulsarStar();
    }

    setReferenceStarMagnitude(magnitude: number): void {
        this.pulsarStorage.saveInterface(this.pulsarInterface.getStorageObject());
        this.interfaceSubject.next(this.pulsarInterface);
        this.chartInfoSubject.next(this.pulsarChartInfo);
        this.dataSubject.next(this.pulsarData);
        this.periodogramFormSubject.next(this.pulsarPeriodogram);
        this.periodogramDataSubject.next(this.pulsarData);
        this.periodFoldingFormSubject.next(UpdateSource.INIT);
        this.periodFoldingDataSubject.next(this.pulsarData);
    }

    getChartPulsarDataArray(): (number | null)[][] {
        //if (this.getPulsarStar() === PulsarStarOptions.NONE) {
          //  return [];
        //} 
        if (this.getPulsarStar() === PulsarStarOptions.SOURCE1) {
            return this.getData().filter((row: PulsarDataDict) =>
                row.jd !== null && row.source1 !== null && row.source2 !== null)
                .map((row: PulsarDataDict) => [row.jd, row.source1!, row.source2!])
        } else {
            return this.getData().filter((row: PulsarDataDict) =>
                row.jd !== null && row.source1 !== null && row.source2 !== null)
                .map((row: PulsarDataDict) => [row.jd, row.source2!, row.source1!])
        }
    }

    /** MyData implementation */

    addRow(index: number, amount: number): void {
        this.pulsarData.addRow(index, amount);
        this.pulsarStorage.saveData(this.pulsarData.getData());
        this.dataSubject.next(this.pulsarData);
    }

    getData(): PulsarDataDict[] {
        return this.pulsarData.getData();
    }

    getDataArray(): (number | null)[][] {
        return this.pulsarData.getDataArray();
    }

    getChartSourcesDataArray(): (number | null)[][][] {
        return [
          this.pulsarData.getData().filter(
            (entry: PulsarDataDict) => entry.jd !== null && entry.source1 !== null)
            .map(
              (entry: PulsarDataDict) => [entry.jd, entry.source1]),
          this.pulsarData.getData().filter(
            (entry: PulsarDataDict) => entry.jd !== null && entry.source2 !== null)
            .map(
              (entry: PulsarDataDict) => [entry.jd, entry.source2])
        ]
      }
    
/*
    public setData(dataDict: PulsarDataDict[]): void {
        this.pulsarData.setData(dataDict);
        this.dataSubject.next(this.getData());
        return this.pulsarData.getChartSourcesDataArray();
    }
        */

    getChartPeriodogramDataArray(start: number, end: number): { data1: number[][], data2?: number[][]} {
        const pulsarData = this.getChartPulsarDataArray();
        console.log('Pulsar periodgram data:', pulsarData);
    
        // Filter valid data for the first two columns
        const validData = this.getData().filter((row: PulsarDataDict) => 
            row.jd !== null && row.source1 !== null
        );
    
        // Extract data for each column
        const jd: number[] = validData.map((entry) => entry.jd!) as number[];
        const mag1: number[] = validData.map((entry) => entry.source1!) as number[];
    
        // Check for the third column (if present and not null)
        const mag2: number[] = validData.map((entry) => entry.source2).filter(value => value !== null) as number[];
    
        const points: number = this.getPeriodogramPoints();
        const method: boolean = this.getPeriodogramMethod();
    
        // Generate periodograms for each series
        const periodogram1 = lombScargle(jd, mag1, start, end, points, method);
    
        let periodogram2: number[][] | undefined = undefined;
        if (mag2.length > 0) {
            periodogram2 = lombScargle(jd, mag2, start, end, points, method);
        }
    
        // Return all periodograms
        return {
            data1: periodogram1,
            data2: periodogram2
        };
    }
    

    removeRow(index: number, amount: number): void {
        this.pulsarData.removeRow(index, amount);
        this.pulsarStorage.saveData(this.pulsarData.getData());
        this.dataSubject.next(this.pulsarData);
        this.periodogramDataSubject.next(this.pulsarData);
        this.periodFoldingDataSubject.next(this.pulsarData);
    }
/*
    // Reset Methods
    public resetData(): void {
        const defaultData = PulsarData.getDefaultDataAsArray();
        this.setData(defaultData);
        this.setCombinedData(defaultData)
        this.dataSubject.next(this.getData());
    }
*/
median(arr: number[]) {
    arr = arr.filter(num => !isNaN(num));
    const mid = Math.floor(arr.length / 2);
    const nums = arr.sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

backgroundSubtraction(frequency: number[], flux: number[], dt: number): number[] {
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
    return subtracted;
    }    

    setData(data: any[]): void {
        this.pulsarData.setData(data);
        this.pulsarStorage.saveData(this.pulsarData.getData());
        this.dataSubject.next(this.pulsarData);
        this.periodogramDataSubject.next(this.pulsarData);
        this.periodFoldingDataSubject.next(this.pulsarData);
    }

    resetData(): void {
        this.pulsarData.setData(PulsarData.getDefaultDataDict());
        this.setCombinedData(this.pulsarData.getData());
        this.pulsarStorage.saveData(this.pulsarData.getData());
        this.dataSubject.next(this.pulsarData);
        this.periodogramDataSubject.next(this.pulsarData);
        this.periodFoldingDataSubject.next(this.pulsarData);
    }

    setHighChartLightCurve(highChart: Highcharts.Chart): void {
        this.highChartLightCurve = highChart;
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
    if (this.combinedDataSubject.value == null) {
        
        console.log("combinedDataSubject is null", this.combinedDataSubject.value);
        return this.getData();
      } else {
        
        console.log("combinedDataSubject is not null", this.getData());
        return this.combinedDataSubject.value;
      }
    }

    getHighChartLightCurve(): Highcharts.Chart {
        return this.highChartLightCurve;
    }

    setHighChartPeriodogram(highChart: Highcharts.Chart): void {
        this.highChartPeriodogram = highChart;
    }

    getHighChartPeriodogram(): Highcharts.Chart {
        return this.highChartPeriodogram;
    }

    setHighChartPeriodFolding(highChart: Highcharts.Chart): void {
        this.highChartPeriodFolding = highChart;
    }

    getHighChartPeriodFolding(): Highcharts.Chart {
        return this.highChartPeriodFolding;
    }

    private getDefaultDataLabel(): string {
        return `Pulsar Star Mag - Reference Star Mag)`
    }

    sonification(xValues: number[], yValues: number[], lengthInSeconds: number) {
        const numSamples = xValues.length;
        const sampleRate = Math.floor(numSamples / lengthInSeconds);
        const numChannels = 1;  // Mono
        const bitsPerSample = 16;
        const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
        const blockAlign = numChannels * (bitsPerSample / 8);
        const dataSize = numSamples * numChannels * (bitsPerSample / 8);
        const chunkSize = 36 + dataSize;
    
        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);
    
        // Write the RIFF header
        this.writeString(view, 0, 'RIFF');
        view.setUint32(4, chunkSize, true);
        this.writeString(view, 8, 'WAVE');
    
        // fmt sub-chunk
        this.writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);  // Subchunk1Size (PCM)
        view.setUint16(20, 1, true);   // Audio format (PCM)
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, byteRate, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitsPerSample, true);
    
        // data sub-chunk
        this.writeString(view, 36, 'data');
        view.setUint32(40, dataSize, true);
    
        // Write audio samples (assuming yValues are normalized between -1 and 1)
        const offset = 44;
        for (let i = 0; i < numSamples; i++) {
            let sample = Math.max(-1, Math.min(1, yValues[i])); // Clamp values
            let intSample = sample * 32767; // Convert to 16-bit integer
            view.setInt16(offset + i * 2, intSample, true);
        }
    
        // Create Blob and trigger download
        const blob = new Blob([buffer], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated.wav';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Helper function to write strings into DataView
    writeString(view: DataView, offset: number, string: string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
}
