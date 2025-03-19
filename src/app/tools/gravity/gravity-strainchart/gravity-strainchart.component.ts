import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {auditTime, debounceTime, Subject, takeUntil} from "rxjs";
import * as Highcharts from "highcharts";
import Boost from "highcharts/modules/boost"

import { StrainService } from './gravity-strain.service';

// Boost(Highcharts)

@Component({
  selector: 'app-gravity-strainchart',
  templateUrl: './gravity-strainchart.component.html',
  styleUrls: ['./gravity-strainchart.component.scss']
})
export class GravityStrainchartComponent implements AfterViewInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;
  chartOptions: Highcharts.Options = {
    title:{text: ''},

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

      events: {
        redraw: ()=> {
          console.log("Strain Redraw")
        }
      }
    },
    legend: {
      align: 'center',
    },
    xAxis: {
      title: {text: "Time (Seconds)"}
    },
    yAxis: {
      title: {text: "Strain (1.6 x 10^-23)"}
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

  constructor(private service: StrainService) {

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
    this.service.model$.pipe(
      takeUntil(this.destroy$),
      // auditTime(100)
    ).subscribe(() => {
      this.updateModel();
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
      data: [],
      type: 'spline',
      lineWidth: 5,
      marker: {
        enabled: false,
        symbol: 'circle',
        radius: 3,
      },

      dataGrouping: {
        anchor: "middle",
        groupPixelWidth: 2
      }
    });
    this.chartObject.addSeries({
      name: "Strain",
      data: this.service.getDataArray(),
      type: 'spline',
      marker: {
        enabled: false,
        symbol: 'circle',
        radius: 3,
      },

      dataGrouping: {
        anchor: "middle",
        groupPixelWidth: 5
      }
    });
  }

  updateData() {
    let axes = this.service.getAxes()
    this.chartObject.xAxis[0].setExtremes(axes.xmin, axes.xmax, true)
    this.chartObject.series[1].setData(
      this.service.getDataArray(),
      false, false, false
    );
  }

  updateModel() {
    this.chartObject.series[0].setData(
      this.service.getModelDataArray(),
      false, false, false
    );
  }

  private updateChart(): void {
    this.updateFlag = true;
  }
}
