import {Injectable} from '@angular/core';
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

    PulsarStorage
} from "./pulsar.service.util";
import {BehaviorSubject} from "rxjs";
import {MyData} from "../shared/data/data.interface";
import {ChartInfo} from "../shared/charts/chart.interface";
import * as Highcharts from "highcharts";
import {floatMod, lombScargleWithError, UpdateSource} from "../shared/data/utils";

@Injectable()
export class PulsarService implements MyData, PulsarInterface, ChartInfo, PulsarPeriodogramInterface, PulsarPeriodFoldingInterface {
    private pulsarData: PulsarData = new PulsarData();
    private pulsarInterface: PulsarInterfaceImpl = new PulsarInterfaceImpl();
    private pulsarChartInfo: PulsarChartInfo = new PulsarChartInfo();
    private pulsarPeriodogram: PulsarPeriodogram = new PulsarPeriodogram();
    private pulsarPeriodFolding: PulsarPeriodFolding = new PulsarPeriodFolding();

    private pulsarStorage: PulsarStorage = new PulsarStorage();

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

    constructor() {
        this.pulsarData.setData(this.pulsarStorage.getData());
        this.pulsarInterface.setStorageObject(this.pulsarStorage.getInterface());
        this.pulsarChartInfo.setStorageObject(this.pulsarStorage.getChartInfo());
        this.pulsarPeriodogram.setPeriodogramStorageObject(this.pulsarStorage.getPeriodogram());
        this.pulsarPeriodFolding.setPeriodFoldingStorageObject(this.pulsarStorage.getPeriodFolding());
        this.tabIndex = this.pulsarStorage.getTabIndex();
    }

    /** PeriodFolding Interface */


    getPeriodFoldingDisplayPeriod(): PulsarDisplayPeriod {
        return this.pulsarPeriodFolding.getPeriodFoldingDisplayPeriod();
    }

    getPeriodFoldingPeriod(): number {
        if (this.pulsarPeriodFolding.getPeriodFoldingPeriod() < 0)
            return this.getjdRange();
        else
            return this.pulsarPeriodFolding.getPeriodFoldingPeriod();
    }

