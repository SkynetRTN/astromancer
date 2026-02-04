import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {ECharts, EChartsOption} from 'echarts';
import {ThemeOption} from 'ngx-echarts';
import {Subject, debounceTime, takeUntil} from 'rxjs';
import {ClusterDataService} from '../../cluster-data.service';
import {CMDFilterSet, FILTER} from '../../cluster.util';
import {AppearanceService} from '../../../../shared/settings/appearance/service/appearance.service';
import {getHighchartsEchartsTheme} from '../../../../shared/settings/appearance/service/echarts-theme';

@Component({
  selector: 'app-cmd-fsr-echart',
  templateUrl: './cmd-fsr-echart.component.html',
  styleUrls: ['./cmd-fsr-echart.component.scss']
})
export class CmdFsrEchartComponent implements AfterViewInit, OnDestroy {
  chartOptions: EChartsOption = {};
  chartTheme: ThemeOption | string;
  private chartInstance?: ECharts;
  private destroy$ = new Subject<void>();
  private blueFilter: FILTER = FILTER.BP;
  private redFilter: FILTER = FILTER.RP;

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
      .pipe(debounceTime(500), takeUntil(this.destroy$))
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
    const data = this.getCmdData();
    return {
      animation: false,
      title: {
        text: undefined,
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'value',
        name: `${this.blueFilter} - ${this.redFilter} (mag)`,
      },
      yAxis: {
        type: 'value',
        name: `${this.redFilter} (mag)`,
        inverse: true,
      },
      series: [
        {
          name: 'Color-Magnitude',
          type: 'scatter',
          data,
          symbolSize: 3,
        },
      ],
    };
  }

  private getCmdData(): number[][] {
    const sources = this.dataService.getSources(true);
    const filters = this.dataService.getFilters();
    const availableFilterSets: CMDFilterSet[] = [];
    const result: number[][][] = [];
    if (filters.includes(FILTER.BP) && filters.includes(FILTER.RP)) {
      availableFilterSets.push({blue: FILTER.BP, red: FILTER.RP});
      result.push([]);
    }
    if (filters.includes(FILTER.W1) && filters.includes(FILTER.W2)) {
      availableFilterSets.push({blue: FILTER.W1, red: FILTER.W2});
      result.push([]);
    }
    if (filters.includes(FILTER.G_PRIME) && filters.includes(FILTER.I_PRIME)) {
      availableFilterSets.push({blue: FILTER.G_PRIME, red: FILTER.I_PRIME});
      result.push([]);
    }
    if (filters.includes(FILTER.J) && filters.includes(FILTER.H)) {
      availableFilterSets.push({blue: FILTER.J, red: FILTER.H});
      result.push([]);
    }
    if (availableFilterSets.length === 0) {
      availableFilterSets.push({blue: filters[0], red: filters[1]});
      result.push([]);
    }
    for (const source of sources) {
      if (source.photometries) {
        const sourceFilters: FILTER[] = source.photometries.map(p => p.filter);
        for (let i = 0; i < availableFilterSets.length; i++) {
          const filterSet = availableFilterSets[i];
          let blueMag: number | undefined;
          let redMag: number | undefined;
          if (sourceFilters.includes(filterSet.blue) && sourceFilters.includes(filterSet.red)) {
            blueMag = source.photometries.find(p => p.filter === filterSet.blue)?.mag;
            redMag = source.photometries.find(p => p.filter === filterSet.red)?.mag;
            result[i].push([blueMag! - redMag!, redMag!]);
          }
        }
      }
    }
    const resultLengths = result.map(r => r.length);
    const maxLengthIndex = resultLengths.indexOf(Math.max(...resultLengths));
    this.blueFilter = availableFilterSets[maxLengthIndex].blue;
    this.redFilter = availableFilterSets[maxLengthIndex].red;
    return result[maxLengthIndex];
  }
}
