import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {ECharts, EChartsOption} from 'echarts';
import {ThemeOption} from 'ngx-echarts';
import {Subject, takeUntil} from 'rxjs';
import {AppearanceService} from '../../../shared/settings/appearance/service/appearance.service';
import {getEchartsTheme} from '../../../shared/settings/appearance/service/echarts-theme';
import {GalaxyService} from '../galaxy.service';
import {GalaxyOptions} from '../galaxy.service.util';

@Component({
  selector: 'app-galaxy-echart',
  templateUrl: './galaxy-echart.component.html',
  styleUrls: ['./galaxy-echart.component.scss']
})
export class GalaxyEchartComponent implements AfterViewInit, OnDestroy {
  chartOptions: EChartsOption = {};
  chartTheme: ThemeOption | string;
  private chartInstance?: ECharts;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private service: GalaxyService, private appearanceService: AppearanceService) {
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
    this.service.interface$
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
    const data = this.service.getDataArray();
    const channel = this.service.getChannel();
    const channelOneData = this.processData(data[0] ?? []);
    const channelTwoData = this.processData(data[1] ?? []);
    const showSymbolOne = this.shouldShowSymbol(channelOneData);
    const showSymbolTwo = this.shouldShowSymbol(channelTwoData);

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
        data: [GalaxyOptions.ONE, GalaxyOptions.TWO],
        selected: {
          [GalaxyOptions.ONE]: channel === GalaxyOptions.ONE,
          [GalaxyOptions.TWO]: channel === GalaxyOptions.TWO,
        },
        top: 24,
      },
      grid: {
        left: 48,
        right: 24,
        top: 64,
        bottom: 72,
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
        },
      ],
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
          name: GalaxyOptions.ONE,
          type: 'line',
          data: channelOneData,
          showSymbol: showSymbolOne,
          symbol: 'circle',
          symbolSize: 6,
        },
        {
          name: GalaxyOptions.TWO,
          type: 'line',
          data: channelTwoData,
          showSymbol: showSymbolTwo,
          symbol: 'circle',
          symbolSize: 6,
        },
      ],
    };
  }

  private processData(data: number[][]): number[][] {
    return data
      .filter((value: number[]) => value[0] !== null && value[1] !== null)
      .sort((a: number[], b: number[]) => a[0] - b[0]);
  }

  private shouldShowSymbol(data: number[][]): boolean {
    return data.length > 0 && data[0][0] < 1000;
  }
}
