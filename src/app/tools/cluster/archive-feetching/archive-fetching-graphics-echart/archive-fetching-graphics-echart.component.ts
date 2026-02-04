import {Component, OnDestroy} from '@angular/core';
import {ECharts, EChartsOption} from 'echarts';
import {ThemeOption} from 'ngx-echarts';
import {Subject, takeUntil} from 'rxjs';
import {ClusterService} from '../../cluster.service';
import {ClusterDataService} from '../../cluster-data.service';
import {AppearanceService} from '../../../../shared/settings/appearance/service/appearance.service';
import {getHighchartsEchartsTheme} from '../../../../shared/settings/appearance/service/echarts-theme';

@Component({
  selector: 'app-archive-fetching-graphics-echart',
  templateUrl: './archive-fetching-graphics-echart.component.html',
  styleUrls: ['./archive-fetching-graphics-echart.component.scss', '../../../shared/interface/tools.scss']
})
export class ArchiveFetchingGraphicsEchartComponent implements OnDestroy {
  chartOptions: EChartsOption = {};
  chartTheme: ThemeOption | string;
  private chartInstance?: ECharts;
  private destroy$ = new Subject<void>();

  constructor(
    private service: ClusterService,
    private dataService: ClusterDataService,
    private appearanceService: AppearanceService) {
    this.chartTheme = getHighchartsEchartsTheme(this.appearanceService.getColorTheme());
    this.dataService.sources$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.refreshChart();
    });
    this.service.tabIndex$
      .pipe(takeUntil(this.destroy$))
      .subscribe(index => {
        if (index === 2) {
          this.refreshChart();
        }
      });
    this.appearanceService.colorTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.chartTheme = getHighchartsEchartsTheme(theme);
      });
  }

  onChartInit(chart: ECharts): void {
    this.chartInstance = chart;
    this.refreshChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refreshChart() {
    const axisLabels: string[] = [];
    const unusedCounts: number[] = [];
    const fieldCounts: number[] = [];
    const clusterCounts: number[] = [];
    const starCounts = this.dataService.getInterfaceStarCounts();
    if (Object.keys(starCounts).includes('user')) {
      axisLabels.push('User');
      unusedCounts.push(0);
      fieldCounts.push(this.dataService.getInterfaceStarCounts().user.field_stars);
      clusterCounts.push(this.dataService.getInterfaceStarCounts().user.cluster_stars);
    }
    if (Object.keys(starCounts).includes('GAIA')) {
      axisLabels.push('GAIA');
      unusedCounts.push(this.dataService.getInterfaceStarCounts().GAIA.unused_stars);
      fieldCounts.push(this.dataService.getInterfaceStarCounts().GAIA.field_stars);
      clusterCounts.push(this.dataService.getInterfaceStarCounts().GAIA.cluster_stars);
    }
    if (Object.keys(starCounts).includes('APASS')) {
      axisLabels.push('APASS');
      unusedCounts.push(this.dataService.getInterfaceStarCounts().APASS.unused_stars);
      fieldCounts.push(this.dataService.getInterfaceStarCounts().APASS.field_stars);
      clusterCounts.push(this.dataService.getInterfaceStarCounts().APASS.cluster_stars);
    }
    if (Object.keys(starCounts).includes('TWO_MASS')) {
      axisLabels.push('2MASS');
      unusedCounts.push(this.dataService.getInterfaceStarCounts().TWO_MASS.unused_stars);
      fieldCounts.push(this.dataService.getInterfaceStarCounts().TWO_MASS.field_stars);
      clusterCounts.push(this.dataService.getInterfaceStarCounts().TWO_MASS.cluster_stars);
    }
    if (Object.keys(starCounts).includes('WISE')) {
      axisLabels.push('WISE');
      unusedCounts.push(this.dataService.getInterfaceStarCounts().WISE.unused_stars);
      fieldCounts.push(this.dataService.getInterfaceStarCounts().WISE.field_stars);
      clusterCounts.push(this.dataService.getInterfaceStarCounts().WISE.cluster_stars);
    }
    this.chartOptions = {
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: {type: 'shadow'},
      },
      legend: {
        data: ['Unused Catalog Stars', 'Field Stars', 'Cluster Stars'],
      },
      xAxis: {
        type: 'category',
        data: axisLabels,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Unused Catalog Stars',
          type: 'bar',
          stack: 'total',
          data: unusedCounts,
        },
        {
          name: 'Field Stars',
          type: 'bar',
          stack: 'total',
          data: fieldCounts,
        },
        {
          name: 'Cluster Stars',
          type: 'bar',
          stack: 'total',
          data: clusterCounts,
        },
      ],
    };
    this.chartInstance?.setOption(this.chartOptions, true);
  }
}
