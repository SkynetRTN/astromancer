import {AfterViewInit, Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {ECharts, EChartsOption} from 'echarts';
import {ThemeOption} from 'ngx-echarts';
import {Observable, Subject, takeUntil} from 'rxjs';
import {ClusterMWSC} from '../../../storage/cluster-storage.service.util';
import {ClusterService} from '../../../cluster.service';
import {ClusterIsochroneService} from '../../../isochrone-matching/cluster-isochrone.service';
import {AppearanceService} from '../../../../../shared/settings/appearance/service/appearance.service';
import {getHighchartsEchartsTheme} from '../../../../../shared/settings/appearance/service/echarts-theme';
import {computeHistogram} from '../../../echarts-utils';

@Component({
  selector: 'app-reddening-echart',
  templateUrl: './reddening-echart.component.html',
  styleUrls: ['./reddening-echart.component.scss', '../result-graphics/result-graphics.component.scss']
})
export class ReddeningEchartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() allClusters!: ClusterMWSC[];
  @Input() update$!: Observable<void>;

  chartOptions: EChartsOption = {};
  chartTheme: ThemeOption | string;
  private chartInstance?: ECharts;
  private destroy$ = new Subject<void>();

  constructor(private service: ClusterService,
              private isochroneService: ClusterIsochroneService,
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
    this.updateData();
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
    const reddening: number[] = [];
    this.allClusters?.forEach((cluster: ClusterMWSC) => {
      if (cluster.reddening !== null && cluster.reddening !== undefined
        && cluster.reddening > -0.2 && cluster.reddening < 1) {
        reddening.push(cluster.reddening);
      }
    });
    reddening.sort((a, b) => a - b);
    const histogram = computeHistogram(reddening, undefined, {min: -0.2, max: 1});

    this.chartOptions = {
      animation: false,
      title: {
        text: 'Reddening Among Milky Way Star Clusters'
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'value',
        name: 'Reddening (mag)',
        min: -0.2,
        max: 1,
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
          data: [[this.isochroneService.getPlotParams().reddening, 0]],
          symbolSize: 10,
        }
      ],
    };
    this.chartInstance?.setOption(this.chartOptions, true);
  }

  private updateData(): void {
    this.chartInstance?.setOption({
      series: [
        {},
        {
          name: this.service.getClusterName(),
          type: 'scatter',
          data: [[this.isochroneService.getPlotParams().reddening, 0]],
          symbolSize: 10,
        }
      ]
    });
  }
}
