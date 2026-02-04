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
  selector: 'app-age-echart',
  templateUrl: './age-echart.component.html',
  styleUrls: ['./age-echart.component.scss', '../result-graphics/result-graphics.component.scss']
})
export class AgeEchartComponent implements OnChanges, AfterViewInit, OnDestroy {
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
    this.update$?.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateData();
    });
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
    const ages: number[] = [];
    this.allClusters?.forEach((cluster: ClusterMWSC) => {
      if (cluster.age !== null && cluster.age !== undefined) {
        const age = Math.pow(10, cluster.age) / 1000000;
        if (age > 0 && age < 13.8) {
          ages.push(age);
        }
      }
    });
    ages.sort((a, b) => a - b);
    const histogram = computeHistogram(ages, undefined, {min: 0, max: 13.8});

    this.chartOptions = {
      animation: false,
      title: {
        text: 'Age Among Milky Way Star Clusters'
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'value',
        name: 'Age (billion years)',
        min: 0,
        max: 13.8,
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
          name: 'Us, Now',
          type: 'scatter',
          data: [[0, 0]],
          symbolSize: 8,
        },
        {
          name: this.service.getClusterName(),
          type: 'scatter',
          data: [[Math.pow(10, this.isochroneService.getIsochroneParams().age) / 1000000, 0]],
          symbolSize: 10,
        },
        {
          name: 'Sun',
          type: 'scatter',
          data: [[4.6, 0]],
          symbolSize: 8,
        },
        {
          name: 'First Stars',
          type: 'scatter',
          data: [[13.4, 0]],
          symbol: 'diamond',
          symbolSize: 8,
        },
        {
          name: 'Big Bang',
          type: 'scatter',
          data: [[13.8, 0]],
          symbolSize: 9,
        }
      ],
    };
    this.chartInstance?.setOption(this.chartOptions, true);
  }

  private updateData(): void {
    this.chartInstance?.setOption({
      series: [
        {},
        {},
        {
          name: this.service.getClusterName(),
          type: 'scatter',
          data: [[Math.pow(10, this.isochroneService.getIsochroneParams().age) / 1000000, 0]],
          symbolSize: 10,
        }
      ]
    });
  }
}
