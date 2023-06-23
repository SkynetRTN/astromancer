import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {Chart} from "chart.js";
import {ChartConfiguration, ChartOptions} from "chart.js/dist/types";
import {CurveService} from "../curve.service";
import {ChartInfo, MyChart} from "../../shared/charts/chart.interface";
import {MyData} from "../../shared/data/data.interface";
import {CurveChartInfo, CurveCounts, CurveDataDict, CurveInterface} from "../curve.service.util";
import {AppearanceService} from "../../../shared/settings/appearance/service/appearance.service";
import {ChartColor} from "../../../shared/settings/appearance/service/appearance.utils";
import {Subject, takeUntil} from 'rxjs';

/**
 * Chart for the curve graphing tools.
 *
 */
@Component({
  selector: 'app-curve-chart',
  templateUrl: './curve-chart.component.html',
  styleUrls: ['./curve-chart.component.scss'],
})
export class CurveChartComponent implements AfterViewInit, OnDestroy {
  /**
   * Chart.js object id
   */
  id!: string;
  /**
   * Custom Chart object
   */
  chart!: CurveChart;
  /**
   * Chart.js object data configuration
   */
  lineChartData!: ChartConfiguration<'line'>['data'];
  /**
   * Chart.js object options configuration
   */
  lineChartOptions!: ChartOptions<'line'>;
  private destroy$: Subject<any> = new Subject<any>();

  constructor(private service: CurveService, private appearanceService: AppearanceService) {
    this.id = "curve-chart";
    Chart.defaults.color = this.appearanceService.getChartFontColor();
    Chart.defaults.borderColor = this.appearanceService.getChartBackgroundColor();
    this.chart = new CurveChart(this.id);
    this.lineChartData = this.chart.generateChartConfig(
      this.service.getDataObject(),
      this.service.getChartInfoObject(),
      this.service.getInterfaceObject());
    this.lineChartOptions = this.chart.generateChartOptions(
      this.service.getChartInfoObject(),
      this.service.getInterfaceObject()
    );
  }


  ngAfterViewInit(): void {
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      () => {
        this.lineChartData = this.chart.generateChartConfig(
          this.service.getDataObject(),
          this.service.getChartInfoObject(),
          this.service.getInterfaceObject());
        this.chart.renderChart();
      }
    )
    this.service.chartInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      () => {
        this.lineChartOptions = this.chart.generateChartOptions(
          this.service.getChartInfoObject(),
          this.service.getInterfaceObject()
        );
        this.chart.renderChart();
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

class CurveChart implements MyChart {
  private readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  public generateChartConfig(data: MyData, chartInfo: ChartInfo, toolInterface: any): ChartConfiguration<'line'>['data'] {
    return this.generateCurveChartConfig(
      data.getData(),
      (toolInterface as CurveInterface).getCurveCount(),
      (chartInfo as CurveChartInfo).getTableLabels());
  }

  public generateChartOptions(chartInfo: ChartInfo, toolInterface: any): ChartOptions {
    return {
      responsive: true,
      maintainAspectRatio: false,
      hover: {mode: 'nearest'},
      scales: {
        x: {
          title: {text: (chartInfo as CurveChartInfo).getXAxisLabel(), display: true},
          type: 'linear',
          position: 'bottom',
        },
        y: {
          title: {text: (chartInfo as CurveChartInfo).getYAxisLabel(), display: true},
          reverse: (toolInterface as CurveInterface).getIsMagnitudeOn(),
        }
      },
      plugins: {
        title: {
          text: (chartInfo as CurveChartInfo).getChartTitle(),
          display: true,
        },
        colors: {
          forceOverride: true,
        }
      },
      animation: {
        duration: 0,
      }
    };
  }

  public renderChart(): void {
    Chart.getChart(this.id)?.update('none');
  }

  private generateCurveChartConfig(chartData: CurveDataDict[], curveCount: number, labels: string[]): ChartConfiguration<'line'>['data'] {
    let result: any = {datasets: []};
    const data = this.makeRawData(chartData, curveCount);
    for (let i = 0; i < curveCount; i++) {
      result['datasets'].push({
        label: labels[i + 1],
        data: data[i],
        borderWidth: 2,
        tension: 0.1,
        fill: false,
        color: ChartColor.getLineColor(i),
        backgroundColor: ChartColor.getLineColor(i),
        borderColor: ChartColor.getLineColor(i),
        pointBackgroundColor: ChartColor.getLineColor(i),
        pointBorderColor: ChartColor.getLineColor(i),
      })
    }
    return result;
  }

  private makeRawData(dataDict: CurveDataDict[], curveCount: number): any[][] {
    const data = dataDict;
    let result: any[][] = [[], [], [], []];
    if (data.length == 0)
      return result;
    for (let i = 0; i < data.length; i++) {
      if (curveCount >= CurveCounts.ONE && data[i].y1 != null)
        result[0].push({x: data[i].x, y: data[i].y1});
      if (curveCount >= CurveCounts.TWO && data[i].y2 != null)
        result[1].push({x: data[i].x, y: data[i].y2});
      if (curveCount >= CurveCounts.THREE && data[i].y3 != null)
        result[2].push({x: data[i].x, y: data[i].y3});
      if (curveCount >= CurveCounts.FOUR && data[i].y4 != null)
        result[3].push({x: data[i].x, y: data[i].y4});
    }
    return result;
  }

}
