import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {VariableService} from "../../variable.service";
import * as Highcharts from 'highcharts';
import {VariableDisplayPeriod} from "../../variable.service.util";
import More from "highcharts/highcharts-more";

@Component({
  selector: 'app-variable-period-folding-highchart',
  templateUrl: './variable-period-folding-highchart.component.html',
  styleUrls: ['./variable-period-folding-highchart.component.scss']
})
export class VariablePeriodFoldingHighchartComponent implements AfterViewInit, OnDestroy {
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
  private destroy$: Subject<any> = new Subject<any>();

  constructor(private service: VariableService) {
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
    });
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    this.service.setHighChartPeriodogram(this.chartObject);
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
    // this.chartObject.addSeries({
    //   name: "error",
    //   data: dataError['error'],
    //   type: 'errorbar',
    //   showInLegend: false,
    //   enableMouseTracking: false,
    // });
  }

  updateData() {
    const dataError = this.service.getPeriodFoldingChartDataWithError();
    this.chartObject.series[0].update({
      name: this.service.getPeriodFoldingDataLabel(),
      data: dataError['data'],
      type: 'scatter',
    });
    // this.chartObject.series[1].update({
    //   name: "error",
    //   data: dataError['error'],
    //   type: 'errorbar',
    // });
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

    if (this.service.getPeriodFoldingDisplayPeriod() === VariableDisplayPeriod.TWO) {
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
      title: {text: this.service.getPeriodFoldingYAxisLabel()}
    };
  }

}
