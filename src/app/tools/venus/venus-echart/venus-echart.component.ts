import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import { Subject, takeUntil } from 'rxjs';
import { AppearanceService } from '../../../shared/settings/appearance/service/appearance.service';
import { getEchartsTheme } from '../../../shared/settings/appearance/service/echarts-theme';
import { VenusService } from '../venus.service';

@Component({
  selector: 'app-venus-echart',
  templateUrl: './venus-echart.component.html',
  styleUrls: ['./venus-echart.component.scss']
})
export class VenusEchartComponent implements AfterViewInit, OnDestroy {
  chartOptions: EChartsOption = {};
  chartTheme: ThemeOption | string;
  private chartInstance?: ECharts;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private service: VenusService, private appearanceService: AppearanceService) {
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
    const dataLabel = this.service.getDataLabel();
    const data = this.processData(this.service.getDataArray());
    const geocentricUpper = this.service.getGeocentricModelDataUpper();
    const geocentricLower = this.service.getGeocentricModelDataLower();
    const heliocentric = this.service.getHeliocentricModelData();

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
        data: [dataLabel, 'Geocentric', 'Heliocentric'],
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
        min: 'dataMin',
      },
      yAxis: {
        type: 'value',
        name: this.service.getYAxisLabel(),
        nameGap: 32,
        nameLocation: 'middle',
      },
      series: [
        {
          name: 'Geocentric',
          type: 'line',
          data: geocentricUpper,
          showSymbol: false,
          lineStyle: {
            width: 1,
          },
          areaStyle: {
            opacity: 0.2,
          },
        },
        {
          name: 'Geocentric',
          type: 'line',
          data: geocentricLower,
          showSymbol: false,
          lineStyle: {
            width: 1,
          },
          areaStyle: {
            opacity: 1,
            // the color must match the background to create the cutout effect
            color: this.appearanceService.getChartBackgroundColor(),
          },
        },
        {
          name: 'Heliocentric',
          type: 'line',
          data: heliocentric,
          showSymbol: false,
        },
        {
          name: dataLabel,
          type: 'scatter',
          data,
          symbolSize: 12,
        },
      ],
    };
  }

  private processData(data: (number | null)[][]): number[][] {
    return data
      .filter((value: (number | null)[]) => value[0] !== null && value[1] !== null)
      .map((value) => [value[0] as number, value[1] as number])
      .sort((a: number[], b: number[]) => a[0] - b[0]);
  }
}
