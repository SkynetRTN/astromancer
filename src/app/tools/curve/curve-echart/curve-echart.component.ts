import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {ECharts, EChartsOption} from "echarts";
import {CurveService} from "../curve.service";
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-curve-echart',
  templateUrl: './curve-echart.component.html',
  styleUrls: ['./curve-echart.component.scss']
})
export class CurveEchartComponent implements AfterViewInit, OnDestroy {
  chartOptions: EChartsOption = {};
  private chartInstance?: ECharts;
  private destroy$: Subject<any> = new Subject<any>();

  constructor(private service: CurveService) {
    this.chartOptions = this.buildChartOptions();
  }

  onChartInit(chart: ECharts) {
    this.chartInstance = chart;
    this.service.setEChart(chart);
    this.refreshChart();
  }

  ngAfterViewInit(): void {
    this.service.chartInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refreshChart());
    this.service.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refreshChart());
    this.service.interface$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refreshChart());
    this.service.dataKeys$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refreshChart());
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private refreshChart(): void {
    this.chartOptions = this.buildChartOptions();
    this.chartInstance?.setOption(this.chartOptions, true);
  }

  private buildChartOptions(): EChartsOption {
    const labels = this.service.getDataLabelArray().slice(1, 5);
    const data = this.service.getDataArray();
    const curveCount = this.service.getCurveCount();
    const legendSelected: Record<string, boolean> = {};
    labels.forEach((label, index) => {
      legendSelected[label] = index < curveCount;
    });

    return {
      animation: false,
      title: {
        text: this.service.getChartTitle(),
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: labels,
        selected: legendSelected,
        top: 24,
      },
      grid: {
        left: 48,
        right: 24,
        top: 64,
        bottom: 48,
      },
      xAxis: {
        type: 'value',
        name: this.service.getXAxisLabel(),
      },
      yAxis: {
        type: 'value',
        name: this.service.getYAxisLabel(),
        inverse: this.service.getIsMagnitudeOn(),
      },
      series: labels.map((label, index) => ({
        name: label,
        type: 'line',
        showSymbol: false,
        data: this.processData(data[index] ?? []),
      })),
    };
  }

  private processData(data: number[][]): number[][] {
    return data
      .filter((value: number[]) => value[0] !== null)
      .sort((a: number[], b: number[]) => a[0] - b[0]);
  }
}
