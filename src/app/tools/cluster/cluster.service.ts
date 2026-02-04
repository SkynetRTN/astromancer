import {Injectable} from '@angular/core';
import {ClusterStorageService} from "./storage/cluster-storage.service";
import {BehaviorSubject, Subject, take} from "rxjs";
import {FsrParameters} from "./FSR/fsr.util";
import {ClusterDataService} from "./cluster-data.service";
import * as Highcharts from "highcharts";
import {ECharts} from "echarts";

@Injectable()
export class ClusterService {
    private clusterName: string = '';
    private fsrParams: FsrParameters;
    private fsrFraming: FsrParameters;
    private fsrParamsSubject: Subject<FsrParameters> = new Subject<FsrParameters>();
    fsrParams$ = this.fsrParamsSubject.asObservable();
    private fsrFramingSubject: Subject<FsrParameters> = new Subject<FsrParameters>();
    fsrFraming$ = this.fsrFramingSubject.asObservable();
    private tabIndexSubject: Subject<number> = new Subject<number>();
    tabIndex$ = this.tabIndexSubject.asObservable();
    private resetSubject: Subject<void> = new Subject<void>();
    reset$ = this.resetSubject.asObservable();
    private loadingSubject: Subject<boolean> = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    private fsrCharts: (Highcharts.Chart | null)[] = [null, null, null, null];
    private fsrECharts: (ECharts | null)[] = [null, null, null, null];

    constructor(
        private dataService: ClusterDataService,
        private storageService: ClusterStorageService) {
        this.clusterName = this.storageService.getName();
        this.fsrParams = this.storageService.getFsrParams();
        this.fsrFraming = this.storageService.getFsrFraming();
    }

    getFsrParams(): FsrParameters {
        return this.fsrParams;
    }

    setFsrParams(params: FsrParameters) {
        this.fsrParams = params;
        this.dataService.setFSRCriteria(params);
        this.fsrParamsSubject.next(params);
    }

    setFsrFraming(params: FsrParameters) {
        this.fsrFraming = params;
        this.fsrFramingSubject.next(params);
        this.storageService.setFsrFraming(params);
    }

    getFsrFraming(): FsrParameters {
        return this.fsrFraming;
    }

    reset() {
        this.setClusterName('');
        this.setFsrParams({
            distance: null,
            pm_ra: null,
            pm_dec: null
        });
        this.setFsrFraming({
            distance: null,
            pm_ra: null,
            pm_dec: null
        });
    }

    triggerReset() {
        this.resetSubject.next();
    }

    setClusterName(name: string) {
        this.clusterName = name;
        this.storageService.setName(name);
    }

    getClusterName() {
        return this.clusterName;
    }

    setTabIndex(index: number) {
        this.tabIndexSubject.next(index);
        this.storageService.setTabIndex(index);
    }

    getTabIndex(): number {
        return this.storageService.getTabIndex();
    }

    setLoading(loading: boolean) {
        this.loadingSubject.next(loading);
    }

    setFsrCharts(chart: (Highcharts.Chart | null), index: number) {
        this.fsrCharts[index] = chart;
    }

    getFsrCharts(): (Highcharts.Chart)[] {
        return this.fsrCharts as Highcharts.Chart[];
    }

    setFsrECharts(chart: (ECharts | null), index: number) {
        this.fsrECharts[index] = chart;
    }

    getFsrECharts(): ECharts[] {
        return this.fsrECharts.filter((chart) => chart !== null) as ECharts[];
    }
}
