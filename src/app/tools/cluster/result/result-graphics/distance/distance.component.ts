import {Component, Input, OnChanges} from '@angular/core';
import * as Highcharts from "highcharts";
import {HttpClient} from "@angular/common/http";
import {ClusterMWSC} from "../../../storage/cluster-storage.service.util";
import {ClusterService} from "../../../cluster.service";
import {ClusterIsochroneService} from "../../../isochrone-matching/cluster-isochrone.service";

@Component({
    selector: 'app-cluster-summary-distance',
    templateUrl: './distance.component.html',
    styleUrls: ['./distance.component.scss', '../result-graphics/result-graphics.component.scss']
})
export class DistanceComponent implements OnChanges {

    @Input() allClusters!: ClusterMWSC[];

    Highcharts: typeof Highcharts = Highcharts;
    chartConstructor: any = "chart";
    chartObject!: Highcharts.Chart;
    isLogScale: boolean = false;

    chartOptions: Highcharts.Options = {
        chart: {
            animation: false,
            styledMode: true,
        },
        title: {
            text: 'Distance Among Milky Way Star Clusters'
        },
        xAxis: [{
            title: {
                text: 'Distance (kpc)'
            },
            min: 0.01,
            max: 65,
        },
            {
                visible: false,
            }],
        yAxis: [{
            title: {
                text: '# Clusters in Bin'
            },
            min: 0,
        }],
        series: [
            {
                name: '#Clusters in Bin',
                type: 'histogram',
                baseSeries: 'data',
                zIndex: 0,
                colorIndex: 4,
                opacity: 0.5,
            },
            {
                id: 'data',
                type: 'scatter',
                data: [1, 2, 3, 4, 3, 1, 3, 2,],
                visible: false,
                showInLegend: false,
                xAxis: 1,
            },
            {
                name: 'Pale Blue Dot',
                type: 'scatter',
                data: [[0.01, 0]],
                colorIndex: 0,
                marker: {
                    symbol: 'circle',
                    radius: 7,
                },
            },
            {
                name: this.service.getClusterName(),
                type: 'scatter',
                data: [[this.isochroneService.getPlotParams().distance, 0]],
                colorIndex: 7,
                marker: {
                    symbol: 'circle',
                    radius: 10,
                }
            },
            {
                name: 'Center of the Milky Way',
                type: 'scatter',
                data: [[8, 0]],
                colorIndex: 1,
                marker: {
                    symbol: 'triangle',
                    radius: 7,
                },
            },
            {
                name: 'Other Side of the Milky Way',
                type: 'scatter',
                data: [[20, 0]],
                colorIndex: 1,
                marker: {
                    symbol: 'triangle-down',
                    radius: 7,
                },
            },
            {
                name: 'Large Magellanic Cloud',
                type: 'scatter',
                data: [[50, 0]],
                colorIndex: 2,
                marker: {
                    symbol: 'square',
                    radius: 7,
                }
            },
            {
                name: 'Small Magellanic Cloud',
                type: 'scatter',
                data: [[62, 0]],
                colorIndex: 2,
                marker: {
                    symbol: 'square',
                    radius: 5,
                }
            },
        ]
    }

    constructor(private http: HttpClient,
                private service: ClusterService,
                private isochroneService: ClusterIsochroneService) {
    }

    chartInitialized($event: Highcharts.Chart) {
        this.chartObject = $event;
    }

    ngOnChanges(): void {
        if (this.chartObject === undefined)
            return;
        let distance: number[] = [];
        this.allClusters.forEach((cluster: ClusterMWSC) => {
            if (cluster.distance > 0)
                distance.push(cluster.distance / 1000);
        });
        distance.sort((a, b) => a - b);
        this.chartObject.series[1].setData(distance);
    }

    toggleLogScale() {
        this.chartObject.xAxis[0].update({
            type: this.isLogScale ? 'linear' : 'logarithmic'
        });
        this.isLogScale = !this.isLogScale;
    }
}
