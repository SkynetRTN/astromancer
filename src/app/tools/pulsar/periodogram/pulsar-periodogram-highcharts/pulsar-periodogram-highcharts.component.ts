import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Subject, takeUntil } from 'rxjs';
import { PulsarService } from '../../pulsar.service';

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
    title: {
      text: '' // Placeholder, dynamically updated
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      shared: false,
    },
    xAxis: {
      title: {
        text: '' // Placeholder, dynamically updated
      },
    },
    yAxis: {
      title: {
        text: '' // Placeholder, dynamically updated
      },
    },
    series: []
  };

  private destroy$: Subject<any> = new Subject<any>();

  constructor(private pulsarService: PulsarService) {}

  ngAfterViewInit(): void {
    this.initializeChart();

    // React to chart info updates
    this.pulsarService.chartInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateChartOptions();
    });

    // React to data updates
    this.pulsarService.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((data) => {
      console.log('Raw data:', data); // Debugging log
    
      // Filter out invalid data (null values)
      const filteredData = data
        .filter(item => item.frequency !== null && item.intensity !== null) // Exclude null values
        .map(item => ({ frequency: item.frequency!, intensity: item.intensity! })); // Assert non-null
    
      console.log('Filtered data:', filteredData); // Debugging log
    
      this.updateChartData(filteredData);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private initializeChart(): void {
    // Use ViewChild to ensure the container exists before initializing
    // this.chartObject = Highcharts.chart(this.chartContainer.nativeElement, this.chartOptions);
    this.pulsarService.setHighChart(this.chartObject);

    // Set initial options and data
    this.updateChartOptions();

    // Get initial data and update the chart
    const initialData = this.pulsarService.getData()
      .filter(item => item.frequency !== null && item.intensity !== null) // Exclude null values
      .map(item => ({ frequency: item.frequency!, intensity: item.intensity! })); // Assert non-null values

    this.updateChartData(initialData);
  }

  private updateChartOptions(): void {
    // Update chart titles and axis labels from the service
    this.chartObject.setTitle({ text: this.pulsarService.getChartTitle() });
    this.chartObject.xAxis[0].setTitle({ text: this.pulsarService.getXAxisLabel() });
    this.chartObject.yAxis[0].setTitle({ text: this.pulsarService.getYAxisLabel() });
  }

  private updateChartData(data: { frequency: number, intensity: number }[]): void {
    const chartData = data.map(item => [item.frequency, item.intensity]); // Format for Highcharts

    if (this.chartObject.series.length > 0) {
      // Update existing series
      this.chartObject.series[0].setData(chartData, true);
    } else {
      // Add a new series if none exists
      this.chartObject.addSeries({
        name: this.pulsarService.getDataLabel(),
        type: 'line',
        data: chartData,
        marker: {
          enabled: true,
          radius: 4,
          symbol: 'circle',
        },
        lineWidth: 1.5,
      });
    }
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event; // Use the instance passed from (chartInstance)
    this.pulsarService.setHighChart(this.chartObject);
  
    // Set initial chart data
    const initialData = this.pulsarService.resetData()
    // this.updateChartData(initialData);
  }  
}