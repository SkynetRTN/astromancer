import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import { Subject, takeUntil } from 'rxjs';
import { AppearanceService } from '../../../shared/settings/appearance/service/appearance.service';
import { getEchartsTheme } from '../../../shared/settings/appearance/service/echarts-theme';
import { ScatterService } from '../scatter.service';

interface AxisExtents {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const GRID_LEFT = 48;
const GRID_RIGHT = 24;
const GRID_TOP = 64;
const GRID_BOTTOM = 48;

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
  private resizeObserver: ResizeObserver;

  constructor(
    private service: ScatterService,
    private appearanceService: AppearanceService,
    private elementRef: ElementRef
  ) {
    this.chartOptions = this.buildChartOptions();
    this.chartTheme = getEchartsTheme(this.appearanceService.getColorTheme());

    this.resizeObserver = new ResizeObserver(() => {
      if (this.chartInstance) {
        this.chartInstance.resize();
        this.refreshChart();
      }
    });
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

    this.resizeObserver.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
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
        left: GRID_LEFT,
        right: GRID_RIGHT,
        top: GRID_TOP,
        bottom: GRID_BOTTOM,
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
          color: '#FFD700',
        },
        {
          name: dataLabel,
          type: 'scatter',
          data,
          symbolSize: 8,
        },
        {
          name: 'Model',
          type: 'line',
          data: model,
          showSymbol: false,
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

    // Calculate the actual grid size (available drawing area)
    const gridWidth = width - GRID_LEFT - GRID_RIGHT;
    const gridHeight = height - GRID_TOP - GRID_BOTTOM;

    // Ensure legitimate dimensions to avoid aspect ratio explosion
    if (gridWidth > 20 && gridHeight > 20) {
      const plotRatio = gridWidth / gridHeight;
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
    // round all numbers to nearest .1 before returning
    minX = Math.round(minX * 10) / 10;
    maxX = Math.round(maxX * 10) / 10;
    minY = Math.round(minY * 10) / 10;
    maxY = Math.round(maxY * 10) / 10;
    return {
      minX,
      maxX,
      minY,
      maxY,
    };
  }
}
