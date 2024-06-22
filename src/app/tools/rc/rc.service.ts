import { Injectable } from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {UpdateSource} from "../shared/data/utils";
import {
    channel,
    spectrum,
    gainCalibration,
    imageCoordinate,
    timeDelayOption,
    frequencyRangePreset,
    rfiSubPreset,
    surfaceModel,
    surfaceModelScale,
    RcInterfaceInfo
} from "./rc.service.util";


@Injectable()
export class RcService {

    private RcInterfaceInfo: RcInterfaceInfo = new RcInterfaceInfo();

    private interfaceInfoSubject: BehaviorSubject<RcInterfaceInfo> = new BehaviorSubject<RcInterfaceInfo>(this.RcInterfaceInfo);
    public interfaceInfo$ = this.interfaceInfoSubject.asObservable();

    constructor() {
    }

    /** Interface Get Methods */

    getName(): string {
        return this.RcInterfaceInfo.getName();
    }

    getChannel(): channel {
        return this.RcInterfaceInfo.getChannel();
    }

    getSpectrum(): spectrum {
        return this.RcInterfaceInfo.getSpectrum();
    }

    getGainCalibration(): gainCalibration {
        return this.RcInterfaceInfo.getGainCalibration();
    }

    getImageCoordinate(): imageCoordinate {
        return this.RcInterfaceInfo.getImageCoordinate();
    }

    getTimeDelayOption(): timeDelayOption {
        return this.RcInterfaceInfo.getTimeDelayOption();
    }

    getIncludeRawImage(): boolean {
        return this.RcInterfaceInfo.getIncludeRawImage();
    }

    getFrequencyRangePreset(): frequencyRangePreset {
        return this.RcInterfaceInfo.getFrequencyRangePreset();
    }

    getMinFrequency(): number {
        return this.RcInterfaceInfo.getMinFrequency();
    }

    getMaxFrequency(): number {
        return this.RcInterfaceInfo.getMaxFrequency();
    }

    getSkipFrequency(): boolean {
        return this.RcInterfaceInfo.getSkipFrequency();
    }

    getMinFrequencySkip(): Array<number> {
        return this.RcInterfaceInfo.getMinFrequencySkip();
    }

    getMaxFrequencySkip(): Array<number> {
        return this.RcInterfaceInfo.getMaxFrequencySkip();
    }

    getOneDBkgSub(): number {
        return this.RcInterfaceInfo.getOneDBkgSub();
    }

    getRfiSubPreset(): rfiSubPreset {
        return this.RcInterfaceInfo.getRfiSubPreset();
    }

    getRfiSubScale(): number {
        return this.RcInterfaceInfo.getRfiSubScale();
    }

    getSurfaceModel(): surfaceModel {
        return this.RcInterfaceInfo.getSurfaceModel();
    }

    getSurfaceModelScale(): surfaceModelScale {
        return this.RcInterfaceInfo.getSurfaceModelScale();
    }

    /** Interface Set Methods */

    setName(name: string): void {
        this.RcInterfaceInfo.setName(name);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setChannel(channel: channel): void {
        this.RcInterfaceInfo.setChannel(channel);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setSpectrum(spectrum: spectrum): void {
        this.RcInterfaceInfo.setSpectrum(spectrum);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setGainCalibration(gainCalibration: gainCalibration): void {
        this.RcInterfaceInfo.setGainCalibration(gainCalibration);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setImageCoordinate(imageCoordinate: imageCoordinate): void {
        this.RcInterfaceInfo.setImageCoordinate(imageCoordinate);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setTimeDelayOption(timeDelayOption: timeDelayOption): void {
        this.RcInterfaceInfo.setTimeDelayOption(timeDelayOption);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setIncludeRawImage(includeRawImage: boolean): void {
        this.RcInterfaceInfo.setIncludeRawImage(includeRawImage);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setFrequencyRangePreset(frequencyRangePreset: frequencyRangePreset): void {
        this.RcInterfaceInfo.setFrequencyRangePreset(frequencyRangePreset);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setMinFrequency(minFrequency: number): void {
        this.RcInterfaceInfo.setMinFrequency(minFrequency);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setMaxFrequency(maxFrequency: number): void {
        this.RcInterfaceInfo.setMaxFrequency(maxFrequency);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setSkipFrequency(skipFrequency: boolean): void {
        this.RcInterfaceInfo.setSkipFrequency(skipFrequency);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setMinFrequencySkip(minFrequencySkip: Array<number>): void {
        this.RcInterfaceInfo.setMinFrequencySkip(minFrequencySkip);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setMaxFrequencySkip(maxFrequencySkip: Array<number>): void {
        this.RcInterfaceInfo.setMaxFrequencySkip(maxFrequencySkip);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setOneDBkgSub(oneDBkgSub: number): void {
        this.RcInterfaceInfo.setOneDBkgSub(oneDBkgSub);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setRfiSubPreset(rfiSubPreset: rfiSubPreset): void {
        this.RcInterfaceInfo.setRfiSubPreset(rfiSubPreset);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setRfiSubScale(rfiSubScale: number): void {
        this.RcInterfaceInfo.setRfiSubScale(rfiSubScale);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setSurfaceModel(surfaceModel: surfaceModel): void {
        this.RcInterfaceInfo.setSurfaceModel(surfaceModel);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    setSurfaceModelScale(surfaceModelScale: surfaceModelScale): void {
        this.RcInterfaceInfo.setSurfaceModelScale(surfaceModelScale);
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    /** Form Methods */

    resetForm(): void {
        this.RcInterfaceInfo = new RcInterfaceInfo();
        this.interfaceInfoSubject.next(this.RcInterfaceInfo);
    }

    submitForm(): void {
        console.log("Form Submitted!")
        console.log("RC Job Info:")
        console.log(this.RcInterfaceInfo);
    }

}