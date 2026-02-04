import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {ECharts, EChartsOption} from 'echarts';
import {ThemeOption} from 'ngx-echarts';
import {Subject, takeUntil} from 'rxjs';
import {AppearanceService} from '../../../shared/settings/appearance/service/appearance.service';
import {getEchartsTheme} from '../../../shared/settings/appearance/service/echarts-theme';
import {MoonService} from '../moon.service';

@Component({
  selector: 'app-moon-echart',
  templateUrl: './moon-echart.component.html',
  styleUrls: ['./moon-echart.component.scss']
})
export class MoonEchartComponent implements AfterViewInit, OnDestroy {
  chartOptions: EChartsOption = {};
  chartTheme: ThemeOption | string;
  private chartInstance?: ECharts;
  private destroy$: Subject<any> = new Subject<any>();

  constructor(private service: MoonService, private appearanceService: AppearanceService) {
    this.chartOptions = this.buildChartOptions();
    this.chartTheme = getEchartsTheme(this.appearanceService.getColorTheme());
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
    this.appearanceService.colorTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme) => {
        this.chartTheme = getEchartsTheme(theme);
      });
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
    const dataLabel = this.service.getDataLabel();
    const data = this.service.getDataArray();
    const modelData = this.service.getMoonModelData();
    const xRange = this.service.getDataJdRange();

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
        data: [dataLabel, 'Model'],
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
        min: xRange[0],
        max: xRange[1],
      },
      yAxis: {
        type: 'value',
        name: this.service.getYAxisLabel(),
        nameLocation: 'middle',
        nameGap: 32,
      },
      series: [
        {
          name: dataLabel,
          type: 'scatter',
          data: this.processData(data),
          symbolSize: 6,
        },
        {
          name: 'Model',
          type: 'line',
          showSymbol: false,
          data: modelData,
        }
      ],
    };
  }

  private processData(data: number[][]): number[][] {
    return data
      .filter((value: number[]) => value[0] !== null && value[1] !== null)
      .sort((a: number[], b: number[]) => a[0] - b[0]);
  }
}
