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
import {concatMap, delay, filter, from, of, switchMap, tap} from "rxjs";
import {getDateString} from "../../../shared/charts/utils";
import {HonorCodeChartService} from "../../../shared/honor-code-popup/honor-code-chart.service";
import {HonorCodePopupService} from "../../../shared/honor-code-popup/honor-code-popup.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Catalogs} from "../../cluster.util";
import {ChartEngineService} from "../../../../shared/settings/appearance/service/chart-engine.service";
import {EChartsOption} from "echarts";

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

    constructor(public http: HttpClient,
                public service: ClusterService,
                public dataService: ClusterDataService,
                public isochroneService: ClusterIsochroneService,
                private honorCodeService: HonorCodePopupService,
                private chartService: HonorCodeChartService,
                private chartEngineService: ChartEngineService) {
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
        this.honorCodeService.honored().subscribe((studentName) => {
            if (studentName) {
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
                    `${studentName}_${name}_summary_${getDateString()}`
                );
            }
        });
    }

    downloadData() {
        this.honorCodeService.honored().subscribe((studentName) => {
            if (studentName) {
                this.dataService.downloadSources(studentName);
            }
        });
    }

    downloadPlots() {
        this.service.setLoading(true);
        this.service.setTabIndex(3);
        this.honorCodeService.honored().pipe(
            tap(signature => {
                const hasCharts = this.chartEngineService.getChartEngine() === 'echarts'
                  ? this.isochroneService.getECharts().length > 0
                  : this.isochroneService.getHighCharts().length > 0;
                if (!signature || !hasCharts) {
                    this.service.setTabIndex(4);
                    this.service.setLoading(false);
                }
            }),
            filter(signature => !!signature),
            filter(() => {
                return this.chartEngineService.getChartEngine() === 'echarts'
                  ? this.isochroneService.getECharts().length > 0
                  : this.isochroneService.getHighCharts().length > 0;
            }),
            switchMap(signature => of(signature).pipe(
                concatMap(() => this.chartEngineService.getChartEngine() === 'echarts'
                  ? this.chartService.saveImageEChartsOffline(this.isochroneService.getECharts(), 2, signature, "cluster-isochrone")
                  : this.chartService.saveImageHighChartsOffline(this.isochroneService.getHighCharts(), 2, signature, "cluster-isochrone")),
            ))
        ).subscribe(() => {
            this.service.setTabIndex(4);
            this.service.setLoading(false);
        });
    }

    downloadFsrPlots() {
        this.service.setLoading(true);
        this.service.setTabIndex(1);
        this.honorCodeService.honored().pipe(
            tap(signature => {
                if (!signature) {
                    this.service.setTabIndex(4);
                    this.service.setLoading(false);
                }
            }),
            filter(signature => !!signature),
            switchMap(signature => of(signature).pipe(
                // concatMap(() => this.chartService.saveImageHighChartsOffline(this.service.getFsrCharts().slice(1), 1, signature, "cluster-field-removal-histogram")),
                concatMap(() => this.chartEngineService.getChartEngine() === 'echarts'
                  ? this.chartService.saveImageEChartsOffline(this.service.getFsrECharts().slice(0, 1), 1, signature, "cluster-field-removal-2dpm")
                  : this.chartService.saveImageHighChartsOffline(this.service.getFsrCharts().slice(0, 1), 1, signature, "cluster-field-removal-2dpm")),
            ))
        ).subscribe(() => {
            this.service.setTabIndex(4);
            this.service.setLoading(false);
        });
    }

    downloadPlotData() {
        this.honorCodeService.honored().subscribe((studentName) => {
            if (studentName) {
                const name = this.service.getClusterName();
                const plotConfig = this.isochroneService.getPlotConfigs();
                const highCharts = this.isochroneService.getHighCharts();
                const eCharts = this.isochroneService.getECharts();
                const sources: (number | undefined)[][][] = [];
                const isochrones: (number | undefined)[][][] = [];
                if (this.chartEngineService.getChartEngine() === 'echarts') {
                    for (let i = 0; i < plotConfig.length; i++) {
                        const chartOption = eCharts[i]?.getOption() as EChartsOption;
                        const series = (chartOption?.series ?? []) as Array<{data?: any[]}>;
                        const sourceSeries = series[0]?.data ?? [];
                        const isochroneSeries = series[1]?.data ?? [];
                        const seriesSources: (number | undefined)[][] = sourceSeries.map((point: any) => {
                            const value = point?.value ?? point;
                            return [value?.[0], value?.[1]];
                        });
                        const seriesIsochrones: (number | undefined)[][] = isochroneSeries.map((point: any) => {
                            const value = point?.value ?? point;
                            return [value?.[0], value?.[1]];
                        });
                        sources.push(seriesSources);
                        isochrones.push(seriesIsochrones);
                    }
                } else {
                    for (let i = 0; i < plotConfig.length; i++) {
                        const seriesSources: (number | undefined)[][] = [];
                        for (let j = 0; j < highCharts[i].series[0].data.length; j++) {
                            seriesSources.push([highCharts[i].series[0].data[j]['x'], highCharts[i].series[0].data[j]['y']]);
                        }
                        sources.push(seriesSources);
                        const seriesIsochrones: (number | undefined)[][] = [];
                        for (let j = 0; j < highCharts[i].series[1].data.length; j++) {
                            seriesIsochrones.push([highCharts[i].series[1].data[j]['x'], highCharts[i].series[1].data[j]['y']]);
                        }
                        isochrones.push(seriesIsochrones);
                    }
                }
                const maxLength = Math.max(...sources.map(s => s.length),
                    ...isochrones.map(s => s.length));

                const columns: string[] = [];
                for (let i = 0; i < plotConfig.length; i++) {
                    columns.push(`source_${i}_x`);
                    columns.push(`source_${i}_y`);
                    columns.push(`isochrone_${i}_x`);
                    columns.push(`isochrone_${i}_y`);
                }
                const output: (number | undefined)[][] = [];
                for (let i = 0; i < maxLength; i++) {
                    const row: (number | undefined)[] = [];
                    for (let j = 0; j < plotConfig.length; j++) {
                        if (i < sources[j].length) {
                            row.push(sources[j][i][0]);
                            row.push(sources[j][i][1]);
                        } else {
                            row.push(undefined);
                            row.push(undefined);
                        }
                        if (i < isochrones[j].length) {
                            row.push(isochrones[j][i][0]);
                            row.push(isochrones[j][i][1]);
                        } else {
                            row.push(undefined);
                            row.push(undefined);
                        }
                    }
                    output.push(row);
                }
                downloadCsv(columns, output, `${studentName}_${name}_plot_data_${getDateString()}`);
            }
        });
    }

    submitData() {
        // compute catalogs
        const catalogs: string[] = [];
        const starCounts = this.dataService.getInterfaceStarCounts()
        for (const catalog in Catalogs) {
            if (Object.keys(starCounts).includes(catalog) && starCounts[catalog].cluster_stars > 0) {
                catalogs.push(catalog);
            }
        }


        const payload = {
            catalogs: catalogs.join(","),
            ra: this.ra,
            dec: this.dec,
            radius: this.angularRadius,
            constraints: this.service.getFsrParams(),
            star_counts: this.dataService.getInterfaceStarCounts(),
            isochrone_params: this.isochroneService.getIsochroneParams(),
            plot_params: this.isochroneService.getPlotParams(),
            sources: this.dataService.getSources(true),
            // cluster: this.dataService.getCluster(),
        };
        // console.log(payload);
        this.http.post(`${environment.astronomiconApiUrl}/submissions`, payload, {headers: {'content-type': 'application/json'}}).subscribe(
            (response: any) => {
                const submissionId = response['id'].toString();
                console.log(`${environment.astronomiconUrl}/clusters/submissions/${submissionId}`);
                window.open(`${environment.astronomiconUrl}/clusters/submissions/${submissionId}`, "_blank");
            },
            (error) => {
                alert("Submission Failed");
                console.log(error);
            }
        );
    }
}
