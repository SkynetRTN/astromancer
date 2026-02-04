import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {ECharts, EChartsOption} from 'echarts';
import {ThemeOption} from 'ngx-echarts';
import {Subject, debounceTime, takeUntil} from 'rxjs';
import {ClusterService} from '../../cluster.service';
import {ClusterDataService} from '../../cluster-data.service';
import {AppearanceService} from '../../../../shared/settings/appearance/service/appearance.service';
import {getHighchartsEchartsTheme} from '../../../../shared/settings/appearance/service/echarts-theme';

@Component({
  selector: 'app-pm-chart-echart',
  templateUrl: './pm-chart-echart.component.html',
  styleUrls: ['./pm-chart-echart.component.scss']
})
export class PmChartEchartComponent implements AfterViewInit, OnDestroy {
  chartOptions: EChartsOption = {};
  chartTheme: ThemeOption | string;
  private chartInstance?: ECharts;
  private destroy$ = new Subject<void>();

  constructor(private service: ClusterService,
              private dataService: ClusterDataService,
              private appearanceService: AppearanceService) {
    this.chartTheme = getHighchartsEchartsTheme(this.appearanceService.getColorTheme());
  }

  onChartInit(chart: ECharts): void {
    this.chartInstance = chart;
    this.service.setFsrECharts(chart, 0);
    this.refreshChart();
  }

  ngAfterViewInit(): void {
    this.refreshChart();
    this.dataService.clusterSources
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => this.refreshChart());
    this.service.fsrFraming$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refreshChart());
    this.appearanceService.colorTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.chartTheme = getHighchartsEchartsTheme(theme);
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
    const data = this.dataService.get2DpmChartData();
    const framing = this.service.getFsrFraming();
    return {
      animation: false,
      title: {
        text: 'Proper Motion',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Cluster Stars', 'Field Stars', 'PM Cut'],
      },
      xAxis: {
        type: 'value',
        name: 'Proper Motion in RA (mas/yr)',
        min: framing.pm_ra?.min,
        max: framing.pm_ra?.max,
      },
      yAxis: {
        type: 'value',
        name: 'Proper Motion in Dec (mas/yr)',
        min: framing.pm_dec?.min,
        max: framing.pm_dec?.max,
      },
      series: [
        {
          name: 'Cluster Stars',
          type: 'scatter',
          data: data['cluster'],
          symbolSize: 3,
        },
        {
          name: 'Field Stars',
          type: 'scatter',
          data: data['field'],
          symbolSize: 3,
        },
        {
          name: 'PM Cut',
          type: 'line',
          data: this.getCutData(),
          showSymbol: false,
        },
      ],
    };
  }

  private getCutData(): number[][] {
    const data: number[][] = [];
    if (this.service.getFsrParams().pm_dec == null || this.service.getFsrParams().pm_ra == null) {
      return [];
    }
    const segments = 80;
    const maxDec = this.service.getFsrParams().pm_dec!.max;
    const minDec = this.service.getFsrParams().pm_dec!.min;
    const maxRa = this.service.getFsrParams().pm_ra!.max;
    const minRa = this.service.getFsrParams().pm_ra!.min;
    const delta = 2 * Math.PI / segments;
    const a = (maxRa - minRa) / 2;
    const b = (maxDec - minDec) / 2;
    const centerRa = (maxRa + minRa) / 2;
    const centerDec = (maxDec + minDec) / 2;
    for (let i = 0; i < segments; i++) {
      const x = a * Math.cos(i * delta) + centerRa;
      const y = b * Math.sin(i * delta) + centerDec;
      data.push([x, y]);
    }
    return data;
  }
}
