import {Injectable} from '@angular/core';
import {IsochroneParams, PlotConfig, PlotFraming, PlotParams} from "../cluster.util";
import {ClusterStorageService} from "../storage/cluster-storage.service";
import {Subject} from "rxjs";

@Injectable()
export class ClusterIsochroneService {
    public plotParamsSubject: Subject<PlotParams> = new Subject<PlotParams>();
    public plotParams$ = this.plotParamsSubject.asObservable();
    public isochroneParamsSubject: Subject<IsochroneParams> = new Subject<IsochroneParams>();
    public isochroneParams$ = this.isochroneParamsSubject.asObservable();
    public maxMagErrorSubject: Subject<number> = new Subject<number>();
    public maxMagError$ = this.maxMagErrorSubject.asObservable();
    private plotConfigs: PlotConfig[];
    private plotParams: PlotParams;
    private isochroneParams: IsochroneParams;
    private maxMagError: number;
    private addPlotConfigSubject: Subject<PlotConfig[]> = new Subject<PlotConfig[]>();
    public addPlotConfig$ = this.addPlotConfigSubject.asObservable();
    private plotConfigSubject: Subject<PlotConfig[]> = new Subject<PlotConfig[]>();
    public plotConfig$ = this.plotConfigSubject.asObservable();

    constructor(private storageService: ClusterStorageService) {
        this.plotConfigs = this.storageService.getPlotConfigs();
        this.plotParams = this.storageService.getPlotParams();
        this.isochroneParams = this.storageService.getIsochroneParams();
        this.maxMagError = this.storageService.getMaxMagError();
    }

    public getIsochroneParams() {
        return this.isochroneParams;
    }

    public setIsochroneParams(isochroneParams: IsochroneParams) {
        this.isochroneParams = isochroneParams;
        this.storageService.setIsochroneParams(isochroneParams);
        this.isochroneParamsSubject.next(this.isochroneParams);
    }

    public getMaxMagError() {
        return this.maxMagError;
    }

    public setMaxMagError(maxMagError: number) {
        this.maxMagError = maxMagError;
        this.storageService.setMaxMagError(maxMagError);
        this.maxMagErrorSubject.next(this.maxMagError);
    }

    public getPlotParams() {
        return this.plotParams;
    }

    public setPlotParams(plotParams: PlotParams) {
        this.plotParams = plotParams;
        this.storageService.setPlotParams(plotParams);
        this.plotParamsSubject.next(this.plotParams);
    }

    public getPlotConfigs() {
        return this.plotConfigs;
    }

    public setPlotConfigs(plotConfigs: PlotConfig[]) {
        this.plotConfigs = plotConfigs;
        this.storageService.setPlotConfigs(plotConfigs);
        this.plotConfigSubject.next(this.plotConfigs);
    }

    public addPlotConfigs(plotConfig: PlotConfig) {
        this.plotConfigs.push(plotConfig);
        this.storageService.setPlotConfigs(this.plotConfigs);
        this.addPlotConfigSubject.next(this.plotConfigs);
        this.plotConfigSubject.next(this.plotConfigs);
    }

    public updatePlotFraming(plotFraming: PlotFraming, index: number) {
        this.plotConfigs[index].plotFraming = plotFraming;
        this.storageService.setPlotConfigs(this.plotConfigs);
    }
}
