import {AfterViewInit, Component, ElementRef, OnDestroy} from '@angular/core';
import {ECharts, EChartsOption} from 'echarts';
import {ThemeOption} from 'ngx-echarts';
import {Subject, takeUntil} from 'rxjs';
import {AppearanceService} from '../../../../shared/settings/appearance/service/appearance.service';
import {getEchartsTheme} from '../../../../shared/settings/appearance/service/echarts-theme';
import {VariableService} from '../../variable.service';

const GRID_LEFT = 48;
const GRID_RIGHT = 24;
const GRID_TOP = 64;
const GRID_BOTTOM = 48;

@Component({
  selector: 'app-variable-periodogram-echart',
  templateUrl: './variable-periodogram-echart.component.html',
  styleUrls: ['./variable-periodogram-echart.component.scss']
})
export class VariablePeriodogramEchartComponent implements AfterViewInit, OnDestroy {
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
    // this.service.setEChartPeriodogram(chart); // TODO: Add this method to service
    this.refreshChart();
  }

  ngAfterViewInit(): void {
    this.service.periodogramForm$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.refreshChart();
    });
    this.service.periodogramData$.pipe(
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
    const dataLabel = this.service.getPeriodogramDataLabel();
    const data = this.service.getChartPeriodogramDataArray(
      this.service.getPeriodogramStartPeriod(),
      this.service.getPeriodogramEndPeriod()
    );

    const allDataPoints: number[][] = [];
    data.forEach(p => {
      if (p[0] !== null && p[1] !== null) allDataPoints.push([p[0], p[1]])
    });

    // Axis extents
    let minX = this.service.getPeriodogramStartPeriod();
    let maxX = this.service.getPeriodogramEndPeriod();
    let minY = 0;
    let maxY = 1;

    if (allDataPoints.length > 0) {
      minY = Math.min(...allDataPoints.map((point) => point[1]));
      maxY = Math.max(...allDataPoints.map((point) => point[1]));
      const yPadding = (maxY - minY) * 0.05;
      minY -= yPadding;
      maxY += yPadding;
      minY = parseFloat(minY.toPrecision(4));
      maxY = parseFloat(maxY.toPrecision(4));
    }


    const series = [{
      name: dataLabel,
      type: 'scatter',
      data: data.map(d => [d[0], d[1]]),
      symbolSize: 4,
      itemStyle: {
        color: '#5470c6'
      }
    }];

    return {
      animation: false,
      title: {
        text: this.service.getPeriodogramTitle(),
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const value = (params as any).value;
          const period = parseFloat(value[0]).toFixed(4);
          const power = parseFloat(value[1]).toFixed(4);
          return `${dataLabel}<br/>Period: ${period}<br/>Power: ${power}`;
        },
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
        type: 'log', // Logarithmic axis
        name: this.service.getPeriodogramXAxisLabel(),
        nameGap: 30,
        nameLocation: 'middle',
        min: minX,
        max: maxX,
      },
      yAxis: {
        type: 'value',
        name: this.service.getPeriodogramYAxisLabel(),
        nameGap: 30,
        nameLocation: 'middle',
        min: minY,
        max: maxY,
        scale: true,
      },
      series: series as any[],
    };
  }
}
