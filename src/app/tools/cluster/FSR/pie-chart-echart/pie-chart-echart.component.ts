import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {ECharts, EChartsOption} from 'echarts';
import {ThemeOption} from 'ngx-echarts';
import {Subject, takeUntil} from 'rxjs';
import {ClusterDataService} from '../../cluster-data.service';
import {AppearanceService} from '../../../../shared/settings/appearance/service/appearance.service';
import {getHighchartsEchartsTheme} from '../../../../shared/settings/appearance/service/echarts-theme';

@Component({
  selector: 'app-pie-chart-echart',
  templateUrl: './pie-chart-echart.component.html',
  styleUrls: ['./pie-chart-echart.component.scss']
})
export class PieChartEchartComponent implements AfterViewInit, OnDestroy {
  chartOptions: EChartsOption = {};
  chartTheme: ThemeOption | string;
  private chartInstance?: ECharts;
  private destroy$ = new Subject<void>();

  constructor(private dataService: ClusterDataService,
              private appearanceService: AppearanceService) {
    this.chartTheme = getHighchartsEchartsTheme(this.appearanceService.getColorTheme());
  }

  onChartInit(chart: ECharts): void {
    this.chartInstance = chart;
    this.refreshChart();
  }

  ngAfterViewInit(): void {
    this.refreshChart();
    this.dataService.clusterSources
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
    this.chartOptions = {
      animation: false,
      title: {
        text: undefined,
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Counts',
          type: 'pie',
          radius: '65%',
          label: {
            formatter: '{b} {d} %',
          },
          data: [
            {name: 'Cluster Stars', value: this.getClusterStarCount()},
            {name: 'Field Stars', value: this.getFieldStarCount()},
          ],
        }
      ],
    };
    this.chartInstance?.setOption(this.chartOptions, true);
  }

  private getClusterStarCount() {
    return this.dataService.getSources(true).length;
  }

  private getFieldStarCount() {
    return this.dataService.getSources().length - this.getClusterStarCount();
  }
}
