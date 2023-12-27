import {AfterViewInit, Component} from '@angular/core';
import {ClusterDataService} from "../../cluster-data.service";
import {FILTER} from "../../cluster.util";
import * as Highcharts from "highcharts";
import {debounceTime} from "rxjs";

@Component({
    selector: 'app-cmd-fsr',
    templateUrl: './cmd-fsr.component.html',
    styleUrls: ['./cmd-fsr.component.scss']
})
export class CmdFsrComponent implements AfterViewInit {
    Highcharts: typeof Highcharts = Highcharts;
    updateFlag: boolean = true;
    chartConstructor: any = "chart";
    chartObject!: Highcharts.Chart;
    blueFilter: FILTER = FILTER.BP;
    redFilter: FILTER = FILTER.RP;

    chartOptions: Highcharts.Options = {
        chart: {
            type: "scatter",
        },
        title: {
            text: undefined,
        },
        xAxis: {
            title: {
                text: "",
            },
        },
        yAxis: {
            title: {
                text: ""
            },
            reversed: true,
        },
        legend: {
            enabled: false,
        },
        series: [{
            name: "Color-Magnitude",
            type: "scatter",
            data: [],
            marker: {
                radius: 1,
            }
        }],
        credits: {
            enabled: false,
        }
    }

    constructor(private dataService: ClusterDataService) {
    }

    ngAfterViewInit() {
        this.setData();
        this.setAxisLabels();
        this.dataService.clusterSources.pipe(
            debounceTime(500)
        ).subscribe(
            () => {
                this.setData();
                this.setAxisLabels();
            });
    }

    chartInitialized($event: Highcharts.Chart) {
        this.chartObject = $event;
    }

    private setData() {
        this.chartObject.series[0].update({
            name: "Color-Magnitude",
            type: "scatter",
            data: this.getCmdData(),
            marker: {
                radius: 1,
            }
        });
    }

    private setAxisLabels() {
        this.chartObject.xAxis[0].setTitle({
            text: this.blueFilter + " - " + this.redFilter + " (mag)"
        });
        this.chartObject.yAxis[0].setTitle({
            text: this.blueFilter + " (mag)"
        });
    }

    private getCmdData()
        :
        number[][] {
        const sources = this.dataService.getSources(true);
        const filters = this.dataService.getFilters();
        this.redFilter = FILTER.RP
        this.blueFilter = FILTER.BP
        if (!filters.includes(FILTER.RP) || !filters.includes(FILTER.BP)) {
            this.redFilter = filters[filters.length - 1]
            this.blueFilter = filters[0]
        }
        if (filters.includes(FILTER.W1) && filters.includes(FILTER.W2)) {
            this.redFilter = FILTER.W1
            this.blueFilter = FILTER.W2
        }
        const result = []
        for (const source of sources) {
            if (source.photometries) {
                let redMag;
                let blueMag;
                source.photometries.forEach(photometry => {
                    if (photometry.filter === this.redFilter) {
                        redMag = photometry.mag;
                    }
                    if (photometry.filter === this.blueFilter) {
                        blueMag = photometry.mag;
                    }
                });
                if (redMag && blueMag) {
                    result.push([blueMag - redMag, blueMag]);
                }
            }
        }
        return result;
    }
}
