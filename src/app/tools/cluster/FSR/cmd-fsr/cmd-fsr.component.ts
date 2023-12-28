import {AfterViewInit, Component} from '@angular/core';
import {ClusterDataService} from "../../cluster-data.service";
import {CMDFilterSet, FILTER} from "../../cluster.util";
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
        this.chartObject.xAxis[0].setTitle({text: this.blueFilter + " - " + this.redFilter + " (mag)"} as any);
        this.chartObject.yAxis[0].setTitle({text: this.redFilter + " (mag)"} as any);
    }

    private getCmdData(): number[][] {
        const sources = this.dataService.getSources(true);
        const filters = this.dataService.getFilters();
        const availableFilterSets: CMDFilterSet[] = []
        const result: number[][][] = []
        if (filters.includes(FILTER.BP) && filters.includes(FILTER.RP)) {
            availableFilterSets.push({blue: FILTER.BP, red: FILTER.RP});
            result.push([]);
        }
        if (filters.includes(FILTER.W1) && filters.includes(FILTER.W2)) {
            availableFilterSets.push({blue: FILTER.W1, red: FILTER.W2});
            result.push([]);
        }
        if (filters.includes(FILTER.G_PRIME) && filters.includes(FILTER.I_PRIME)) {
            availableFilterSets.push({blue: FILTER.G_PRIME, red: FILTER.I_PRIME});
            result.push([]);
        }
        if (filters.includes(FILTER.J) && filters.includes(FILTER.H)) {
            availableFilterSets.push({blue: FILTER.J, red: FILTER.H});
            result.push([]);
        }
        if (availableFilterSets.length === 0) {
            availableFilterSets.push({blue: filters[0], red: filters[1]});
            result.push([]);
        }
        for (const source of sources) {
            if (source.photometries) {
                const sourceFilters: FILTER[] = source.photometries.map(p => p.filter);
                for (let i = 0; i < availableFilterSets.length; i++) {
                    const filterSet = availableFilterSets[i];
                    let blueMag: number | undefined;
                    let redMag: number | undefined;
                    if (sourceFilters.includes(filterSet.blue) && sourceFilters.includes(filterSet.red)) {
                        blueMag = source.photometries.find(p => p.filter === filterSet.blue)?.mag;
                        redMag = source.photometries.find(p => p.filter === filterSet.red)?.mag;
                        result[i].push([blueMag! - redMag!, redMag!]);
                    }
                }
            }
        }
        const resultLengths = result.map(r => r.length);
        const maxLengthIndex = resultLengths.indexOf(Math.max(...resultLengths));
        this.blueFilter = availableFilterSets[maxLengthIndex].blue;
        this.redFilter = availableFilterSets[maxLengthIndex].red;
        return result[maxLengthIndex];
    }
}
