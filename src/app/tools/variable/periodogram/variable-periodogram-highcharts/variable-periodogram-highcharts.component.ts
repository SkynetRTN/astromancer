import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import * as Highcharts from "highcharts";
import {Subject, takeUntil} from "rxjs";
import {VariableService} from "../../variable.service";

@Component({
  selector: 'app-variable-periodogram-highcharts',
  templateUrl: './variable-periodogram-highcharts.component.html',
  styleUrls: ['./variable-periodogram-highcharts.component.scss']
})
export class VariablePeriodogramHighchartsComponent implements AfterViewInit, OnDestroy {
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
  }

  ngAfterViewInit() {
    this.setChartTitle();
    this.setChartXAxis();
    this.setChartYAxis();
    this.setData();
    this.updateChart();

    this.service.periodogramForm$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setChartTitle();
      this.setChartXAxis();
      this.setChartYAxis();
      this.updateChart();
    });
    this.service.periodogramData$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateData();
    });
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    this.service.setHighChartPeriodFolding(this.chartObject);
  }

  initChartSeries() {
    this.setData();
  }

  setData() {
    this.chartObject.addSeries({
      name: this.service.getPeriodogramDataLabel(),
      data: this.service.getChartPeriodogramDataArray(
        this.service.getPeriodogramStartPeriod(),
        this.service.getPeriodogramEndPeriod()),
      type: 'scatter',
      marker: {
        symbol: 'circle',
        radius: 2,
      }
    })
  }

  updateData() {
    this.chartObject.series[0].update({
      name: this.service.getPeriodogramDataLabel(),
      data: this.service.getChartPeriodogramDataArray(
        this.service.getPeriodogramStartPeriod(),
        this.service.getPeriodogramEndPeriod()),
      type: 'scatter',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private updateChart(): void {
    this.updateFlag = true;
  }

  private setChartTitle(): void {
    this.chartOptions.title = {text: this.service.getPeriodogramTitle()};
  }

  private setChartXAxis(): void {
    this.chartOptions.xAxis = {
      title: {text: this.service.getPeriodogramXAxisLabel()}
    };
  }

  private setChartYAxis(): void {
    this.chartOptions.yAxis = {
      title: {text: this.service.getPeriodogramYAxisLabel()}
    };
  }

}
