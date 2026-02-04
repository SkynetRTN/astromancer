import {Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {ECharts, EChartsOption} from 'echarts';
import {ThemeOption} from 'ngx-echarts';
import {filter, Subject, takeUntil} from 'rxjs';
import {
  ClusterPlotType,
  FILTER,
  filterFramingValue,
  getExtinction,
  PlotConfig,
  PlotFraming
} from '../../../cluster.util';
import {ClusterDataService} from '../../../cluster-data.service';
import {ClusterIsochroneService} from '../../cluster-isochrone.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../../environments/environment';
import {AppearanceService} from '../../../../../shared/settings/appearance/service/appearance.service';
import {getHighchartsEchartsTheme} from '../../../../../shared/settings/appearance/service/echarts-theme';

@Component({
  selector: 'app-plot-echart',
  templateUrl: './plot-echart.component.html',
  styleUrls: ['./plot-echart.component.scss']
})
export class PlotEchartComponent implements OnChanges, OnDestroy {
  @Input() plotConfig: PlotConfig | null = null;
  @Input() plotConfigIndex: number | null = null;
  @Input() isVertical: boolean = false;
  blueFilter: FILTER | null = null;
  redFilter: FILTER | null = null;
  lumFilter: FILTER | null = null;
  rawPlotData: rawDataPoint[] = [];
  chartOptions: EChartsOption = {};
  chartTheme: ThemeOption | string;
  private chartInstance?: ECharts;
  protected readonly PlotFraming = PlotFraming;
  protected readonly ClusterPlotType = ClusterPlotType;
  private dataRange: PlotRange | null = null;
  private standardViewRange: PlotRange | null = null;
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient,
              private dataService: ClusterDataService,
              private isochroneService: ClusterIsochroneService,
              private appearanceService: AppearanceService) {
    this.chartTheme = getHighchartsEchartsTheme(this.appearanceService.getColorTheme());
    this.isochroneService.plotParams$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateChartAxis();
        if (this.plotConfig?.plotType === ClusterPlotType.HR) {
          this.updateData();
        } else if (this.plotConfig?.plotType === ClusterPlotType.CM) {
          this.setIsochrone();
        }
      });
    this.isochroneService.maxMagError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateChartAxis();
        this.updateData();
      });
    this.isochroneService.isochroneParams$
      .pipe(filter(() => this.plotConfig !== null), takeUntil(this.destroy$))
      .subscribe(() => {
        this.setIsochrone();
      });
    this.appearanceService.colorTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.chartTheme = getHighchartsEchartsTheme(theme);
      });
  }

  onChartInit(chart: ECharts): void {
    this.chartInstance = chart;
    if (this.plotConfigIndex !== null) {
      this.isochroneService.setEChart(chart, this.plotConfigIndex);
    }
    this.refreshChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges() {
    this.updateFilters();
    this.generateRawData();
    this.updateData();
    this.updateChartAxis();
    this.setIsochrone();
    this.refreshChart();
  }

  frameOnData() {
    this.updatePlotConfig(PlotFraming.DATA);
    this.updateAxisRange(this.dataRange);
  }

  standardView() {
    this.updatePlotConfig(PlotFraming.STANDARD);
    this.updateAxisRange(this.standardViewRange);
  }

  private refreshChart(): void {
    this.chartOptions = this.buildChartOptions();
    this.chartInstance?.setOption(this.chartOptions, true);
  }

  private buildChartOptions(): EChartsOption {
    const plotData = this.getPlotData();
    this.updateDataRange(plotData[0]);
    this.updateStandardViewRange();
    const plotFraming = this.plotConfig?.plotFraming;
    const frameRange = plotFraming === PlotFraming.DATA || this.plotConfig?.plotType === ClusterPlotType.CM
      ? this.dataRange
      : this.standardViewRange;
    const axisTitles = this.getAxisTitles();
    return {
      animation: false,
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const value = params.value ?? params.data?.value;
          if (params.seriesName === 'Photometry') {
            const id = params.data?.id ?? '';
            return `${id}<br>x: ${value[0].toFixed(2)}<br>y: ${value[1].toFixed(2)}`;
          }
          if (!value) {
            return params.seriesName;
          }
          return `${params.seriesName}<br>${value[0].toFixed(2)}, ${value[1].toFixed(2)}`;
        }
      },
      xAxis: {
        type: 'value',
        name: axisTitles.xAxisTitle,
        min: frameRange?.x.min,
        max: frameRange?.x.max,
      },
      yAxis: {
        type: 'value',
        name: axisTitles.yAxisTitle,
        inverse: true,
        min: frameRange?.y.min,
        max: frameRange?.y.max,
      },
      series: [
        {
          name: 'Photometry',
          type: 'scatter',
          data: plotData[0].map((point, index) => ({value: point, id: plotData[1][index]})),
          symbolSize: 4,
        },
        {
          name: 'Isochrone',
          type: 'line',
          data: [],
          showSymbol: false,
        }
      ],
    };
  }

  private updateAxisRange(range: PlotRange | null): void {
    if (!range) {
      return;
    }
    this.chartInstance?.setOption({
      xAxis: {min: range.x.min, max: range.x.max},
      yAxis: {min: range.y.min, max: range.y.max},
    });
  }

  private setIsochrone() {
    if (this.plotConfig !== null) {
      const params = this.isochroneService.getIsochroneParams();
      this.http.get(`${environment.apiUrl}/cluster/isochrone`,
        {
          params: {
            'age': params.age,
            'metallicity': params.metallicity,
            'blue_filter': this.blueFilter!,
            'red_filter': this.redFilter!,
            'lum_filter': this.lumFilter!,
          }
        }).subscribe((data: any | {
        data: number[][],
        iSkip: number
      }) => {
        let isochroneData = data.data;
        if (this.plotConfig!.plotType === ClusterPlotType.CM) {
          const delta = this.computePlotDelta();
          isochroneData = isochroneData.map((point: number[]) => {
            return [point[0] - delta.x, point[1] - delta.y];
          });
        }
        if (data.iSkip > 0 && data.data.length > data.iSkip) {
          isochroneData = [
            ...isochroneData.slice(0, data.iSkip - 1),
            [null, null],
            ...isochroneData.slice(data.iSkip)
          ];
        }
        this.chartInstance?.setOption({
          series: [
            {},
            {
              name: 'Isochrone',
              type: 'line',
              data: isochroneData,
              showSymbol: false,
            }
          ]
        });
      });
    }
  }

  private getPlotData(): [number[][], string[]] {
    if (this.plotConfig !== null) {
      const data = this.rawPlotData.filter(
        (point) => point.maxMagError < this.isochroneService.getMaxMagError());
      let result: number[][] = [];
      let ids: string[] = [];
      if (this.plotConfig.plotType === ClusterPlotType.CM) {
        result = data.map((point) => [point.x, point.y]);
        ids = data.map(point => point.id);
      }
      if (this.plotConfig.plotType === ClusterPlotType.HR) {
        const delta = this.computePlotDelta();
        for (const point of data) {
          let x = point.x + delta.x;
          let y = point.y + delta.y;
          result.push([x, y]);
          ids.push(point.id);
        }
      }
      return [result, ids];
    }
    return [[], []];
  }

  private computePlotDelta(): { x: number, y: number } {
    const plotParams = this.isochroneService.getPlotParams();
    const blueExtinction = getExtinction(this.blueFilter!, plotParams.reddening);
    const redExtinction = getExtinction(this.redFilter!, plotParams.reddening);
    const lumExtinction = getExtinction(this.lumFilter!, plotParams.reddening);
    return {
      x: redExtinction - blueExtinction,
      y: -lumExtinction - 5 * Math.log10(plotParams.distance * 1000) + 5,
    };
  }

  private updatePlotConfig(plotFraming: PlotFraming) {
    if (this.plotConfig !== null && this.plotConfigIndex !== null) {
      this.plotConfig.plotFraming = plotFraming;
      this.isochroneService.updatePlotFraming(plotFraming, this.plotConfigIndex);
    }
  }

  private updateFilters() {
    if (this.plotConfig !== null) {
      this.blueFilter = this.plotConfig.filters.blue;
      this.redFilter = this.plotConfig.filters.red;
      this.lumFilter = this.plotConfig.filters.lum;
    } else {
      this.blueFilter = null;
      this.redFilter = null;
      this.lumFilter = null;
    }
  }

  private getAxisTitles(): {xAxisTitle: string; yAxisTitle: string} {
    if (this.plotConfig === null) {
      return {xAxisTitle: '', yAxisTitle: ''};
    }
    let xAxisTitle = `${this.blueFilter?.replace('prime', "'")} - ${this.redFilter?.replace('prime', "'")}`;
    let yAxisTitle = '';
    if (this.plotConfig.plotType === ClusterPlotType.HR) {
      xAxisTitle = `(${xAxisTitle})_0`;
      yAxisTitle = 'M_0';
    }
    yAxisTitle += `${this.lumFilter?.replace('prime', "'")}`;
    return {xAxisTitle, yAxisTitle};
  }

  private updateChartAxis() {
    if (this.plotConfig !== null) {
      this.updateStandardViewRange();
      const plotFraming = this.plotConfig.plotFraming;
      let frameRange: PlotRange;
      if (plotFraming === PlotFraming.DATA || this.plotConfig.plotType === ClusterPlotType.CM) {
        frameRange = this.dataRange!;
      } else {
        frameRange = this.standardViewRange!;
      }
      const axisTitles = this.getAxisTitles();
      this.chartInstance?.setOption({
        xAxis: {
          name: axisTitles.xAxisTitle,
          min: frameRange.x.min,
          max: frameRange.x.max,
        },
        yAxis: {
          name: axisTitles.yAxisTitle,
          inverse: true,
          min: frameRange.y.min,
          max: frameRange.y.max,
        }
      });
      if (plotFraming === PlotFraming.DATA || this.plotConfig.plotType === ClusterPlotType.CM) {
        this.frameOnData();
        this.isochroneService.updatePlotFraming(PlotFraming.DATA, this.plotConfigIndex!);
      } else if (plotFraming === PlotFraming.STANDARD) {
        this.standardView();
      }
    }
  }

  private updateData() {
    if (this.plotConfig !== null) {
      const data = this.getPlotData();
      this.updateDataRange(data[0]);
      this.chartInstance?.setOption({
        series: [
          {
            name: 'Photometry',
            type: 'scatter',
            data: data[0].map((point, index) => ({value: point, id: data[1][index]})),
            symbolSize: 4,
          },
          {},
        ]
      });
    }
  }

  private updateStandardViewRange() {
    let filters: {
      [key: string]: string
    } = {
      'red': this.redFilter!,
      'blue': this.blueFilter!,
      'lum': this.lumFilter!
    };
    let colorRed: number = filterFramingValue[filters['blue']]['red'] - filterFramingValue[filters['red']]['red'];
    let colorBlue: number = filterFramingValue[filters['blue']]['blue'] - filterFramingValue[filters['red']]['blue'];

    let minX = colorBlue - (colorRed - colorBlue) / 8;
    let maxX = colorRed + (colorRed - colorBlue) / 8;
    this.standardViewRange = {
      x: {
        min: minX <= maxX ? minX : maxX,
        max: maxX >= minX ? maxX : minX,
      },
      y: {
        min: filterFramingValue[filters['lum']]['bright']
          + (filterFramingValue[filters['lum']]['bright'] - filterFramingValue[filters['red']]['faint']) / 8,
        max: filterFramingValue[filters['lum']]['faint']
          - (filterFramingValue[filters['lum']]['bright'] - filterFramingValue[filters['lum']]['faint']) / 8,
      }
    };
  }

  private updateDataRange(data: number[][]) {
    if (data.length === 0) {
      this.dataRange = {
        x: {
          min: 0,
          max: 0,
        },
        y: {
          min: 0,
          max: 0,
        }
      };
      return;
    }
    this.dataRange = {
      x: {
        min: data[0][0],
        max: data[0][0],
      },
      y: {
        min: data[0][1],
        max: data[0][1],
      }
    };
    for (const point of data) {
      if (point[0] < this.dataRange.x.min) {
        this.dataRange.x.min = point[0];
      }
      if (point[0] > this.dataRange.x.max) {
        this.dataRange.x.max = point[0];
      }
      if (point[1] < this.dataRange.y.min) {
        this.dataRange.y.min = point[1];
      }
      if (point[1] > this.dataRange.y.max) {
        this.dataRange.y.max = point[1];
      }
    }
    const xDelta = (this.dataRange.x.max - this.dataRange.x.min) * 0.1;
    const yDelta = (this.dataRange.y.max - this.dataRange.y.min) * 0.1;
    if (xDelta > 0 && yDelta > 0) {
      this.dataRange.x.min -= xDelta;
      this.dataRange.x.max += xDelta;
      this.dataRange.y.min -= yDelta;
      this.dataRange.y.max += yDelta;
    }
  }

  private generateRawData() {
    this.rawPlotData = [];
    if (this.plotConfig !== null) {
      const sources = this.dataService.getSources(true);
      for (const source of sources) {
        let blueMag: number | null = null;
        let redMag: number | null = null;
        let lumMag: number | null = null;
        let maxMagError: number = 0;
        for (const photometry of source.photometries) {
          if (photometry.filter === this.blueFilter) {
            blueMag = photometry.mag;
            if (photometry.mag_error > maxMagError) {
              maxMagError = photometry.mag_error;
            } else if (maxMagError === null) {
              continue;
            }
          }
          if (photometry.filter === this.redFilter) {
            redMag = photometry.mag;
            if (photometry.mag_error > maxMagError) {
              maxMagError = photometry.mag_error;
            } else if (maxMagError === null) {
              continue;
            }
          }
          if (photometry.filter === this.lumFilter) {
            lumMag = photometry.mag;
            if (photometry.mag_error > maxMagError) {
              maxMagError = photometry.mag_error;
            } else if (maxMagError === null) {
            }
          }
        }
        if (blueMag !== null && redMag !== null && lumMag !== null) {
          this.rawPlotData.push({id: source.id, x: blueMag - redMag, y: lumMag, maxMagError: maxMagError});
        }
      }
    }
  }
}

interface PlotRange {
  x: {
    min: number,
    max: number
  },
  y: {
    min: number,
    max: number
  }
}

interface rawDataPoint {
  id: string,
  x: number,
  y: number,
  maxMagError: number,
}
