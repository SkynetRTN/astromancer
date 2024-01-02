import {AfterViewInit, Component, Input, OnChanges} from '@angular/core';
import {ClusterMWSC} from "../../../storage/cluster-storage.service.util";
import {ClusterService} from "../../../cluster.service";
import {ClusterIsochroneService} from "../../../isochrone-matching/cluster-isochrone.service";
import * as Highcharts from "highcharts";

@Component({
    selector: 'app-reddening',
    templateUrl: './reddening.component.html',
    styleUrls: ['./reddening.component.scss', '../result-graphics/result-graphics.component.scss']
})
export class ReddeningComponent implements OnChanges, AfterViewInit {

    @Input() allClusters!: ClusterMWSC[];

    Highcharts: typeof Highcharts = Highcharts;
    chartConstructor: any = "chart";
    chartObject!: Highcharts.Chart;

    chartOptions: Highcharts.Options = {
        chart: {
            animation: false,
            styledMode: true,
        },
        title: {
            text: 'E(B-V) Among Milky Way Star Clusters'
        },
        xAxis: [{
            title: {
                text: 'E(B-V) (mag)'
            },
            min: 0,
            max: 1,
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
                data: [1, 2, 3, 4],
                visible: false,
                showInLegend: false,
                xAxis: 1,
            },
            {
                name: this.service.getClusterName(),
                type: 'scatter',
                data: [],
                colorIndex: 7,
                marker: {
                    symbol: 'circle',
                    radius: 10,
                },
            },
        ],
    }

    constructor(private service: ClusterService,
                private isochroneService: ClusterIsochroneService) {
    }

    chartInitialized($event: Highcharts.Chart) {
        this.chartObject = $event;
    }

    ngOnChanges(): void {
        if (this.chartObject === undefined)
            return;
        let reddening: number[] = [];
        this.allClusters.forEach((cluster: ClusterMWSC) => {
            if (cluster.e_bv !== null && cluster.e_bv !== undefined
                && cluster.e_bv >= 0 && cluster.e_bv <= 1)
                reddening.push(cluster.e_bv);
        });
        reddening.sort((a, b) => a - b);
        this.chartObject.series[1].setData(reddening);
    }

    ngAfterViewInit(): void {
        this.chartObject.series[2].setData([[this.isochroneService.getPlotParams().reddening, 0]]);
    }
}
