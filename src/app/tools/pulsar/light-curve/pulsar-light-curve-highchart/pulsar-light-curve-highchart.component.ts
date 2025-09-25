import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import * as Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more';
import Boost from 'highcharts/modules/boost';
import { PulsarService } from '../../pulsar.service';

More(Highcharts);
Boost(Highcharts);

@Component({
  selector: 'app-pulsar-light-curve-highchart',
  templateUrl: './pulsar-light-curve-highchart.component.html',
  styleUrls: ['./pulsar-light-curve-highchart.component.scss']
})
export class PulsarLightCurveHighchartComponent implements AfterViewInit, OnDestroy {

  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = 'chart'; // preserve old name for template
  chartObject!: Highcharts.Chart;
  updateFlag: boolean = true;

  chartTitle: string = this.pulsarService.getChartTitle();
  xAxisLabel: string = 'Time (s)';
  yAxisLabel: string = 'Intensity';
  dataLabel1: string = 'Polarization XX';
  dataLabel2: string = 'Polarization YY';

  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: true,
      zooming: {
        type: 'xy',
        key: 'shift',
      },
    },
    legend: { enabled: true },
    tooltip: { enabled: true, shared: false },
    boost: {
      enabled: true,
      usePreallocated: true, // correct property name
      seriesThreshold: 5000, // start boost above N points
    },
    exporting: {
      buttons: { contextButton: { enabled: false } }
    }
  };

  private destroy$ = new Subject<void>();

  constructor(private pulsarService: PulsarService) {
    More(Highcharts);
    this.setChartTitle();
    this.setChartXAxis();
    this.setChartYAxis();
  }

  // Preserve this for template binding
  chartInitialized(chart: Highcharts.Chart) {
    this.chartObject = chart;
    this.pulsarService.setHighChartLightCurve(chart);
  }

  ngAfterViewInit(): void {

    this.initializeChart();

    // Combine table type and data observables so the chart updates whenever either changes
    combineLatest([
      this.pulsarService.tableType$,
      this.pulsarService.data$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const tableType = this.pulsarService.getTableType?.() || 'subtracted';
        const src = tableType === 'raw'
          ? this.pulsarService.getRawData()
          : this.pulsarService.getData();

        const processedData = src
          .filter(item => item.jd !== null && item.source1 !== null && item.source2 !== null)
          .map(item => ({
            frequency: item.jd!,
            channel1: item.source1!,
            channel2: item.source2!
          }));

        this.updateChartData(processedData);
      });

    // Update chart titles, axes, and series labels
    this.pulsarService.chartInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateChartOptions();
        this.setChartTitle();
        this.setChartXAxis();
        this.setChartYAxis();
        this.updateSources();
        this.updateChart();
      });

    // Initial chart population
    const initialType = this.pulsarService.getTableType?.() || 'subtracted';
    const initialSrc = initialType === 'raw'
      ? this.pulsarService.getRawData()
      : this.pulsarService.getData();

    const initialData = initialSrc
      .filter(item => item.jd !== null && item.source1 !== null && item.source2 !== null)
      .map(item => ({
        frequency: item.jd!,
        channel1: item.source1!,
        channel2: item.source2!
      }));

    this.updateChartData(initialData);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeChart(): void {
    this.pulsarService.setHighChartLightCurve(this.chartObject);
    this.updateChartOptions();
  }

  private updateChartOptions(): void {
    if (!this.chartObject) return;
    this.chartObject.setTitle({ text: this.chartTitle });
    this.chartObject.xAxis[0]?.setTitle({ text: this.xAxisLabel });
    this.chartObject.yAxis[0]?.setTitle({ text: this.yAxisLabel });
  }

  private updateChartData(data: { frequency: number, channel1: number, channel2: number }[]): void {
    if (!this.chartObject) return;

    const chartData = data.map(d => [d.frequency, d.channel1]);
    const calData = data.map(d => [d.frequency, d.channel2]);

    const seriesOptions: Highcharts.SeriesLineOptions[] = [
      {
        type: 'line',
        name: this.dataLabel1,
        data: chartData,
        lineWidth: 0.1,
        marker: { enabled: false },
        turboThreshold: 20000
      },
      {
        type: 'line',
        name: this.dataLabel2,
        data: calData,
        lineWidth: 0.1,
        marker: { enabled: false },
        turboThreshold: 20000
      }
    ];

    // Update or add series
    seriesOptions.forEach((s, i) => {
      if (this.chartObject.series[i]) {
        this.chartObject.series[i].update(s, true);
      } else {
        this.chartObject.addSeries(s, true);
      }
    });
  }

  updateSources() {
    const labels = this.pulsarService.getDataLabelArray();
    const data = this.pulsarService.getChartSourcesDataArray();

    labels.forEach((label, i) => {
      if (this.chartObject.series[i]) {
        this.chartObject.series[i].update({
          name: label,
          data: data[i],
          type: 'line',
          marker: { symbol: i === 0 ? 'circle' : 'triangle' }
        });
      }
    });
  }

  setPulsar() {
    this.chartObject.addSeries({
      name: this.pulsarService.getDataLabel(),
      data: this.pulsarService.getChartPulsarDataArray(),
      type: 'line',
      tooltip: { pointFormat: '<b>({point.x:.2f}, {point.y:.2f})</b>' }
    });
  }

  private updateChart(): void {
    this.updateFlag = true;
  }

  private setChartTitle(): void { this.chartOptions.title = { text: this.pulsarService.getChartTitle() }; }
  private setChartXAxis(): void { this.chartOptions.xAxis = { title: { text: this.pulsarService.getXAxisLabel() } }; }
  private setChartYAxis(): void { this.chartOptions.yAxis = { title: { text: this.pulsarService.getYAxisLabel() } }; }

}