    getPeriodFoldingPhase(): number {
        return this.pulsarPeriodFolding.getPeriodFoldingPhase();
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
/*
    getPeriodFoldingChartDataWithError(): { [key: string]: number[][] } {
        const data = this.getChartPulsarDataArray()
            .filter((entry) => entry[0] !== null)
            .sort((a, b) => a[0]! - b[0]!);
        const error = this.getChartPulsarErrorArray()
            .filter((entry) => entry[0] !== null)
            .sort((a, b) => a[0]! - b[0]!);
        const minjd = data[0][0]!;
        const period = this.getPeriodFoldingPeriod();
        const phase = this.getPeriodFoldingPhase();
        let pfData: number[][] = [];
        let pfError: number[][] = [];
        if (period !== 0 && period !== null) {
            for (let i = 0; i < data.length; i++) {
                let temp_x = phase * period + floatMod((data[i][0]! - minjd), period);
                if (temp_x > period) {
                    temp_x -= period;
                }
                pfData.push([temp_x, data[i][1]!]);
                pfError.push([temp_x, error[i][1]!, error[i][2]!]);
                if (this.getPeriodFoldingDisplayPeriod() === PulsarDisplayPeriod.TWO) {
                    let new_x = temp_x + parseFloat(period as any);
                    pfData.push([new_x, data[i][1]!]);
                    pfError.push([new_x, error[i][1]!, error[i][2]!]);
                }
            }
        }
        pfData.sort((a, b) => b[0] - a[0]);
        pfError.sort((a, b) => b[0] - a[0]);
        return {data: pfData, error: pfError};
    }
*/

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

    getjdRange(): number {
        const jdArray = this.getData().map((row: PulsarDataDict) => row.jd)
            .filter((jd: number | null) => jd !== null) as number[];
        return parseFloat((Math.max(...jdArray) - Math.min(...jdArray)).toFixed(4));
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
 {
            if (this.pulsarChartInfo.getDataLabel() === PulsarChartInfo.defaultHash) {
                return this.getDefaultDataLabel();
            } else {
                return this.pulsarChartInfo.getDataLabel();
            }
        }
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
{
            this.pulsarChartInfo.setDataLabel(data);
        }
        this.pulsarStorage.saveChartInfo(this.pulsarChartInfo.getStorageObject());
        this.chartInfoSubject.next(this.pulsarChartInfo);
        this.dataSubject.next(this.pulsarData);
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
        this.pulsarStorage.saveInterface(this.pulsarInterface.getStorageObject());
        this.interfaceSubject.next(this.pulsarInterface);
        this.chartInfoSubject.next(this.pulsarChartInfo);
        this.periodogramDataSubject.next(this.pulsarData);
        this.periodFoldingDataSubject.next(this.pulsarData);
    }


    /** PulsarInterface implementation */


    getbackScale(): number {
        return this.pulsarInterface.getbackScale();
    }

    setReferenceStarMagnitude(backScale: number): void {
        this.pulsarInterface.setbackScale(backScale);
        this.pulsarStorage.saveInterface(this.pulsarInterface.getStorageObject());
        this.interfaceSubject.next(this.pulsarInterface);
        this.chartInfoSubject.next(this.pulsarChartInfo);
        this.dataSubject.next(this.pulsarData);
        this.periodogramFormSubject.next(this.pulsarPeriodogram);
        this.periodogramDataSubject.next(this.pulsarData);
        this.periodFoldingFormSubject.next(UpdateSource.INIT);
        this.periodFoldingDataSubject.next(this.pulsarData);
    }

    getReferenceStarMagnitude(): number {
        return this.pulsarInterface.getbackScale();
    }

    getIsLightCurveOptionValid(): boolean {
        return this.pulsarInterface.getIsLightCurveOptionValid();
    }

    setLightCurveOptionValid(valid: boolean): void {
        this.pulsarInterface.setLightCurveOptionValid(valid);
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
        return this.pulsarData.getChartSourcesDataArray();
    }

    getChartSourcesErrorArray(): (number | null)[][][] {
        return this.pulsarData.getChartSourcesErrorArray();
    }

/*
    getChartPeriodogramDataArray(start: number, end: number): (number | null)[][] {
        const pulsarData = this.getChartsourcesDataArray();
        const data = this.getData().filter((row: PulsarDataDict) => row.jd !== null && row.source1 !== null && row.source2 !== null)
        const jd = pulsarData.map((entry) => entry[0]) as number[];
        const mag: number[] = pulsarData.map((entry) => entry[1]) as number[];
        // Maximum points for html2canvas to successfully render is 2000
        return lombScargleWithError(jd, mag, [start], end, 2000);
    } */

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
        data[1] = this.backgroundSubtraction(data[0], data[1], this.getbackScale());
        data[2]= this.backgroundSubtraction(data[0], data[2], this.getbackScale());
        this.pulsarData.setData(data);
        this.pulsarStorage.saveData(this.pulsarData.getData());
        this.dataSubject.next(this.pulsarData);
        this.periodogramDataSubject.next(this.pulsarData);
        this.periodFoldingDataSubject.next(this.pulsarData);
    }

    resetData(): void {
        this.pulsarData.setData(PulsarData.getDefaultDataDict());
        this.pulsarStorage.saveData(this.pulsarData.getData());
        this.dataSubject.next(this.pulsarData);
        this.periodogramDataSubject.next(this.pulsarData);
        this.periodFoldingDataSubject.next(this.pulsarData);
    }

    setHighChartLightCurve(highChart: Highcharts.Chart): void {
        this.highChartLightCurve = highChart;
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

    setTabIndex(index: number): void {
        this.tabIndex = index;
        this.pulsarStorage.saveTabIndex(this.tabIndex);
    }

    getTabIndex(): number {
        return this.tabIndex;
    }

    private getDefaultDataLabel(): string {
        return `Pulsar Star Mag + (${this.getReferenceStarMagnitude()} - Reference Star Mag)`
    }

}
