import {AfterViewInit, Component} from '@angular/core';
import {range} from "../histogram-slider-input/histogram-slider-input.component";
import {ClusterDataService} from "../../cluster-data.service";
import {Subject} from "rxjs";
import {FsrComponents, FsrHistogramPayload} from "../fsr.util";
import {ClusterService} from "../../cluster.service";
import {ClusterStorageService} from "../../storage/cluster-storage.service";

@Component({
    selector: 'app-field-star-removal',
    templateUrl: './field-star-removal.component.html',
    styleUrls: ['./field-star-removal.component.scss', '../../../shared/interface/tools.scss']
})
export class FieldStarRemovalComponent implements AfterViewInit {
    distanceParams: FsrComponents = {
        bin: 0,
        range: {min: 0, max: 0},
        histogramRange: {min: 0, max: 0}
    }

    pmraParams: FsrComponents = {
        bin: 0,
        range: {min: 0, max: 0},
        histogramRange: {min: 0, max: 0}
    }

    pmdecParams: FsrComponents = {
        bin: 0,
        range: {min: 0, max: 0},
        histogramRange: {min: 0, max: 0}
    }

    $pmra: Subject<FsrHistogramPayload> = new Subject<FsrHistogramPayload>;
    $pmdec: Subject<FsrHistogramPayload> = new Subject<FsrHistogramPayload>;
    $distance: Subject<FsrHistogramPayload> = new Subject<FsrHistogramPayload>;

    constructor(private service: ClusterService,
                public dataService: ClusterDataService,
                public storageService: ClusterStorageService) {
        this.dataService.clusterSources.subscribe(
            (data) => {
                this.$pmra.next({data: this.dataService.getPmra(), isNew: false});
                this.$pmdec.next({data: this.dataService.getPmdec(), isNew: false});
                this.$distance.next({data: this.dataService.getDistance(), isNew: false});
            });
    }

    ngAfterViewInit() {
        this.dataService.sources$.subscribe(
            () => {
                this.service.setFsrParams({
                    distance: null,
                    pm_ra: null,
                    pm_dec: null
                });
                this.$distance.next(
                    {
                        data: this.dataService.getDistance(),
                        fullData: this.dataService.getDistance(true),
                        isNew: true
                    });
                this.$pmra.next({
                    data: this.dataService.getPmra(),
                    fullData: this.dataService.getPmra(true),
                    isNew: true
                });
                this.$pmdec.next({
                    data: this.dataService.getPmdec(),
                    fullData: this.dataService.getPmdec(true),
                    isNew: true
                });
            });
    }

    distanceRangeHandler($event: range) {
        this.distanceParams.range = $event;
        this.setFSRParams();
    }

    distanceBinsHandler($event: number) {
        this.distanceParams.bin = $event;
        this.setFsrBins();
    }

    distanceHistogramRangeHandler($event: range) {
        this.distanceParams.histogramRange = $event;
        this.setFSRFraming();
    }

    pmraRangeHandler($event: range) {
        this.pmraParams.range = $event;
        this.setFSRParams();
    }

    pmraBinsHandler($event: number) {
        this.pmraParams.bin = $event;
        this.setFsrBins();
    }

    pmraHistogramRangeHandler($event: range) {
        this.pmraParams.histogramRange = $event;
        this.setFSRFraming();
    }

    pmdecRangeHandler($event: range) {
        this.pmdecParams.range = $event;
        this.setFSRParams();
    }

    pmdecBinsHandler($event: number) {
        this.pmdecParams.bin = $event;
        this.setFsrBins();
    }

    pmdecHistogramRangeHandler($event: range) {
        this.pmdecParams.histogramRange = $event;
        this.setFSRFraming();
    }

    pmraInit() {
        const payload: FsrHistogramPayload = {
            data: this.dataService.getPmra(),
            fullData: this.dataService.getPmra(true),
            isNew: true
        }
        payload.range = this.storageService.getFsrParams().pm_ra;
        payload.histogramRange = this.storageService.getFsrFraming().pm_ra;
        payload.bin = this.storageService.getFsrBins().pm_ra;
        this.$pmra.next(payload);
    }

    pmdecInit() {
        const payload: FsrHistogramPayload = {
            data: this.dataService.getPmdec(),
            fullData: this.dataService.getPmdec(true),
            isNew: true
        }
        payload.range = this.storageService.getFsrParams().pm_dec;
        payload.histogramRange = this.storageService.getFsrFraming().pm_dec;
        payload.bin = this.storageService.getFsrBins().pm_dec;
        this.$pmdec.next(payload);
    }

    distanceInit() {
        const payload: FsrHistogramPayload = {
            data: this.dataService.getDistance(),
            fullData: this.dataService.getDistance(true),
            isNew: true
        }
        payload.range = this.storageService.getFsrParams().distance;
        payload.histogramRange = this.storageService.getFsrFraming().distance;
        payload.bin = this.storageService.getFsrBins().distance;
        this.$distance.next(payload);
    }

    public reset() {
        this.service.setFsrParams(
            {
                distance: null,
                pm_ra: null,
                pm_dec: null
            }
        );
        this.service.setFsrFraming(
            {
                distance: null,
                pm_ra: null,
                pm_dec: null
            }
        );
        this.storageService.setFsrBins(
            {
                distance: null,
                pm_ra: null,
                pm_dec: null
            }
        );
        this.distanceInit();
        this.pmraInit();
        this.pmdecInit();
    }

    public toFetchArchive() {
        this.service.setTabIndex(2);
    }

    public toFitIsochrone() {
        this.service.setTabIndex(3);
    }

    private setFSRParams() {
        this.service.setFsrParams({
            distance: this.distanceParams.range,
            pm_ra: this.pmraParams.range,
            pm_dec: this.pmdecParams.range,
        });
    }

    private setFSRFraming() {
        this.service.setFsrFraming({
            distance: this.distanceParams.histogramRange,
            pm_ra: this.pmraParams.histogramRange,
            pm_dec: this.pmdecParams.histogramRange
        });
    }

    private setFsrBins() {
        this.storageService.setFsrBins({
            distance: this.distanceParams.bin,
            pm_ra: this.pmraParams.bin,
            pm_dec: this.pmdecParams.bin
        });
    }
}

