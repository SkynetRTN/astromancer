import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { RadioSearchHighChartService } from '../radiosearch.service';
import { Subject, takeUntil } from 'rxjs';
import { log } from 'console';

@Component({
  selector: 'app-radiosearch-highchart',
  templateUrl: './radiosearch-high-chart.component.html',
  styleUrls: ['./radiosearch-high-chart.component.scss']
})
export class RadioSearchHighChartComponent implements AfterViewInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;

  chartConstructor: string = "chart";
  chartObject!: Highcharts.Chart;

  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: true,
    },
    title: {
      useHTML: true  // Allow HTML in the chart title
    },
    legend: {
      align: 'center',
    },
    tooltip: {
      enabled: true,
      shared: true,
    },
    exporting: {
      buttons: {
        contextButton: {
          enabled: false,
        }
      }
    },
  };


  private destroy$: Subject<any> = new Subject<any>();

  constructor(private service: RadioSearchHighChartService) {
    this.setChartTitle();
    this.setChartXAxis();
    this.setChartYAxis();
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
  }

  ngAfterViewInit(): void {
    this.setChartSeries();

    // React to chart information changes
    this.service.chartInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setChartYAxis();
      this.setChartXAxis();
      this.setChartTitle();
      this.updateChart();
    });

    // React to data changes
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.animateSeriesUpdate();
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
    this.chartOptions.title = { text: this.service.getChartTitle() };
  }

  private setChartSeries(): void {
    const frequencyFluxData = this.processData(this.service.getDataArray());

    // Clear any existing series before adding a new one
    if (this.chartObject && this.chartObject.series.length > 0) {
      this.chartObject.series[0].remove(false);
    }

    // Add a new series with animation enabled
    this.chartObject?.addSeries({
      name: "Frequency vs Flux",
      type: 'line',
      data: frequencyFluxData,
      marker: {
        enabled: true,
        symbol: 'circle',
        radius: 4
      },
      animation: {
        duration: 2000,  // 2 seconds duration for drawing the line
        easing: 'easeOut'
      }
    }, true);
  }


  private animateSeriesUpdate(): void {
    const frequencyFluxData = this.processData(this.service.getDataArray());

    // Separate data points for y (actual) and fit (line of best fit)
    const actualData = frequencyFluxData.map((point) => ({
        x: point[0],
        y: point[1]
    }));

    const fitData = frequencyFluxData.map((point) => ({
        x: point[0],
        y: point[2]
    }));

    // Clear all existing series before adding the new data
    while (this.chartObject?.series.length) {
      this.chartObject.series[0].remove(false); // Remove each series without redrawing yet
    }

    // Add the actual data series
    this.chartObject?.addSeries({
        name: "Frequency vs Flux (Actual)",
        type: 'scatter',
        data: actualData,
        marker: {
            enabled: true,
            symbol: 'circle',
            radius: 4,
            fillColor: '#007bff' // Color for actual data points
        },
        lineWidth: 1,
        animation: {
            duration: 2000,
            easing: 'easeOut'
        }
    }, true);

    // Add the fit line series
    this.chartObject?.addSeries({
        name: "Frequency vs Flux (Fit)",
        type: 'scatter',
        data: fitData,
        marker: {
          enabled: true,
          symbol: 'triangle',
          radius: 4,
          fillColor: '#007bff' // Color for actual data points
      },
        color: '#ff0000', // Color for the fit line
        lineWidth: 1, // Thicker line to distinguish fit
        animation: {
            duration: 2000,
            easing: 'easeOut'
        }
    }, true);
  }


  private setChartXAxis(): void {
    this.chartOptions.xAxis = {
      title: { text: this.service.getXAxisLabel() }
    };
  }

  private setChartYAxis(): void {
    this.chartOptions.yAxis = {
      title: { text: this.service.getYAxisLabel() }
    };
  }

  private processData(data: number[][]): number[][] {
    return data.filter((value: number[]) => {
      return (value[0] !== null);
    }).sort((a: number[], b: number[]) => {
      return a[0] - b[0];
    });
  }
}
