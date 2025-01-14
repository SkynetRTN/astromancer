import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as Highcharts from "highcharts";
import { Subject, takeUntil } from "rxjs";
import { PulsarService } from "../../pulsar.service";

@Component({
  selector: 'app-pulsar-periodogram-highcharts',
  templateUrl: './pulsar-periodogram-highcharts.component.html',
  styleUrls: ['./pulsar-periodogram-highcharts.component.scss']
})
export class PulsarPeriodogramHighchartsComponent implements AfterViewInit, OnDestroy {
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
    xAxis: {
      type: 'logarithmic',
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

  constructor(private service: PulsarService) {}

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
    this.service.setHighChartPeriodogram(this.chartObject);
  }

  /**
   * Handles the initial creation of series from periodogram data.
   */
  setData() {
    const periodogramData = this.service.getChartPeriodogramDataArray(
      this.service.getPeriodogramStartPeriod(),
      this.service.getPeriodogramEndPeriod()
    );

    // Process each periodogram data set and add two series for each
    Object.entries(periodogramData).forEach(([key, data], index) => {
      // Add the primary line series
      this.chartObject.addSeries({
        name: `Channel 1`,
        data: data,
        type: 'line',
        marker: {
          symbol: 'circle',
          radius: 3,
        }
      });
    });
  }

  /**
   * Handles dynamic updates of the series data.
   */
  updateData() {
    const periodogramData = this.service.getChartPeriodogramDataArray(
      this.service.getPeriodogramStartPeriod(),
      this.service.getPeriodogramEndPeriod()
    );

    // Iterate through each series, updating or adding if necessary
    let seriesIndex = 0; // Tracks the current series index
    Object.entries(periodogramData).forEach(([key, data]) => {
      // Update the primary series
      console.log(key)
      if (this.chartObject.series.length > seriesIndex) {
        this.chartObject.series[seriesIndex].update({
          name: `Channel ${seriesIndex + 1}`,
          data: data,
          type: 'line',
        });
      }
      seriesIndex++;
    });

    // Remove extra series if data has fewer series now
    while (seriesIndex < this.chartObject.series.length) {
      this.chartObject.series[this.chartObject.series.length - 1].remove();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private updateChart(): void {
    this.updateFlag = true;
  }

  private setChartTitle(): void {
    this.chartOptions.title = { text: this.service.getPeriodogramTitle() };
  }

  private setChartXAxis(): void {
    this.chartOptions.xAxis = {
      title: { text: this.service.getPeriodogramXAxisLabel() }
    };
  }

  private setChartYAxis(): void {
    this.chartOptions.yAxis = {
      title: { text: this.service.getPeriodogramYAxisLabel() }
    };
  }
}
