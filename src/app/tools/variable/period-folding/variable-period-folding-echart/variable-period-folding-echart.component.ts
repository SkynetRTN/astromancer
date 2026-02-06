import {AfterViewInit, Component, ElementRef, OnDestroy} from '@angular/core';
import {ECharts, EChartsOption} from 'echarts';
import {ThemeOption} from 'ngx-echarts';
import {Subject, takeUntil} from 'rxjs';
import {AppearanceService} from '../../../../shared/settings/appearance/service/appearance.service';
import {getEchartsTheme} from '../../../../shared/settings/appearance/service/echarts-theme';
import {VariableService} from '../../variable.service';
import {VariableDisplayPeriod} from '../../variable.service.util';

const GRID_LEFT = 48;
const GRID_RIGHT = 24;
const GRID_TOP = 64;
const GRID_BOTTOM = 48;

@Component({
  selector: 'app-variable-period-folding-echart',
  templateUrl: './variable-period-folding-echart.component.html',
  styleUrls: ['./variable-period-folding-echart.component.scss']
})
export class VariablePeriodFoldingEchartComponent implements AfterViewInit, OnDestroy {
  chartOptions: EChartsOption = {};
  chartTheme: ThemeOption | string;
  private chartInstance?: ECharts;
  private destroy$: Subject<void> = new Subject<void>();
  private resizeObserver: ResizeObserver;

  constructor(
    private service: VariableService,
    private appearanceService: AppearanceService,
    private elementRef: ElementRef
  ) {
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
    // this.service.setEChartPeriodFolding(chart); // TODO: Add this method to service
    this.refreshChart();
  }

  ngAfterViewInit(): void {
    this.service.periodFoldingForm$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.refreshChart();
    });
    this.service.periodFoldingData$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.refreshChart();
    });

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
    const dataError = this.service.getPeriodFoldingChartDataWithError();
    const data = dataError['data'];
    const error = dataError['error'];
    const dataLabel = this.service.getPeriodFoldingDataLabel();
    const period = this.getXAxisMax();

    const allDataPoints: number[][] = [];
    data.forEach(p => {
      if (p[0] !== null && p[1] !== null) allDataPoints.push([p[0], p[1]])
    });

    const extents = this.getAxisExtents(allDataPoints);

    const series = [];

    // Data Series
    series.push({
      name: dataLabel,
      type: 'scatter',
      data: data.map(d => [d[0], d[1]]),
      symbolSize: 6,
      itemStyle: {
        color: '#5470c6'
      }
    });

    // Error Series
    const errorData = error.map(d => [d[0], d[1], d[2]]); // [x, lower, upper] assuming error is structured this way or similar
    // The Highcharts implementation pushes [x, y, error] or similar. Let's check service logic.
    // In Highcharts service: pfError.push([temp_x, error[i][1]!, error[i][2]!]); -> [x, min, max]
    // My ECharts renderItem expects [x, min, max] at indices 0, 1, 2. So this matches.

    series.push({
      type: 'custom',
      name: 'Error',
      itemStyle: {
        borderWidth: 1.5,
        color: '#5470c6'
      },
      renderItem: this.renderErrorBar,
      encode: {
        x: 0,
        y: [1, 2]
      },
      data: errorData,
      z: 100
    });


    return {
      animation: false,
      title: {
        text: this.service.getPeriodFoldingTitle(),
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.seriesType === 'custom') {
            // return x, y and error with 2 decimal places
            const x = params.value[0].toFixed(2);
            const y = params.value[1].toFixed(2);
            const errorPoint = errorData.find((e) => e[0] === params.value[0]);
            let errorText = '';
            if (errorPoint) {
              const errorMin = errorPoint[1];
              const errorMax = errorPoint[2];
              const uncertainty = ((errorMax - errorMin) / 2).toFixed(2);
              errorText = `±${uncertainty}`;
            }
            return `${dataLabel}<br/>X: ${x}<br/>Y: ${y}${errorText}`;
          }
          return '';
        }
      },
      legend: {
        data: [dataLabel],
        top: 24,
      },
      grid: {
        left: GRID_LEFT,
        right: GRID_RIGHT,
        top: GRID_TOP,
        bottom: GRID_BOTTOM,
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: this.service.getPeriodFoldingXAxisLabel(),
        nameGap: 30,
        nameLocation: 'middle',
        min: 0,
        max: period,
        scale: false, // Fixed range based on period
      },
      yAxis: {
        type: 'value',
        name: this.service.getPeriodFoldingYAxisLabel(),
        nameGap: 40,
        nameLocation: 'middle',
        min: extents.minY,
        max: extents.maxY,
        scale: true,
        inverse: true
      },
      series: series as any[],
    };
  }

  private getXAxisMax(): number {
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

    if (p - Math.floor(p) < delta) { // Using Math.floor(p) as equivalant to parseInt(p.toString()) for positive numbers
      p = Math.floor(p) + delta;
    }

    if (this.service.getPeriodFoldingDisplayPeriod() === VariableDisplayPeriod.TWO) {
      p = p * 2;
    }

    return parseFloat(p.toString());
  }

  private renderErrorBar(params: any, api: any) {
    const xValue = api.value(0);
    const highPoint = api.coord([xValue, api.value(1)]);
    const lowPoint = api.coord([xValue, api.value(2)]);
    const style = api.style({
      stroke: api.visual('color'),
      fill: undefined
    });

    return {
      type: 'group',
      children: [{
        type: 'line',
        shape: {
          x1: highPoint[0], y1: highPoint[1],
          x2: lowPoint[0], y2: lowPoint[1]
        },
        style: style
      }, {
        type: 'line',
        shape: {
          x1: highPoint[0] - 2, y1: highPoint[1],
          x2: highPoint[0] + 2, y2: highPoint[1]
        },
        style: style
      }, {
        type: 'line',
        shape: {
          x1: lowPoint[0] - 2, y1: lowPoint[1],
          x2: lowPoint[0] + 2, y2: lowPoint[1]
        },
        style: style
      }]
    };
  }

  private getAxisExtents(data: number[][]): { minX: number, maxX: number, minY: number, maxY: number } {
    if (data.length === 0) {
      return {minX: 0, maxX: 1, minY: 0, maxY: 1};
    }

    // minX/maxX not really used here since X axis is fixed 0-period, but kept for completeness/copy-paste
    let minX = Math.min(...data.map((point) => point[0]));
    let maxX = Math.max(...data.map((point) => point[0]));
    let minY = Math.min(...data.map((point) => point[1]));
    let maxY = Math.max(...data.map((point) => point[1]));

    const yPadding = (maxY - minY) * 0.05;

    minY -= yPadding;
    maxY += yPadding;

    if (minY === maxY) {
      minY -= 1;
      maxY += 1;
    }

    return {
      minX,
      maxX,
      minY: parseFloat(minY.toPrecision(4)),
      maxY: parseFloat(maxY.toPrecision(4)),
    };
  }
}
