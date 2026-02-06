import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {ECharts, EChartsOption} from 'echarts';
import {ThemeOption} from 'ngx-echarts';
import {Subject, takeUntil} from 'rxjs';
import {AppearanceService} from '../../../shared/settings/appearance/service/appearance.service';
import {getEchartsTheme} from '../../../shared/settings/appearance/service/echarts-theme';
import {ScatterService} from '../scatter.service';

interface AxisExtents {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

@Component({
  selector: 'app-scatter-echart',
  templateUrl: './scatter-echart.component.html',
  styleUrls: ['./scatter-echart.component.scss']
})
export class ScatterEchartComponent implements AfterViewInit, OnDestroy {
  chartOptions: EChartsOption = {};
  chartTheme: ThemeOption | string;
  private chartInstance?: ECharts;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private service: ScatterService, private appearanceService: AppearanceService) {
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
    const data = this.processData(this.service.getDataArray());
    const model = this.processModel(this.service.getModel());
    const cross = [[this.service.getDistance(), 0]];
    const extents = this.getAxisExtents(data);
    const dataLabel = this.service.getDataLabel();

    return {
      animation: false,
      title: {
        text: this.service.getChartTitle(),
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        data: ['Sun', dataLabel, 'Model'],
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
        min: extents.minX,
        max: extents.maxX,
        scale: true,
      },
      yAxis: {
        type: 'value',
        name: this.service.getYAxisLabel(),
        nameGap: 32,
        nameLocation: 'middle',
        min: extents.minY,
        max: extents.maxY,
        scale: true,
      },
      series: [
        {
          name: 'Sun',
          type: 'scatter',
          data: [[0, 0]],
          symbolSize: 20,
        },
        {
          name: dataLabel,
          type: 'scatter',
          data,
          symbolSize: 8,
        },
        {
          name: 'Model',
          type: 'scatter',
          data: model,
          symbolSize: 2,
        },
        {
          name: 'Cross',
          type: 'scatter',
          data: cross,
          symbol: 'diamond',
          symbolSize: 10,
          silent: true,
        },
      ],
    };
  }

  private processData(data: (number | null)[][]): number[][] {
    return data
      .filter((value: (number | null)[]) => value[0] !== null && value[1] !== null)
      .map((value) => [value[0] as number, value[1] as number]);
  }

  private processModel(data: number[][]): number[][] {
    return data.filter((value: number[]) => value[0] !== null && value[1] !== null);
  }

  private getAxisExtents(data: number[][]): AxisExtents {
    const points = data.length ? data.concat([[0, 0]]) : [[0, 0]];
    let minX = Math.min(...points.map((point) => point[0]));
    let maxX = Math.max(...points.map((point) => point[0]));
    let minY = Math.min(...points.map((point) => point[1]));
    let maxY = Math.max(...points.map((point) => point[1]));

    minX -= 2;
    maxX += 2;
    minY -= 2;
    maxY += 2;

    const width = this.chartInstance?.getWidth() ?? 0;
    const height = this.chartInstance?.getHeight() ?? 0;
    if (width > 0 && height > 0) {
      const plotRatio = width / height;
      const xDiff = maxX - minX;
      const yDiff = maxY - minY;
      const dataRatio = xDiff / yDiff;

      if (dataRatio < plotRatio) {
        const addition = (yDiff * plotRatio - xDiff) / 2;
        minX -= addition;
        maxX += addition;
      } else {
        const addition = (xDiff / plotRatio - yDiff) / 2;
        minY -= addition;
        maxY += addition;
      }
    }

    return {
      minX,
      maxX,
      minY,
      maxY,
    };
  }
}
