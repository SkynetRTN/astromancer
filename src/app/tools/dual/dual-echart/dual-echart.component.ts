import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {ECharts, EChartsOption} from 'echarts';
import {ThemeOption} from 'ngx-echarts';
import {Subject, takeUntil} from 'rxjs';
import {AppearanceService} from '../../../shared/settings/appearance/service/appearance.service';
import {getEchartsTheme} from '../../../shared/settings/appearance/service/echarts-theme';
import {DualService} from '../dual.service';

@Component({
  selector: 'app-dual-echart',
  templateUrl: './dual-echart.component.html',
  styleUrls: ['./dual-echart.component.scss']
})
export class DualEchartComponent implements AfterViewInit, OnDestroy {
  chartOptions: EChartsOption = {};
  chartTheme: ThemeOption | string;
  private chartInstance?: ECharts;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private service: DualService, private appearanceService: AppearanceService) {
    this.chartOptions = this.buildChartOptions();
    this.chartTheme = getEchartsTheme(this.appearanceService.getColorTheme());
  }

  onChartInit(chart: ECharts) {
    this.chartInstance = chart;
    this.service.setEChart(chart);
    this.refreshChart();
  }

  ngAfterViewInit(): void {
    this.service.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refreshChart());
    this.service.chartInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refreshChart());
    this.appearanceService.colorTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme) => {
        this.chartTheme = getEchartsTheme(theme);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private refreshChart(): void {
    this.chartOptions = this.buildChartOptions();
    this.chartInstance?.setOption(this.chartOptions, true);
  }

  private buildChartOptions(): EChartsOption {
    const labels = this.service.getDataLabelArray();
    const data = this.service.getDataArray();

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
        data: [labels[1], labels[3]],
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
        nameGap: 32,
        nameLocation: 'middle',
      },
      yAxis: {
        type: 'value',
        name: this.service.getYAxisLabel(),
        nameGap: 32,
        nameLocation: 'middle',
      },
      series: [
        {
          name: labels[1],
          type: 'line',
          data: this.processData(data[0] ?? []),
        },
        {
          name: labels[3],
          type: 'line',
          data: this.processData(data[1] ?? []),
        },
      ],
    };
  }

  private processData(data: number[][]): number[][] {
    return data
      .filter((value: number[]) => value[0] !== null && value[1] !== null)
      .sort((a: number[], b: number[]) => a[0] - b[0]);
  }
}
