import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {PulsarService} from "../../pulsar.service";
import * as Highcharts from 'highcharts';
import {PulsarDisplayPeriod} from "../../pulsar.service.util";
import More from "highcharts/highcharts-more";

@Component({
  selector: 'app-pulsar-period-folding-highchart',
  templateUrl: './pulsar-period-folding-highchart.component.html',
  styleUrls: ['./pulsar-period-folding-highchart.component.scss']
})
export class PulsarPeriodFoldingHighchartComponent implements AfterViewInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;
  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: true,
    },
    yAxis: {
      reversed: true,
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

  constructor(private service: PulsarService) {
    More(Highcharts);
  }

  ngAfterViewInit() {
    this.setChartTitle();
    this.setChartXAxis();
    this.setChartYAxis();
    this.setData();
    this.updateXAxisScale();
    this.updateChart();

    this.service.periodFoldingForm$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setChartTitle();
      this.setChartXAxis();
      this.setChartYAxis();
      this.updateChart();
    });
    this.service.periodFoldingData$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateData();
      this.updateXAxisScale();
      this.updateChart();
    });
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    this.service.setHighChartPeriodFolding(this.chartObject);
  }


  setData() {
    const dataError = this.service.getPeriodFoldingChartDataWithError();
    this.chartObject.addSeries({
      name: this.service.getPeriodFoldingDataLabel(),
      data: dataError['data'],
      type: 'scatter',
      marker: {
        symbol: 'circle',
        radius: 5,
      }
    })
    this.chartObject.addSeries({
      name: "error",
      data: dataError['error'],
      type: 'errorbar',
      showInLegend: false,
      enableMouseTracking: false,
      whiskerLength: 0,
    });
  }

  updateData() {
    const dataError = this.service.getPeriodFoldingChartDataWithError();
    this.chartObject.series[0].setData([]);
    this.chartObject.series[1].setData([]);
    this.chartObject.series[0].setData(dataError['data']);
    this.chartObject.series[1].setData(dataError['error']);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private updateXAxisScale(): void {
    let p = this.service.getPeriodFoldingPeriod();
    let delta = 0
    if (p > 4.95) {
      delta = 0.15
    } else if (p > 0.5) {
      delta = 0.1
    } else if (p > 0.05) {
      delta = 0.01
    } else if (p > 0.005) {
      delta = 0.001
    } else if (p > 0.0005) {
      delta = 0.0001
    } else if (p > 0.00005) {
      delta = 0.00001
    } else {
      delta = 0.000001
    }

    if (p - parseInt(p.toString()) < delta) {
      p = parseInt(p.toString()) + delta
    }

    if (this.service.getPeriodFoldingDisplayPeriod() === PulsarDisplayPeriod.TWO) {
      p = p * 2;
    }

    this.chartObject.xAxis[0].setExtremes(0, parseFloat(p.toString()));
  }

  private updateChart(): void {
    this.updateFlag = true;
  }

  private setChartTitle(): void {
    this.chartOptions.title = {text: this.service.getPeriodFoldingTitle()};
  }

  private setChartXAxis(): void {
    this.chartOptions.xAxis = {
      title: {text: this.service.getPeriodFoldingXAxisLabel()}
    };
  }

  private setChartYAxis(): void {
    this.chartOptions.yAxis = {
      title: {text: this.service.getPeriodFoldingYAxisLabel()},
      reversed: true,
    };
  }

}
