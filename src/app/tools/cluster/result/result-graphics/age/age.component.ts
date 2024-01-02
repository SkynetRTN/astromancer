import {AfterViewInit, Component, Input, OnChanges} from '@angular/core';
import * as Highcharts from "highcharts";
import {ClusterMWSC} from "../../../storage/cluster-storage.service.util";
import {ClusterService} from "../../../cluster.service";
import {ClusterIsochroneService} from "../../../isochrone-matching/cluster-isochrone.service";

@Component({
    selector: 'app-age',
    templateUrl: './age.component.html',
    styleUrls: ['./age.component.scss', '../result-graphics/result-graphics.component.scss']
})
export class AgeComponent implements OnChanges, AfterViewInit {

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
            text: 'Age Among Milky Way Star Clusters'
        },
        xAxis: [{
            title: {
                text: 'Age (billion years)'
            },
            min: 0,
            max: 13.8,
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
                name: 'Us, Now',
                type: 'scatter',
                data: [[0, 0]],
                colorIndex: 0,
                marker: {
                    symbol: 'circle',
                    radius: 7,
                },
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
            {
                name: 'Sun',
                type: 'scatter',
                data: [[4.6, 0]],
                colorIndex: 3,
                marker: {
                    symbol: 'circle',
                    radius: 7,
                }
            },
            {
                name: 'First Stars',
                type: 'scatter',
                data: [[13.4, 0]],
                colorIndex: 1,
                marker: {
                    symbol: 'diamond',
                    radius: 7,
                }
            },
            {
                name: 'Big Bang',
                type: 'scatter',
                data: [[13.8, 0]],
                colorIndex: 2,
                marker: {
                    symbol: 'circle',
                    radius: 9,
                }
            }
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
        let ages: number[] = [];
        this.allClusters.forEach((cluster: ClusterMWSC) => {
            if (cluster.age !== null && cluster.age !== undefined) {
                const age = Math.pow(10, cluster.age) / 1000000;
                if (age > 0 && age < 13.8)
                    ages.push(age);
            }
        });
        console.log(ages);
        ages.sort((a, b) => a - b);
        this.chartObject.series[1].setData(ages);
    }

    ngAfterViewInit(): void {
        this.chartObject.series[3].setData([[this.isochroneService.getIsochroneParams().age / 1000, 0]]);
    }
}
