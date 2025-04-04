import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import * as Highcharts from "highcharts";
import More from "highcharts/highcharts-more";
import {PulsarService} from "../../pulsar.service";

@Component({
  selector: 'app-pulsar-light-curve-highchart',
  templateUrl: './pulsar-light-curve-highchart.component.html',
  styleUrls: ['./pulsar-light-curve-highchart.component.scss']
})
export class PulsarLightCurveHighchartComponent implements AfterViewInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;
  chartTitle: string = 'Title';
  xAxisLabel: string = '';
  yAxisLabel: string = 'y';
  dataLabel1: string = 'Channel 1';
  dataLabel2: string = 'Channel 2';

  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: true,
      zooming: {
        type: 'xy',
        key: 'shift',
      },
    },
    legend: {
      enabled: true,
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
  
  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event; // Use the instance passed from (chartInstance)
    this.pulsarService.setHighChartLightCurve(this.chartObject);
  
    // Set initial chart data
    const initialData = this.pulsarService.resetData()
    // this.updateChartData(initialData);
  }  


  private destroy$: Subject<any> = new Subject<any>();

  constructor(private pulsarService: PulsarService) {
    More(Highcharts);
        this.setChartTitle();
        this.setChartXAxis();
        this.setChartYAxis();
  }

  ngAfterViewInit(): void {
    this.initializeChart();

    // React to chart info updates
    this.pulsarService.chartInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateChartOptions();
      this.setChartTitle();
      this.setChartXAxis();
      this.setChartYAxis();
      this.updateSources();
      this.updateChart();
    });

    // React to data updates
    this.pulsarService.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((data) => {
    
      // Filter out invalid data (null values)
      const filteredData = this.pulsarService.getData()
      .filter(item => item.jd !== null && item.source1 !== null && item.source2 !== null) // Exclude null values
      .map(item => ({ frequency: item.jd!, channel1: item.source1!, channel2: item.source2! })); // Assert non-null values
    
    // Process the filtered data
    const processedData = filteredData.map(item => ({
      frequency: item.frequency,
      channel1: item.channel1,
      channel2: item.channel2
    }));

    this.updateChartData(processedData);
  });
}
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private initializeChart(): void {
    // Use ViewChild to ensure the container exists before initializing
    // this.chartObject = Highcharts.chart(this.chartContainer.nativeElement, this.chartOptions);
    this.pulsarService.setHighChartLightCurve(this.chartObject);

    // Set initial options and data
    this.updateChartOptions();

    // Get initial data and update the chart
    const initialData = this.pulsarService.getData()
      .filter(item => item.jd !== null && item.source1 !== null) // Exclude null values
      .map(item => ({ frequency: item.jd!, channel1: item.source1!, channel2: item.source2! })); // Assert non-null values

    this.updateChartData(initialData);
  }

  updateChartOptions(): void {
    // Update chart titles and axis labels from the service
    this.chartObject.setTitle({ text: this.chartTitle });
    this.chartObject.xAxis[0].setTitle({ text: this.xAxisLabel });
    this.chartObject.yAxis[0].setTitle({ text: this.yAxisLabel });
  }

  private updateChartData(data: { frequency: number, channel1: number, channel2: number }[]): void {
    const chartData = data.map(item => [item.frequency, item.channel1]); // Main data
    const calData = data.map(item => [item.frequency, item.channel2]); // Calibration data
  
    // Check if series exists before updating or adding
    if (this.chartObject.series.length > 0) {
      this.chartObject.series[0].setData(chartData, true);
  
      // If the second series exists, update it
      if (this.chartObject.series.length > 1) {
        this.chartObject.series[1].setData(calData, true);
      } else {
        // Add the second series if it doesn't exist
        this.chartObject.addSeries({
          name: this.dataLabel2, // Second series name
          type: 'line',
          data: calData,
          lineWidth: .1, // Thin line
          marker: {
            enabled: true,
            radius: 2,
            symbol: 'triangle', // Different marker for distinction
          },
        });
      }
    } else {
      // If no series exists, create both series
      this.chartObject.addSeries({
        name: this.dataLabel1, // First series name
        type: 'line',
        data: chartData,
        lineWidth: .1, 
        marker: {
          enabled: true,
          radius: 2,
          symbol: 'circle',
        },
      });
  
      this.chartObject.addSeries({
        name: this.dataLabel2, // Second series name
        type: 'line',
        data: calData,
        lineWidth: .1, 
        marker: {
          enabled: true,
          radius: 2,
          symbol: 'triangle',
        },
      });
    }
  }

  
  updateSources() {
    const labels: string[] = this.pulsarService.getDataLabelArray();
    const data: (number | null)[][][] = this.pulsarService.getChartSourcesDataArray();
    for (let i = 0; i < labels.length; i++) {
      if (this.chartObject.series[i]) {
        this.chartObject.series[i].update({
          name: labels[i],
          data: data[i],
          type: 'line',
          marker: {
            symbol: i === 0 ? 'circle' : 'triangle', // Different marker for distinction
          }
        });
      }
    }
  }

  
  setPulsar() {
    this.chartObject.addSeries({
      name: this.pulsarService.getDataLabel(),
      data: this.pulsarService.getChartPulsarDataArray(),
      type: 'line',
      tooltip: {
        pointFormat: '<b>({point.x:.2f}, {point.y:.2f})</b>'
      }
    });
  }


  private updateChart(): void {
    this.updateFlag = true;
  }

  private setChartTitle(): void {
    this.chartOptions.title = {text: this.pulsarService.getChartTitle()};
  }

  private setChartXAxis(): void {
    this.chartOptions.xAxis = {
      title: {text: this.pulsarService.getXAxisLabel()}
    };
  }

  private setChartYAxis(): void {
    this.chartOptions.yAxis = {
      title: {text: this.pulsarService.getYAxisLabel()},
    };
  }

  private setDatalabels(): void {
    
}
}