import {Injectable} from '@angular/core';
import {PlotConfig} from "../cluster.util";
import {ClusterStorageService} from "../storage/cluster-storage.service";
import {Subject} from "rxjs";

@Injectable()
export class ClusterIsochroneService {
    private plotConfigs: PlotConfig[];
    private plotConfigSubject: Subject<PlotConfig[]> = new Subject<PlotConfig[]>();
    public plotConfig$ = this.plotConfigSubject.asObservable();

    constructor(private storageService: ClusterStorageService) {
        this.plotConfigs = this.storageService.getPlotConfigs();
    }

    public getPlotConfigs() {
        return this.plotConfigs;
    }

    public setPlotConfigs(plotConfigs: PlotConfig[]) {
        this.plotConfigs = plotConfigs;
        this.storageService.setPlotConfigs(plotConfigs);
    }

    public addPlotConfigs(plotConfig: PlotConfig) {
        this.plotConfigs.push(plotConfig);
        this.storageService.setPlotConfigs(this.plotConfigs);
        this.plotConfigSubject.next(this.plotConfigs);
    }
}
