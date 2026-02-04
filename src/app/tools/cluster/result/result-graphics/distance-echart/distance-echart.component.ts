import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
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
  selector: 'app-cluster-summary-distance-echart',
  templateUrl: './distance-echart.component.html',
  styleUrls: ['./distance-echart.component.scss', '../result-graphics/result-graphics.component.scss']
})
export class DistanceEchartComponent implements OnChanges, OnInit, OnDestroy {
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

  ngOnInit(): void {
    this.update$?.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateDistance());
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
    const distance: number[] = [];
    this.allClusters?.forEach((cluster: ClusterMWSC) => {
      if (cluster.distance > 0) {
        distance.push(cluster.distance / 1000);
      }
    });
    distance.sort((a, b) => a - b);
    const histogram = computeHistogram(distance, undefined, {min: 0.01, max: 65});

    this.chartOptions = {
      animation: false,
      title: {
        text: 'Distance Among Milky Way Star Clusters'
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'value',
        name: 'Distance (kpc)',
        min: 0.01,
        max: 65,
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
          name: 'Pale Blue Dot',
          type: 'scatter',
          data: [[0.01, 0]],
          symbolSize: 8,
        },
        {
          name: this.service.getClusterName(),
          type: 'scatter',
          data: [[this.isochroneService.getPlotParams().distance, 0]],
          symbolSize: 10,
        },
        {
          name: 'Center of the Milky Way',
          type: 'scatter',
          data: [[8, 0]],
          symbol: 'triangle',
          symbolSize: 8,
        },
        {
          name: 'Other Side of the Milky Way',
          type: 'scatter',
          data: [[20, 0]],
          symbol: 'triangle',
          symbolSize: 8,
        },
        {
          name: 'Large Magellanic Cloud',
          type: 'scatter',
          data: [[50, 0]],
          symbol: 'rect',
          symbolSize: 8,
        },
        {
          name: 'Small Magellanic Cloud',
          type: 'scatter',
          data: [[62, 0]],
          symbol: 'rect',
          symbolSize: 6,
        },
      ]
    };
    this.chartInstance?.setOption(this.chartOptions, true);
  }

  private updateDistance() {
    this.chartInstance?.setOption({
      series: [
        {},
        {},
        {
          name: this.service.getClusterName(),
          type: 'scatter',
          data: [[this.isochroneService.getPlotParams().distance, 0]],
          symbolSize: 10,
        }
      ]
    });
  }
}
