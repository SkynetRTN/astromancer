import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import * as Highcharts from "highcharts";

import {GravityService} from "../gravity.service";

@Component({
  selector: 'app-gravity-highchart',
  templateUrl: './gravity-highchart.component.html',
  styleUrls: ['./gravity-highchart.component.scss']
})
export class GravityHighchartComponent implements AfterViewInit, OnDestroy {
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
    colorAxis: { stops: [
      [0, '#3060cf'],
      [0.5, '#fffbbc'],
      [0.9, '#c4463a'],
      [1, '#c4463a']
    ]
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

  constructor(private service: GravityService) {
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
      name: "Model",
      data: this.service.getDataArray()[0],
      type: 'line',
      lineWidth: 5,
      // marker: {
      //   // enabled:
      //   symbol: 'circle',
      //   radius: 3,
      // },
    });
    this.chartObject.addSeries({
      name: "Strain",
      data: this.service.getDataArray()[1],
      type: 'line',
      // marker: {
      //   // enabled:
      //   symbol: 'circle',
      //   radius: 3,
      // },
    });
  }

  updateData() {
    this.chartObject.series[0].update({
      name: "Model",
      data: this.service.getDataArray()[0],
      type: 'line',
      lineWidth: 5,
      // marker: {
      //   // enabled:
      //   symbol: 'circle',
      //   radius: 3,
      // },
    });
    this.chartObject.series[1].update({
      name: "Strain",
      data: this.service.getDataArray()[1],
      type: 'line',
      // marker: {
      //   // enabled:
      //   symbol: 'circle',
      //   radius: 3,
      // },
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
