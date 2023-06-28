import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import * as Highcharts from "highcharts";
import {Subject, takeUntil} from "rxjs";
import {ScatterService} from "../scatter.service";

@Component({
  selector: 'app-scatter-highchart',
  templateUrl: './scatter-highchart.component.html',
  styleUrls: ['./scatter-highchart.component.scss']
})
export class ScatterHighchartComponent implements AfterViewInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;
  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: true,
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
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private service: ScatterService) {
    this.setChartTitle();
    this.setChartXAxis();
    this.setChartYAxis();
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    // this.service.setHighChart(this.chartObject);
  }

  ngAfterViewInit(): void {
    this.initChartSeries();
    this.service.setHighChart(this.chartObject);
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateData();
    });
    this.service.chartInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setChartTitle();
      this.setChartXAxis();
      this.setChartYAxis();
      this.updateChart();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initChartSeries() {
    this.setSun();
    this.setData();
  }

  private setSun() {
    this.chartObject.addSeries({
      name: "Sun",
      data: [[0, 0]],
      type: 'scatter',
      marker: {
        radius: 10,
      }
    })
  }

  private setData() {
    this.chartObject.addSeries({
      name: this.service.getDataLabel(),
      data: this.service.getDataArray(),
      type: 'scatter',
      marker: {
        symbol: 'circle',
      }
    })
  }

  private updateData() {
    this.chartObject.series[1].update({
      name: this.service.getDataLabel(),
      data: this.service.getDataArray(),
      type: 'scatter',
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
      title: {text: this.service.getXAxisLabel()}
    };
  }

  private setChartYAxis(): void {
    this.chartOptions.yAxis = {
      title: {text: this.service.getYAxisLabel()}
    };
  }

}
