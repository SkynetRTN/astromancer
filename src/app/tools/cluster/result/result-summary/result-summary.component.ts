import {Component} from '@angular/core';
import {ClusterService} from "../../cluster.service";
import {ClusterDataService} from "../../cluster-data.service";
import {ClusterIsochroneService} from "../../isochrone-matching/cluster-isochrone.service";
import {
    downloadCsv,
    getHalfLightRadius,
    getMass,
    getPhysicalRadius,
    getPmra,
    getVelocityDispersion
} from "../result.utils";
import {d2DMS, d2HMS} from "../../../shared/data/utils";
import {filter} from "rxjs";
import {getDateString} from "../../../shared/charts/utils";
import {HonorCodeChartService} from "../../../shared/honor-code-popup/honor-code-chart.service";
import {HonorCodePopupService} from "../../../shared/honor-code-popup/honor-code-popup.service";

@Component({
    selector: 'app-result-summary',
    templateUrl: './result-summary.component.html',
    styleUrls: ['./result-summary.component.scss']
})
export class ResultSummaryComponent {
    angularRadius!: number;
    angularRadiusDMS: string = "";
    physicalRadius!: number;
    ra: number = 0;
    dec: number = 0;
    raHMS: string = "";
    decDMS: string = "";
    l: number = this.dataService.getCluster()?.galactic_latitude!;
    lDMS: string = "";
    b: number = this.dataService.getCluster()?.galactic_longitude!;
    bDMS: string = "";
    distance!: number;
    age!: number;
    metallicity!: number;
    reddening!: number;
    pmra!: number;
    pmdec!: number;
    numberOfStars!: number;
    velocityDispersion!: number;
    mass!: number;
    protected readonly Math = Math;
    plotDownloading = false;

    constructor(public service: ClusterService,
                public dataService: ClusterDataService,
                public isochroneService: ClusterIsochroneService,
                private honorCodeService: HonorCodePopupService,
                private chartService: HonorCodeChartService) {
        this.service.tabIndex$.pipe(
            filter(index => index === 4)
        ).subscribe((index) => {
            this.init();
        });
        this.dataService.sources$.subscribe(() => {
            if (this.service.getTabIndex() === 4) {
                this.init();
            }
        });
        this.isochroneService.isochroneParams$.subscribe(() => {
            if (this.service.getTabIndex() === 4) {
                this.init();
            }
        });
        this.isochroneService.plotParams$.subscribe(() => {
            if (this.service.getTabIndex() === 4) {
                this.init();
            }
        });
    }

    init() {
        const sources = this.dataService.getSources(true);
        this.numberOfStars = sources.length;
        this.angularRadius = getHalfLightRadius(sources,
            this.dataService.getClusterRa()!, this.dataService.getClusterDec()!);
        const angularRadiusDMSarr = d2DMS(this.angularRadius);
        this.angularRadiusDMS =
            `${angularRadiusDMSarr[0]}° ${angularRadiusDMSarr[1]}' ${angularRadiusDMSarr[2].toFixed(1)}"`
        this.ra = this.dataService.getClusterRa()!;
        const raHMSarr = d2HMS(this.ra);
        this.raHMS = `${raHMSarr[0]}h ${raHMSarr[1]}m ${raHMSarr[2].toFixed(1)}s`
        this.dec = this.dataService.getClusterDec()!;
        const decDMSarr = d2DMS(this.dec);
        this.decDMS = `${decDMSarr[0]}° ${decDMSarr[1]}' ${decDMSarr[2].toFixed(1)}"`
        const lb = this.dataService.computeGalacticCoordinates();
        this.l = lb.l;
        const lDMSarr = d2DMS(this.l);
        this.lDMS = `${lDMSarr[0]}° ${lDMSarr[1]}' ${lDMSarr[2].toFixed(1)}"`
        this.b = lb.b;
        const bDMSarr = d2DMS(this.b);
        this.bDMS = `${bDMSarr[0]}° ${bDMSarr[1]}' ${bDMSarr[2].toFixed(1)}"`
        const plotParams = this.isochroneService.getPlotParams();
        const isochroneParams = this.isochroneService.getIsochroneParams();
        this.distance = plotParams.distance;
        this.reddening = plotParams.reddening;
        this.age = isochroneParams.age;
        this.metallicity = isochroneParams.metallicity;
        this.physicalRadius = getPhysicalRadius(this.distance, this.angularRadius);
        this.pmra = getPmra(this.dataService.getPmra());
        this.pmdec = getPmra(this.dataService.getPmdec());
        this.velocityDispersion = getVelocityDispersion(this.dataService.getSources(true), this.pmra, this.pmdec);
        this.mass = getMass(this.velocityDispersion, this.distance, this.physicalRadius);
    }

    downloadSummary() {
        const name = this.service.getClusterName();
        downloadCsv(
            ['name', 'classification', 'star_counts', 'mass', 'physical_radius',
                'ra', 'dec', 'l', 'b', 'angular_radius',
                'pmr_ra', 'pm_dec', 'velocity_dispersion',
                'distance', 'log_age', 'metallicity', 'e(b-v)'],
            [[
                name, this.dataService.getCluster()?.type, this.numberOfStars, this.mass, this.physicalRadius,
                this.ra, this.dec, this.l, this.b, this.angularRadius,
                this.pmra, this.pmdec, this.velocityDispersion,
                this.distance, this.age, this.metallicity, this.reddening]],
            `${name}_summary_${getDateString()}`
        );
    }

    downloadData() {
        this.dataService.downloadSources();
    }

    downloadPlots() {
        this.plotDownloading = true;
        this.honorCodeService.honored().subscribe((name: string) => {
            this.chartService.saveImageHighChartsOffline(
                this.isochroneService.getHighCharts(), 2, name,"cluster",
                () => {
                    this.plotDownloading = false;
                });
        })

    }

}
