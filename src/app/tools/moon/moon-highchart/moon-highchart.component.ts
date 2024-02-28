import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import * as Highcharts from "highcharts";
import {MoonService} from "../moon.service";
import {Subject, takeUntil} from "rxjs";

@Component({
    selector: 'app-moon-highchart',
    templateUrl: './moon-highchart.component.html',
    styleUrls: ['./moon-highchart.component.scss']
})
export class MoonHighchartComponent implements AfterViewInit, OnDestroy {
    Highcharts: typeof Highcharts = Highcharts;
    updateFlag: boolean = true;
    chartConstructor: any = "chart";
    chartObject!: Highcharts.Chart;
    chartOptions: Highcharts.Options = {
        chart: {
            animation: false,
            styledMode: true,
        },
        xAxis: {
            minRange: 0.1,
            maxPadding: 0,
            alignTicks: false,
        },
        legend: {
            align: 'center',
        },
        tooltip: {
            enabled: true,
            shared: false,
        },
        exporting: {
            buttons: {
                contextButton: {
                    enabled: false,
                }
            }
        }
    };
    private destroy$: Subject<any> = new Subject<any>();

    constructor(private service: MoonService) {
        this.setChartTitle();
        this.setChartXAxis();
        this.setChartYAxis();
    }

    chartInitialized($event: Highcharts.Chart) {
        this.chartObject = $event;
        this.service.setHighChart(this.chartObject);

    }

    ngAfterViewInit(): void {
        this.initChartSeries();
        this.service.data$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.updateData();
            this.updateModel();
        });
        this.service.chartInfo$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.setChartTitle();
            this.setChartXAxis();
            this.setChartYAxis();
            this.updateData();
            this.updateChart();
        });
        this.service.interface$.pipe(
            takeUntil(this.destroy$),
        ).subscribe(
            () => {
                this.updateModel();
            }
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next(null);
        this.destroy$.complete();
    }

    initChartSeries() {
        this.setData();
        this.setModel();
    }

    setData() {
        this.chartObject.addSeries({
            name: this.service.getDataLabel(),
            data: this.service.getDataArray(),
            type: 'scatter',
        })
    }

    updateData() {
        this.chartObject.series[0].update({
            name: this.service.getDataLabel(),
            data: this.service.getDataArray(),
            type: 'scatter',
        });
        const xRange = this.service.getDataJdRange();
        this.chartObject.xAxis[0].setExtremes(xRange[0], xRange[1]);
    }

    setModel() {
        this.chartObject.addSeries({
            name: "Model",
            data: this.service.getMoonModelData(),
            type: 'line',
        })
    }

    updateModel() {
        this.chartObject.series[1].update({
            name: "Model",
            data: this.service.getMoonModelData(),
            type: 'line',
        });
    }


    private updateChart(): void {
        this.updateFlag = true;
    }

    private setChartTitle(): void {
        this.chartOptions.title = {text: this.service.getChartTitle()};
    }

    private setChartXAxis(): void {
        this.chartOptions.xAxis = {
            title: {text: this.service.getXAxisLabel()},
            minRange: 0.1,
            startOnTick: false,
            endOnTick: false,
        };
    }

    private setChartYAxis(): void {
        this.chartOptions.yAxis = {
            title: {text: this.service.getYAxisLabel()}
        };
    }

}
