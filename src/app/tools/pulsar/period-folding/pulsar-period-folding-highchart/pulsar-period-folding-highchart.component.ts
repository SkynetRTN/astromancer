import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from "rxjs";
import { PulsarService } from "../../pulsar.service";
import * as Highcharts from 'highcharts';
import More from "highcharts/highcharts-more";
import { PulsarDisplayPeriod } from '../../pulsar.service.util';

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

    // Handle form changes
    this.service.periodFoldingForm$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setChartTitle();
      this.setChartXAxis();
      this.setChartYAxis();
      this.updateChart();
    });

    // Handle data updates
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
    const data = this.service.getPeriodFoldingChartData();
    const bins = 100; // Number of bins
  
    // Bin and process primary series (pfData1)
    const binnedData1 = this.binData(data['data'], bins);
    
    this.chartObject.addSeries({
      name: 'Source 1', // Label for first series
      data: binnedData1,
      type: 'line',
      marker: {
        symbol: 'circle',
        radius: 2,
      }
    });
  
    // Process and bin secondary series (pfData2) if it exists
    if (data['data2']) {
      const calibration = this.service.getPeriodFoldingCal();
      const adjustedData2 = data['data2'].map(point => [point[0], point[1] * calibration]);
  
      const binnedData2 = this.binData(adjustedData2, bins);
  
      this.chartObject.addSeries({
        name: 'Source 2', // Label for second series
        data: binnedData2, // Use binned data
        type: 'line',
        marker: {
          symbol: 'circle',
          radius: 2,
        }
      });
    }
  }  
  

  updateData() {
    const data = this.service.getPeriodFoldingChartData();
    const bins = 100; // Number of bins
  
    // Update the first series (pfData1) with binned data
    const binnedData1 = this.binData(data['data'], bins);
    this.chartObject.series[0].setData(binnedData1);
  
    // Handle the second series (pfData2)
    if (data['data2']) {
      const calibration = this.service.getPeriodFoldingCal();
      const adjustedData2 = data['data2'].map(point => [point[0], point[1] * calibration]);
  
      const binnedData2 = this.binData(adjustedData2, bins);
  
      if (this.chartObject.series.length < 2) {
        // Add the second series if not already present
        this.chartObject.addSeries({
          name: 'Source 2',
          data: binnedData2, // Use binned data
          type: 'line',
          marker: {
            symbol: 'circle',
            radius: 2,
          }
        });
      } else {
        // Update the existing second series
        this.chartObject.series[1].setData(binnedData2);
      }
    } else if (this.chartObject.series.length > 1) {
      // Remove the second series if it exists but no data is available
      this.chartObject.series[1].remove();
    }
  }  
  

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private updateXAxisScale(): void {
    let p = this.service.getPeriodFoldingPeriod();
    let delta = 0;

    if (p > 4.95) {
      delta = 0.15;
    } else if (p > 0.5) {
      delta = 0.1;
    } else if (p > 0.05) {
      delta = 0.01;
    } else if (p > 0.005) {
      delta = 0.001;
    } else if (p > 0.0005) {
      delta = 0.0001;
    } else if (p > 0.00005) {
      delta = 0.00001;
    } else {
      delta = 0.000001;
    }

    if (p - parseInt(p.toString()) < delta) {
      p = parseInt(p.toString()) + delta;
    }

    if (this.service.getPeriodFoldingDisplayPeriod() === PulsarDisplayPeriod.TWO) {
      p = p * 2;
    }

    this.chartObject.xAxis[0].setExtremes(0, parseFloat(p.toString()));
  }

  private binData(data: number[][], bins: number): number[][] {
    if (data.length === 0) return [];
  
    // Retrieve the phase value
    const phase = this.service.getPeriodFoldingPhase();
    const period = this.service.getPeriodFoldingPeriod();

    // Calculate bin size
    const xMin = Math.min(...data.map(point => point[0]));
    const xMax = Math.max(...data.map(point => point[0]));
    const binSize = (xMax - xMin) / bins;
  
    // Initialize bins
    const binnedData: { x: number; ySum: number; count: number }[] = Array(bins)
      .fill(0)
      .map((_, index) => ({
        // Shift bin center by phase
        x: xMin + index * binSize + binSize / 2,
        ySum: 0,
        count: 0,
      }));
  
    // Populate bins
    data.forEach(([x, y]) => {
      const binIndex = Math.floor((x - xMin) / binSize);
      if (binIndex >= 0 && binIndex < bins) {
        binnedData[binIndex].ySum += y;
        binnedData[binIndex].count += 1;
      }
    });
  
    // Compute averages
    return binnedData
      .filter(bin => bin.count > 0) // Ignore empty bins
      .map(bin => [bin.x, bin.ySum / bin.count]);
  }
  
  
  private updateChart(): void {
    this.updateFlag = true;
  }

  private setChartTitle(): void {
    this.chartOptions.title = { text: this.service.getPeriodFoldingTitle() };
  }

  private setChartXAxis(): void {
    this.chartOptions.xAxis = {
      title: { text: this.service.getPeriodFoldingXAxisLabel() }
    };
  }

  private setChartYAxis(): void {
    this.chartOptions.yAxis = {
      title: { text: this.service.getPeriodFoldingYAxisLabel() },
    };
  }
}
