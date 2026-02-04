import {AfterViewInit, Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {ECharts, EChartsOption} from 'echarts';
import {ThemeOption} from 'ngx-echarts';
import {Observable, Subject, takeUntil} from 'rxjs';
import {ClusterMWSC} from '../../../storage/cluster-storage.service.util';
import {ClusterService} from '../../../cluster.service';
import {ClusterDataService} from '../../../cluster-data.service';
import {AppearanceService} from '../../../../../shared/settings/appearance/service/appearance.service';
import {getHighchartsEchartsTheme} from '../../../../../shared/settings/appearance/service/echarts-theme';
import {computeHistogram} from '../../../echarts-utils';

@Component({
  selector: 'app-number-of-stars-echart',
  templateUrl: './number-of-stars-echart.component.html',
  styleUrls: ['./number-of-stars-echart.component.scss', '../result-graphics/result-graphics.component.scss']
})
export class NumberOfStarsEchartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() allClusters!: ClusterMWSC[];
  @Input() update$!: Observable<void>;

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
    this.refreshChart();
  }

  ngOnChanges(): void {
    this.refreshChart();
  }

  ngAfterViewInit(): void {
    this.dataService.sources$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateData());
    this.update$?.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateData());
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
    let counts: number[] = [];
    this.allClusters?.forEach((cluster: ClusterMWSC) => {
      if (cluster.num_cluster_stars && cluster.num_cluster_stars > 0) {
        counts.push(cluster.num_cluster_stars);
      }
    });
    counts.sort((a, b) => a - b);
    counts = counts.slice(Math.floor(0.0015 * counts.length), Math.ceil(0.99985 * counts.length));
    const histogram = computeHistogram(counts);

    this.chartOptions = {
      animation: false,
      title: {
        text: 'Number of Cluster Stars Among Milky Way Star Clusters'
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'value',
        name: 'Number of Stars in each Cluster',
        min: 0,
      },
      yAxis: {
        type: 'value',
        name: '# Clusters in Bin',
        min: 0,
      },
      series: [
        {
          name: '#Clusters in Bin',
          type: 'bar',
          data: histogram.bins,
          barMaxWidth: 18,
        },
        {
          name: this.service.getClusterName(),
          type: 'scatter',
          data: [[this.dataService.getSources(true).length, 0]],
          symbolSize: 10,
        }
      ]
    };
    this.chartInstance?.setOption(this.chartOptions, true);
  }

  private updateData(): void {
    const counts = this.dataService.getSources(true).length;
    this.chartInstance?.setOption({
      series: [
        {},
        {
          name: this.service.getClusterName(),
          type: 'scatter',
          data: [[counts, 0]],
          symbolSize: 10,
        }
      ]
    });
  }
}
