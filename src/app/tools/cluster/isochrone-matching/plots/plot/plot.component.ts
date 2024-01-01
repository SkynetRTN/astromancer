import {Component, Input, OnChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import {
    ClusterPlotType,
    FILTER,
    filterFramingValue,
    getExtinction,
    PlotConfig,
    PlotFraming
} from "../../../cluster.util";
import {ClusterDataService} from "../../../cluster-data.service";
import {ClusterIsochroneService} from "../../cluster-isochrone.service";

@Component({
    selector: 'app-plot',
    templateUrl: './plot.component.html',
    styleUrls: ['./plot.component.scss']
})
export class PlotComponent implements OnChanges {
    @Input() plotConfig: PlotConfig | null = null;
    @Input() plotConfigIndex: number | null = null;
    @Input() isVertical: boolean = false;
    blueFilter: FILTER | null = null;
    redFilter: FILTER | null = null;
    lumFilter: FILTER | null = null;
    rawPlotData: rawDataPoint[] = [];
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
    protected readonly PlotFraming = PlotFraming;
    protected readonly ClusterPlotType = ClusterPlotType;
    private dataRange: PlotRange | null = null;
    private standardViewRange: PlotRange | null = null;

    constructor(private dataService: ClusterDataService,
                private isochroneService: ClusterIsochroneService) {
        this.isochroneService.plotParams$.subscribe(() => {
            this.updateChartAxis();
            this.updateData();
        });
        this.isochroneService.maxMagError$.subscribe(() => {
            this.updateChartAxis();
            this.updateData();
        });
    }

    chartInitialized($event: Highcharts.Chart) {
        this.chartObject = $event;
    }

    ngOnChanges() {
        this.updateFilters();
        this.generateRawData();
        this.updateData();
        this.updateChartAxis();
    }

    frameOnData() {
        this.updatePlotConfig(PlotFraming.DATA);
        this.chartObject.xAxis[0].setExtremes(this.dataRange?.x.min ?? 0, this.dataRange?.x.max ?? 0);
        this.chartObject.yAxis[0].setExtremes(this.dataRange?.y.min ?? 0, this.dataRange?.y.max ?? 0);
    }

    standardView() {
        this.updatePlotConfig(PlotFraming.STANDARD);
        this.chartObject.xAxis[0].setExtremes(this.standardViewRange?.x.min, this.standardViewRange?.x.max);
        this.chartObject.yAxis[0].setExtremes(this.standardViewRange?.y.min, this.standardViewRange?.y.max);
    }

    private getPlotData(): number[][] {
        if (this.plotConfig !== null) {
            const data = this.rawPlotData.filter(
                (point) => point.maxMagError < this.isochroneService.getMaxMagError());
            if (this.plotConfig.plotType === ClusterPlotType.CM)
                return data.map((point) => [point.x, point.y]);
            const result = [];
            const plotParams = this.isochroneService.getPlotParams();
            const blueExtinction = getExtinction(this.blueFilter!, plotParams.reddening);
            const redExtinction = getExtinction(this.redFilter!, plotParams.reddening);
            const lumExtinction = getExtinction(this.lumFilter!, plotParams.reddening);
            for (const point of data) {
                let x = point.x - blueExtinction + redExtinction;
                let y = point.y - lumExtinction - 5 * Math.log10(plotParams.distance * 1000) + 5;
                result.push([x, y]);
            }
            return result;
        }
        return []
    }

    private updatePlotConfig(plotFraming: PlotFraming) {
        if (this.plotConfig !== null && this.plotConfigIndex !== null) {
            this.plotConfig.plotFraming = plotFraming;
            this.isochroneService.updatePlotFraming(plotFraming, this.plotConfigIndex);
        }
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

    private updateChartAxis() {
        if (this.plotConfig !== null) {
            let xAxisTitle =
                `${this.blueFilter?.replace("prime", "\'")} - ${this.redFilter?.replace("prime", "\'")}`;
            if (this.plotConfig.plotType === ClusterPlotType.HR)
                xAxisTitle += `_${this.isochroneService.getPlotParams().reddening}`;
            const yAxisTitle = `'M'_${this.lumFilter?.replace("prime", "\'")}`;
            this.updateStandardViewRange();
            const plotFraming = this.plotConfig.plotFraming;
            let frameRange: PlotRange;
            if (plotFraming === PlotFraming.DATA || this.plotConfig.plotType === ClusterPlotType.CM) {
                frameRange = this.dataRange!;
            } else {
                frameRange = this.standardViewRange!;
            }
            try {
                this.chartObject.xAxis[0].setTitle({text: xAxisTitle});
                this.chartObject.yAxis[0].setTitle({text: yAxisTitle});
                if (plotFraming === PlotFraming.DATA || this.plotConfig.plotType === ClusterPlotType.CM) {
                    this.frameOnData();
                    this.isochroneService.updatePlotFraming(PlotFraming.DATA, this.plotConfigIndex!);
                } else if (plotFraming === PlotFraming.STANDARD) {
                    this.standardView();
                }
            } catch (e) {
                this.chartOptions.xAxis = {
                    title: {text: xAxisTitle},
                    min: frameRange.x.min,
                    max: frameRange.x.max,
                };
                this.chartOptions.yAxis = {
                    title: {text: yAxisTitle},
                    reversed: true,
                    min: frameRange.y.min,
                    max: frameRange.y.max,
                };
            }
        } else {
            this.chartOptions.xAxis = {title: {text: undefined}};
            this.chartOptions.yAxis = {title: {text: undefined}};
        }
    }

    private updateData() {
        if (this.plotConfig !== null) {
            try {
                const data = this.getPlotData();
                this.updateDataRange(data);
                this.chartObject.series[0].setData(data, true);
            } catch (e) {
                const data = this.getPlotData();
                this.updateDataRange(data);
                this.chartOptions.series = [{
                    name: "Photometry",
                    type: "scatter",
                    data: this.getPlotData(),
                    marker: {
                        radius: 1,
                    }
                }];
            }
        }
    }

    private updateStandardViewRange() {
        let filters: {
            [key: string]: string
        } = {
            'red': this.redFilter!,
            'blue': this.blueFilter!,
            'lum': this.lumFilter!
        }
        let color_red: number = filterFramingValue[filters['blue']]['red'] - filterFramingValue[filters['red']]['red'];
        let color_blue: number = filterFramingValue[filters['blue']]['blue'] - filterFramingValue[filters['red']]['blue'];

        let minX = color_blue - (color_red - color_blue) / 8;
        let maxX = color_red + (color_red - color_blue) / 8;
        this.standardViewRange = {
            x: {
                min: minX <= maxX ? minX : maxX,
                max: maxX >= minX ? maxX : minX,
            },
            y: {
                min: filterFramingValue[filters['lum']]['bright']
                    + (filterFramingValue[filters['lum']]['bright'] - filterFramingValue[filters['red']]['faint']) / 8,
                max: filterFramingValue[filters['lum']]['faint']
                    - (filterFramingValue[filters['lum']]['bright'] - filterFramingValue[filters['lum']]['faint']) / 8,
            }
        }
    }

    private updateDataRange(data: number[][]) {
        if (data.length === 0) {
            this.dataRange = {
                x: {
                    min: 0,
                    max: 0,
                },
                y: {
                    min: 0,
                    max: 0,
                }
            }
            return;
        }
        this.dataRange = {
            x: {
                min: data[0][0],
                max: data[0][0],
            },
            y: {
                min: data[0][1],
                max: data[0][1],
            }
        }
        for (const point of data) {
            if (point[0] < this.dataRange.x.min) {
                this.dataRange.x.min = point[0];
            }
            if (point[0] > this.dataRange.x.max) {
                this.dataRange.x.max = point[0];
            }
            if (point[1] < this.dataRange.y.min) {
                this.dataRange.y.min = point[1];
            }
            if (point[1] > this.dataRange.y.max) {
                this.dataRange.y.max = point[1];
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
                let maxMagError: number = 0;
                for (const photometry of source.photometries) {
                    if (photometry.filter === this.blueFilter) {
                        blueMag = photometry.mag;
                        if (photometry.mag_error > maxMagError) {
                            maxMagError = photometry.mag_error;
                        } else if (maxMagError === null) {
                            continue;
                        }
                    }
                    if (photometry.filter === this.redFilter) {
                        redMag = photometry.mag;
                        if (photometry.mag_error > maxMagError) {
                            maxMagError = photometry.mag_error;
                        } else if (maxMagError === null) {
                            continue;
                        }
                    }
                    if (photometry.filter === this.lumFilter) {
                        lumMag = photometry.mag;
                        if (photometry.mag_error > maxMagError) {
                            maxMagError = photometry.mag_error;
                        } else if (maxMagError === null) {

                        }
                    }
                }
                if (blueMag !== null && redMag !== null && lumMag !== null) {
                    this.rawPlotData.push({x: blueMag - redMag, y: lumMag, maxMagError: maxMagError});
                }
            }
        }
    }
}

interface PlotRange {
    x: {
        min: number,
        max: number
    },
    y: {
        min: number,
        max: number
    }
}

interface rawDataPoint {
    x: number,
    y: number,
    maxMagError: number,
}
