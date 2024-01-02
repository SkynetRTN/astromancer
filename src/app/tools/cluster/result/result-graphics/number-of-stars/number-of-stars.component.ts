import {AfterViewInit, Component, Input, OnChanges} from '@angular/core';
import * as Highcharts from "highcharts";
import {ClusterMWSC} from "../../../storage/cluster-storage.service.util";
import {ClusterService} from "../../../cluster.service";
import {ClusterDataService} from "../../../cluster-data.service";

@Component({
    selector: 'app-number-of-stars',
    templateUrl: './number-of-stars.component.html',
    styleUrls: ['./number-of-stars.component.scss', '../result-graphics/result-graphics.component.scss']
})
export class NumberOfStarsComponent implements OnChanges, AfterViewInit {

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
            text: 'Number of Cluster Stars Among Milky Way Star Clusters'
        },
        xAxis: [{
            title: {
                text: 'Number of Stars in each Cluster'
            },
            min: 0,
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
                data: [],
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
                }
            },
        ]
    }

    constructor(private service: ClusterService,
                private dataService: ClusterDataService) {
    }

    chartInitialized($event: Highcharts.Chart) {
        this.chartObject = $event;
    }

    ngOnChanges(): void {
        if (this.chartObject === undefined)
            return;
        let counts: number[] = [];
        this.allClusters.forEach((cluster: ClusterMWSC) => {
            if (cluster.num_cluster_stars > 0)
                counts.push(cluster.num_cluster_stars);
        });
        counts.sort((a, b) => a - b);
        counts = counts.slice(Math.floor(0.0015 * counts.length), Math.ceil(0.99985 * counts.length))
        this.chartObject.series[1].setData(counts);
    }

    ngAfterViewInit(): void {
        this.dataService.sources$.subscribe(() => {
            const counts = this.dataService.getSources(true).length;
            this.chartObject.series[2].setData([[counts, 0]]);
        });
    }
}

