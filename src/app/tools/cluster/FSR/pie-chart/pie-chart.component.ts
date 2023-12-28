import {AfterViewInit, Component} from '@angular/core';
import * as Highcharts from "highcharts";
import {ClusterDataService} from "../../cluster-data.service";

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements AfterViewInit {
    Highcharts: typeof Highcharts = Highcharts;
    updateFlag: boolean = true;
    chartConstructor: any = "chart";
    chartObject!: Highcharts.Chart;

    chartOptions: Highcharts.Options = {
        chart: {
            type: "pie",
        },
        title: {
            text: undefined
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                dataLabels: {
                    enabled: true,
                    format: '{point.name} {point.percentage:.1f} %',
                    // distance: -80,
                },
            }
        },
        series: [
            {
                name: 'Counts',
                colorByPoint: true,
                type: "pie",
                data: [
                    {
                        name: 'Cluster Stars',
                        y: this.getClusterStarCount(),
                    },
                    {
                        name: 'Field Stars',
                        y: this.getFieldStarCount(),
                    },
                    // {
                    //     name: 'Unused Stars',
                    //     y: this.getUnusedStarCount(),
                    // }
                ]
            }
        ],
        tooltip: {
            enabled: false
        },
        legend: {
            enabled: true
        }
    }


    constructor(private dataService: ClusterDataService) {

    }

    ngAfterViewInit(): void {
        this.updateData();
        this.dataService.clusterSources.subscribe((data) => {
            this.updateData();
        });
    }

    chartInitialized($event: Highcharts.Chart) {
        this.chartObject = $event;
    }

    private getClusterStarCount() {
        return this.dataService.getSources(true).length;
    }

    private getFieldStarCount() {
        return this.dataService.getSources().length - this.getClusterStarCount();
    }

    private getUnusedStarCount() {
        const count = this.dataService.getCluster()?.num_total_stars! - this.dataService.getSources(false).length;
        return count > 0 ? count : 0;
    }

    private updateData() {
        this.chartObject.series[0].update(
            {
                name: 'Counts',
                colorByPoint: true,
                type: "pie",
                data: [
                    {
                        name: 'Cluster Stars',
                        y: this.getClusterStarCount(),
                    },
                    {
                        name: 'Field Stars',
                        y: this.getFieldStarCount(),
                    },
                    // {
                    //     name: 'Unused Stars',
                    //     y: this.getUnusedStarCount(),
                    // }
                ]
            }
        );
    }

}
