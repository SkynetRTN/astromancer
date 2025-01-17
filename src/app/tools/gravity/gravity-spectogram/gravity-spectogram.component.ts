import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import * as Highcharts from "highcharts";
import Heatmap from "highcharts/modules/heatmap"

import { SpectogramService } from '../gravity-spectogram.service';

Heatmap(Highcharts)
@Component({
  selector: 'app-gravity-spectogram',
  templateUrl: './gravity-spectogram.component.html',
  styleUrls: ['./gravity-spectogram.component.scss']
})
export class GravitySpectogramComponent implements AfterViewInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;
  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: true,
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

  constructor(private service: SpectogramService) {
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
    //Upper
    this.chartObject.addSeries({
      name: "Model",
      data: [],
      zIndex: 1,
      type: 'area',
      marker: {
        symbol: 'circle',
      },
    });
    //Lower
    this.chartObject.addSeries({
      name: "Model",
      data: [],
      zIndex: 1,
      type: 'area',
      marker: {
        symbol: 'circle',
      },
      showInLegend: false,
    });
    this.chartObject.addSeries({
      name: "Spectrum",
      data: this.service.getDataArray(),
      zIndex: 0,
      interpolation: true,
      type: 'heatmap',
      marker: {
        symbol: 'circle',
      },
    });
  }

  updateData() {
    this.chartObject.series[0].update({
      name: "Model",
      data: [],
      zIndex: 1,
      type: 'area',
      marker: {
        symbol: 'circle',
      },
    });
    this.chartObject.series[1].update({
      name: "Model",
      data: [],
      zIndex: 1,
      type: 'area',
      marker: {
        symbol: 'circle',
      },
    });
    this.chartObject.series[2].update({
      name: "Spectrum",
      data: this.service.getDataArray(),
      zIndex: 0,
      type: 'heatmap',
      marker: {
        symbol: 'circle',
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
