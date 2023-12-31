import {Component, Input, OnChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import {FILTER, PlotConfig} from "../../../cluster.util";
import {ClusterDataService} from "../../../cluster-data.service";

@Component({
    selector: 'app-plot',
    templateUrl: './plot.component.html',
    styleUrls: ['./plot.component.scss']
})
export class PlotComponent implements OnChanges {
    @Input() plotConfig: PlotConfig | null = null;
    @Input() isVertical: boolean = false;
    blueFilter: FILTER | null = null;
    redFilter: FILTER | null = null;
    lumFilter: FILTER | null = null;
    rawPlotData: number[][] = [];

    Highcharts: typeof Highcharts = Highcharts;
    updateFlag: boolean = true;
    chartConstructor: any = "chart";
    chartObject!: Highcharts.Chart;

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
            enabled: true,
        },
        series: [{
            name: "Photometry",
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

    chartInitialized($event: Highcharts.Chart) {
        this.chartObject = $event;
    }

    ngOnChanges() {
        this.updateFilters();
        this.updateChartMetaData();
        this.generateRawData();
        this.updateData();
    }

    private updateFilters() {
        if (this.plotConfig !== null) {
            this.blueFilter = this.plotConfig.filters.blue;
            this.redFilter = this.plotConfig.filters.red;
            this.lumFilter = this.plotConfig.filters.lum;
        } else {
            this.blueFilter = null;
            this.redFilter = null;
            this.lumFilter = null;
        }
    }

    private updateChartMetaData() {
        if (this.plotConfig !== null) {
            const xAxisTitle =
                `${this.blueFilter?.replace("prime", "\'")} - ${this.redFilter?.replace("prime", "\'")}`;
            const yAxisTitle = `M_${this.lumFilter?.replace("prime", "\'")}`;
            try {
                this.chartObject.xAxis[0].setTitle({text: xAxisTitle});
                this.chartObject.yAxis[0].setTitle({text: yAxisTitle});
            } catch (e) {
                this.chartOptions.xAxis = {title: {text: xAxisTitle}};
                this.chartOptions.yAxis = {title: {text: yAxisTitle}, reversed: true};
            }
        } else {
            this.chartOptions.xAxis = {title: {text: undefined}};
            this.chartOptions.yAxis = {title: {text: undefined}};
        }
    }

    private updateData() {
        if (this.plotConfig !== null) {
            try {
                this.chartObject.series[0].setData(this.rawPlotData, true);
            } catch (e) {
                this.chartOptions.series = [{
                    name: "Photometry",
                    type: "scatter",
                    data: this.rawPlotData,
                    marker: {
                        radius: 1,
                    }
                }];
            }
        }
    }

    private generateRawData() {
        this.rawPlotData = [];
        if (this.plotConfig !== null) {
            const sources = this.dataService.getSources(true)
            for (const source of sources) {
                let blueMag: number | null = null;
                let redMag: number | null = null;
                let lumMag: number | null = null;
                for (const photometry of source.photometries) {
                    if (photometry.filter === this.blueFilter) {
                        blueMag = photometry.mag;
                    }
                    if (photometry.filter === this.redFilter) {
                        redMag = photometry.mag;
                    }
                    if (photometry.filter === this.lumFilter) {
                        lumMag = photometry.mag;
                    }
                }
                if (blueMag !== null && redMag !== null && lumMag !== null) {
                    this.rawPlotData.push([blueMag - redMag, lumMag]);
                }
            }
        }
    }
}
