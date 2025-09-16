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

    isPlaying = false;
    private audioCtx: AudioContext | null = null;
    private audioSource: AudioBufferSourceNode | OscillatorNode | null = null;

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
    private isComputingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isComputing$ = this.isComputingSubject.asObservable();



    private highChartLightCurve!: Highcharts.Chart;
    private highChartPeriodogram!: Highcharts.Chart;
    private highChartPeriodFolding!: Highcharts.Chart;
    private tabIndex: number;
    LightCurveOptionValid: boolean = true;

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
    
    LightCurveOptionValidSubject = new BehaviorSubject<boolean>(true);
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

    getPeriodFoldingSpeed(): number {
        return this.pulsarPeriodFolding.getPeriodFoldingSpeed();
    }

    getPeriodFoldingBins(): number {
        return this.pulsarPeriodFolding.getPeriodFoldingBins();
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

    setPeriodFoldingSpeed(speed: number): void {
        this.pulsarPeriodFolding.setPeriodFoldingSpeed(speed);
        this.pulsarStorage.savePeriodFolding(this.pulsarPeriodFolding.getPeriodFoldingStorageObject());
        this.periodFoldingFormSubject.next(UpdateSource.INTERFACE);
        this.periodFoldingDataSubject.next(this.pulsarData);
    }

    setPeriodFoldingBins(bins: number): void {
        this.pulsarPeriodFolding.setPeriodFoldingBins(bins);
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
        const data = this.getChartPulsarDataArray()
            .filter((entry) => entry[0] !== null) 
            .sort((a, b) => a[0]! - b[0]!);
    
        const minJD = data[0][0]!;
        const period = Number(this.getPeriodFoldingPeriod());
        const phase = this.getPeriodFoldingPhase();

        // Initialize arrays for two series
        let pfData1: number[][] = []; // For source1
        let pfData2: number[][] = []; // For source2 (optional)
    
        if (period !== 0 && period !== null) {
            for (let i = 0; i < data.length; i++) {
                // Calculate x-axis (phase folded JD)
                let temp_x = period + floatMod((data[i][0]! - minJD), period);
                if (temp_x > period) {
                    temp_x -= period;
                }
    
                pfData1.push([temp_x, data[i][1]!]);
    
                if (data[i][2] !== null) {
                    pfData2.push([temp_x, data[i][2]!]);
                }
    
                // if (this.getPeriodFoldingDisplayPeriod() === PulsarDisplayPeriod.TWO) {
                //     let new_x = temp_x + parseFloat(period as any);
    
                //     // Push second cycle for series 1
                //     pfData1.push([new_x, data[i][1]!]);
    
                //     // Push second cycle for series 2 if not null
                //     if (data[i][2] !== null) {
                //         pfData2.push([new_x, data[i][2]!]);
                //     }
                // }
            }
        }
   
        pfData1.sort((a, b) => b[0] - a[0]);
        pfData2.sort((a, b) => b[0] - a[0]);

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

    getPeriodogramStartPeriodLabel(): string {
        return this.pulsarPeriodogram.getPeriodogramStartPeriodLabel();
    }

    getPeriodogramEndPeriodLabel(): string {
        return this.pulsarPeriodogram.getPeriodogramEndPeriodLabel();
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

    setPeriodogramStartPeriodLabel(startPeriodLabel: string): void {
        this.pulsarPeriodogram.setPeriodogramStartPeriodLabel(startPeriodLabel);
        this.pulsarStorage.savePeriodogram(this.pulsarPeriodogram.getPeriodogramStorageObject());
        this.periodogramFormSubject.next(this.pulsarPeriodogram);
        this.periodogramDataSubject.next(this.pulsarData);
    }

    setPeriodogramEndPeriodLabel(endPeriodLabel: string): void {
        this.pulsarPeriodogram.setPeriodogramEndPeriodLabel(endPeriodLabel);
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

    compute(compute: boolean) {
        if (this.isComputingSubject.getValue() == false) {
            this.isComputingSubject.next(true)
        } else if (this.isComputingSubject.getValue() == true) {
            this.isComputingSubject.next(false)
        }
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
            startPeriodLabel = 'Start Frequency (Hz)';
            endPeriodLabel = 'End Frequency (Hz)';
            this.setPeriodogramEndPeriod(1 / currentStart);
            this.setPeriodogramStartPeriod(1 / currentEnd);
            this.setPeriodogramXAxisLabel('Period (Hz)');
        } else {
            startPeriodLabel = 'Start Period (sec)';
            endPeriodLabel = 'End Period (sec)';
            this.setPeriodogramEndPeriod(1 / currentStart);
            this.setPeriodogramStartPeriod(1 / currentEnd);
            this.setPeriodogramXAxisLabel('Period (sec)');
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
        this.pulsarChartInfo.setDataLabel(data);
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
        return this.getData().filter((row: PulsarDataDict) =>
            row.jd !== null && row.source1 !== null && row.source2 !== null)
            .map((row: PulsarDataDict) => [row.jd, row.source1!, row.source2!] as [number,number,number])
    }

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
    

    // public setData(dataDict: PulsarDataDict[]): void {
    //     this.pulsarData.setData(dataDict);
    //     this.dataSubject.next(this.getData());
    //     return this.pulsarData.getChartSourcesDataArray();
    // }
        

    getChartPeriodogramDataArray(start: number, end: number): { data1: number[][], data2?: number[][]} {
        const pulsarData = this.getChartPulsarDataArray();
    
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

        return this.getData();
      } else {
        
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
        return `Pulsar Star`
    }

    binData(data: number[][], bins: number): number[][] {
        if (data.length === 0) return [];
      
        // Retrieve the phase value
        const phase = this.getPeriodFoldingPhase();
        const period = this.getPeriodFoldingPeriod();
    
        // Calculate bin size
        const xMin = Math.min(...data.map(point => point[0]));
        const xMax = Math.max(...data.map(point => point[0]));
        const binSize = (xMax - xMin) / bins;
      
        // Initialize bins
        const binnedData: { x: number; ySum: number; count: number }[] = Array(bins)
          .fill(0)
          .map((_, index) => ({
            // Shift bin center by phase
            x: xMin + index * binSize + binSize / 2,
            ySum: 0,
            count: 0,
          }));
      
        // Populate bins
        data.forEach(([x, y]) => {
          const binIndex = Math.floor((x - xMin) / binSize);
          if (binIndex >= 0 && binIndex < bins) {
            binnedData[binIndex].ySum += y;
            binnedData[binIndex].count += 1;
          }
        });
      
        // Compute averages
        return binnedData
          .filter(bin => bin.count > 0) // Ignore empty bins
          .map(bin => [bin.x, bin.ySum / bin.count]);
    }


    sonification(
        xValues: number[],
        yValues: number[],
        yValues2: number[] | null,
        period: number
    ) {
        if (yValues.length === 0) {
            console.error("No data to sonify.");
            return;
        }

        const cal = this.getPeriodFoldingCal();
        const originalPeriod = period;
        const sampleRate = 44100;
        const durationSeconds = 60;
        const numChannels = yValues2 ? 2 : 1;

        // --- Period folding ---
        period *= 1 / this.getPeriodFoldingSpeed();

        // --- Joint normalization across channels ---
        const normalize = (arr: number[]) => {
            const min = Math.min(...arr);
            const max = Math.max(...arr);
            return arr.map(y => (y - min) / (max - min || 1));
        };

        const normY1 = normalize(yValues);
        const normY2 = yValues2 ? normalize(yValues2) : null;

        // --- Adaptive interpolation ---
        const minSamplesPerCycle = Math.max(64, Math.floor(sampleRate / (1 / period)));
        const interpFactor = Math.ceil(minSamplesPerCycle / normY1.length);
        const interpolateArray = (arr: number[]) => this.interpolateLinear(arr, interpFactor);

        const audioData1 = new Float32Array(durationSeconds * sampleRate);
        const audioData2 = numChannels === 2 ? new Float32Array(durationSeconds * sampleRate) : null;
        
        // --- Generate audio ---
        const frequency = 1 / period;
        if (frequency < 400) {
            // --- Burst mode (TV static style) ---
            const interp1 = interpolateArray(normY1);
            const interp2 = normY2 ? interpolateArray(normY2) : null;

            const numPoints = interp1.length;
            const durationPerPoint = period / numPoints;
            const samplesPerPoint = Math.max(1, Math.floor(sampleRate * durationPerPoint));
            const totalSamples = audioData1.length;

            for (let i = 0; i < totalSamples; i++) {
                // Pick index into interpolated data
                const pointIndex = Math.floor((i % (numPoints * samplesPerPoint)) / samplesPerPoint);

                // Amplitude modulation values [0..1]
                const amp1 = interp1[Math.min(pointIndex, numPoints - 1)];
                const amp2 = interp2 ? interp2[Math.min(pointIndex, numPoints - 1)] : 0;

                // White noise carrier [-1..1]
                const noise1 = Math.random() * 2 - 1;
                const noise2 = Math.random() * 2 - 1; // independent stereo noise (optional)

                // Modulate noise by data
                audioData1[i] = noise1 * amp1;
                if (numChannels === 2 && interp2) {
                    audioData2![i] = noise2 * amp2 * cal;
                }
            }
        } else {
            // Waveform mode
            const interp1 = interpolateArray(normY1);
            const interp2 = normY2 ? interpolateArray(normY2) : null;
            const numPoints = interp1.length;

            for (let i = 0; i < audioData1.length; i++) {
                const t = i / sampleRate;
                const phase = (t % period) / period;
                const index = Math.floor(phase * numPoints);
                audioData1[i] = interp1[index] * 2 - 1;
                if (numChannels === 2 && interp2) {
                    audioData2![i] = interp2[index] * 2 - 1;
                }
            }
        }

        let globalMaxAbs = 0;
        for (let i = 0; i < audioData1.length; i++) {
            globalMaxAbs = Math.max(globalMaxAbs, Math.abs(audioData1[i]));
            if (numChannels === 2 && audioData2) globalMaxAbs = Math.max(globalMaxAbs, Math.abs(audioData2[i]));
        }
        if (globalMaxAbs > 0) {
            const scale = 0.95 / globalMaxAbs;
            for (let i = 0; i < audioData1.length; i++) {
                audioData1[i] *= scale;
                if (numChannels === 2 && audioData2) audioData2[i] *= scale;
            }
        }

        // --- Convert to interleaved 16-bit PCM ---
        const int16Data = new Int16Array(audioData1.length * numChannels);
        const gain = 1;
        for (let i = 0; i < audioData1.length; i++) {
            int16Data[i * numChannels] = Math.floor(audioData1[i] * gain * 32767);
            if (numChannels === 2 && audioData2) {
                int16Data[i * 2 + 1] = Math.floor(audioData2[i] * gain * 32767);
            }
        }

        // --- Write WAV header ---
        const bytesPerSample = 2;
        const dataSize = int16Data.length * bytesPerSample;
        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);

        this.writeString(view, 0, "RIFF");
        view.setUint32(4, 36 + dataSize, true);
        this.writeString(view, 8, "WAVE");
        this.writeString(view, 12, "fmt ");
        view.setUint32(16, 16, true); // fmt chunk size
        view.setUint16(20, 1, true); // PCM format
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
        view.setUint16(32, numChannels * bytesPerSample, true);
        view.setUint16(34, 16, true);
        this.writeString(view, 36, "data");
        view.setUint32(40, dataSize, true);

        for (let i = 0, offset = 44; i < int16Data.length; i++, offset += 2) {
            view.setInt16(offset, int16Data[i], true);
        }

        // --- Download WAV ---
        const blob = new Blob([new Uint8Array(buffer)], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${originalPeriod}s_pulsar_sonification.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }


    sonificationBrowser(
        xValues: number[],
        yValues: number[],
        yValues2: number[] | null,
        period: number
    ) {
        if (this.isPlaying) {
            this.audioSource?.stop();
            this.audioCtx?.close();
            this.audioCtx = null;
            this.audioSource = null;
            this.isPlaying = false;
            return;
        }

        if (yValues.length === 0) {
            console.error("No data to sonify.");
            return;
        }

        const cal = this.getPeriodFoldingCal();
        const numChannels = yValues2 ? 2 : 1;
        const sampleRate = 44100;
        const durationSeconds = 60;

        // --- Apply period folding ---
        period *= 1 / this.getPeriodFoldingSpeed();

        // --- Apply calibration to yValues2 ---
        if (yValues2) {
            for (let i = 0; i < yValues2.length; i++) yValues2[i] *= cal;
        }

        // --- Normalize each channel separately to [0,1] ---
        const normalize = (arr: number[]) => {
            const min = Math.min(...arr);
            const max = Math.max(...arr);
            return arr.map(y => (y - min) / (max - min || 1));
        };

        const normY1 = normalize(yValues);
        const normY2 = yValues2 ? normalize(yValues2) : null;

        // --- Adaptive interpolation ---
        const frequency = 1 / period;
        const minSamplesPerCycle = Math.max(64, Math.floor(sampleRate / frequency));
        const interpFactor1 = Math.ceil(minSamplesPerCycle / normY1.length);
        const interpFactor2 = normY2 ? Math.ceil(minSamplesPerCycle / normY2.length) : 1;

        const interp1 = this.interpolateLinear(normY1, interpFactor1);
        const interp2 = normY2 ? this.interpolateLinear(normY2, interpFactor2) : null;

        const totalSamples = durationSeconds * sampleRate;
        const audioData1 = new Float32Array(totalSamples);
        const audioData2 = numChannels === 2 ? new Float32Array(totalSamples) : null;

        // --- Generate audio data ---
        if (frequency < 400) {
            // --- Burst mode using noise (TV static style) ---
            const numPoints1 = interp1.length;
            const numPoints2 = interp2 ? interp2.length : 0;

            const durationPerPoint1 = period / numPoints1;
            const samplesPerPoint1 = Math.max(1, Math.floor(sampleRate * durationPerPoint1));

            const durationPerPoint2 = interp2 ? period / numPoints2 : 1;
            const samplesPerPoint2 = interp2 ? Math.max(1, Math.floor(sampleRate * durationPerPoint2)) : 1;

            for (let i = 0; i < totalSamples; i++) {
                // White noise carrier in [-1,1]
                const noise = (Math.random() * 2 - 1);

                // Channel 1 (modulated noise)
                const idx1 = Math.floor((i % (numPoints1 * samplesPerPoint1)) / samplesPerPoint1);
                const volume1 = interp1[idx1]; // [0..1]
                audioData1[i] = noise * volume1;

                if (numChannels === 2 && interp2) {
                    // Channel 2 (separately modulated noise)
                    const idx2 = Math.floor((i % (numPoints2 * samplesPerPoint2)) / samplesPerPoint2);
                    const volume2 = interp2[idx2];
                    audioData2![i] = noise * volume2; // can also use independent noise if you want stereo "spread"
                }
            }
        } else {
            // Waveform mode
            for (let i = 0; i < totalSamples; i++) {
                const t = i / sampleRate;

                // Instead of forcing modulo, just advance through data naturally
                const idx1 = Math.floor((t / period) * interp1.length) % interp1.length;
                audioData1[i] = (interp1[idx1] * 2 - 1);

                if (numChannels === 2 && interp2) {
                    const idx2 = Math.floor((t / period) * interp2.length) % interp2.length;
                    audioData2![i] = (interp2[idx2] * 2 - 1);
                }
            }
        }

        // --- Normalize per channel to [-0.95, 0.95] ---
        const normalizeFloat32 = (arr: Float32Array) => {
            let maxAbs = 0;
            const gain = 0.7;
            for (const v of arr) maxAbs = Math.max(maxAbs, Math.abs(v));
            if (maxAbs > 0) {
                const scale = (0.95 / maxAbs) * gain;
                for (let i = 0; i < arr.length; i++) arr[i] *= scale;
            }
        };

        normalizeFloat32(audioData1);
        if (numChannels === 2 && audioData2) normalizeFloat32(audioData2);

        // --- AudioContext buffer setup ---
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const buffer = this.audioCtx.createBuffer(numChannels, totalSamples, sampleRate);
        buffer.getChannelData(0).set(audioData1);
        if (numChannels === 2 && audioData2) buffer.getChannelData(1).set(audioData2);

        this.audioSource = this.audioCtx.createBufferSource();
        this.audioSource.buffer = buffer;
        this.audioSource.loop = true;
        this.audioSource.connect(this.audioCtx.destination);
        this.audioSource.start();
        this.audioSource.stop(this.audioCtx.currentTime + durationSeconds);

        this.audioSource.onended = () => {
            this.isPlaying = false;
            this.audioCtx?.close();
            this.audioCtx = null;
            this.audioSource = null;
        };

        this.isPlaying = true;
    }


    interpolateLinear(data: number[], factor: number): number[] {
        const result: number[] = [];
        for (let i = 0; i < data.length - 1; i++) {
            const start = data[i];
            const end = data[i + 1];
            result.push(start);
            for (let j = 1; j <= factor; j++) {
                const t = j / (factor + 1);
                result.push(start * (1 - t) + end * t);
            }
        }
        result.push(data[data.length - 1]);
        return result;
    }    

    // Helper: Write a string to DataView
    writeString(view: DataView, offset: number, str: string) {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    }
    
    // Helper: Linearly resample data to new length
    resampleLinear(data: number[], newLength: number): number[] {
        const result = new Array(newLength);
        const oldLength = data.length;
        for (let i = 0; i < newLength; i++) {
            const t = i * (oldLength - 1) / (newLength - 1);
            const index = Math.floor(t);
            const frac = t - index;
            const v1 = data[index];
            const v2 = index + 1 < oldLength ? data[index + 1] : data[index];
            result[i] = v1 * (1 - frac) + v2 * frac;
        }
        return result;
    }    
}
