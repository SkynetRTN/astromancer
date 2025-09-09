import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import * as Highcharts from "highcharts";

import {GalaxyService} from "../galaxy.service";
import {GalaxyOptions} from "../galaxy.service.util";

@Component({
  selector: 'app-galaxy-highchart',
  templateUrl: './galaxy-highchart.component.html',
  styleUrls: ['./galaxy-highchart.component.scss']
})
export class GalaxyHighchartComponent implements AfterViewInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;
  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: true,
      panning: {
        enabled: true,
        type: 'x',
      },
      panKey: 'shift',
      zooming: {
        type: 'x',
      },
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

  constructor(private service: GalaxyService) {
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
      this.updateChart();
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
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  initChartSeries() {
    this.setData();
  }

  setData() {
    this.chartObject.addSeries({
      name: GalaxyOptions.ONE,
      data: this.service.getDataArray()[0],
      type: 'line',
      visible: GalaxyOptions.ONE === this.service.getChannel(),
      showInLegend: GalaxyOptions.ONE === this.service.getChannel(),
      marker: {
        // only enable marker when it iss radio galaxy aka the frequency is low enough
        enabled: this.service.getDataArray()[0][0][0] < 1000,
        symbol: 'circle',
        radius: 3,
      },
    });
    this.chartObject.addSeries({
      name: GalaxyOptions.TWO,
      data: this.service.getDataArray()[1],
      type: 'line',
      visible: GalaxyOptions.TWO === this.service.getChannel(),
      showInLegend: GalaxyOptions.TWO === this.service.getChannel(),
      marker: {
        enabled: this.service.getDataArray()[1][0][0] < 1000,
        symbol: 'circle',
        radius: 3,
      },
    });
  }

  updateData() {
    this.chartObject.series[0].update({
      name: GalaxyOptions.ONE,
      data: this.service.getDataArray()[0],
      type: 'line',
      visible: GalaxyOptions.ONE === this.service.getChannel(),
      showInLegend: GalaxyOptions.ONE === this.service.getChannel(),
      marker: {
        enabled: this.service.getDataArray()[0][0][0] < 1000,
        symbol: 'circle',
        radius: 3,
      },
    });
    this.chartObject.series[1].update({
      name: GalaxyOptions.TWO,
      data: this.service.getDataArray()[1],
      type: 'line',
      visible: GalaxyOptions.TWO === this.service.getChannel(),
      showInLegend: GalaxyOptions.TWO === this.service.getChannel(),
      marker: {
        enabled: this.service.getDataArray()[1][0][0] < 1000,
        symbol: 'circle',
        radius: 3,
      },
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
