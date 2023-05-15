import {AfterViewInit, Component} from '@angular/core';
import {Chart} from "chart.js";
import {ChartConfiguration, ChartOptions} from "chart.js/dist/types";
import {ChartComponent} from "../../shared/directives/chart.directive";
import {CurveCounts, CurveDataDict, CurveObservable} from "../../../model/curve.model";
import {CurveDataService} from "../../../service/curve-data.service";

/**
 * Chart for the curve graphing tools.
 *
 * Implements the {@link ChartComponent} interface.
 */
@Component({
  selector: 'app-curve-chart',
  templateUrl: './curve-chart.component.html',
  styleUrls: ['./curve-chart.component.scss'],
})
export class CurveChartComponent implements CurveObservable, AfterViewInit {
  /**
   * The Chart.js Object
   */
  lineChart!: Chart;
  /**
   * Chart.js object data configuration
   */
  lineChartData: ChartConfiguration<'line'>['data'] =
    this.getChartData(this.dataService.getData(), this.dataService.getCurveCount());
  /**
   * Chart.js object options configuration
   */
  lineChartOptions: ChartOptions<'line'> = this.getChartOptions();

  constructor(private dataService: CurveDataService) {
    this.dataService.addObserver(this);
    console.log("constructor");
  }

  ngAfterViewInit(): void {
    this.lineChart = Chart.getChart("chart") as Chart;
  }

  update(): void {
    // console.log(this.dataService.getData())
    this.lineChartData = this.getChartData(this.dataService.getData(),
      this.dataService.getCurveCount());
    this.lineChart?.update("none");
  }

  private getChartData(dataDict: CurveDataDict[], curveCount: number): ChartConfiguration<'line'>['data'] {
    const data = this.getChartDataRaw(dataDict, curveCount);
    return {
      datasets: [
        {
          label: 'y1',
          data: data[0],
          borderWidth: 2,
          tension: 0.1,
          fill: false,
          hidden: data[0].length == 0,
        }, {
          label: 'y2',
          data: data[1],
          borderWidth: 2,
          tension: 0.1,
          fill: false,
          hidden: data[1].length == 0,
        }, {
          label: 'y3',
          data: data[2],
          borderWidth: 2,
          tension: 0.1,
          fill: false,
          hidden: data[2].length == 0,
        }, {
          label: 'y4',
          data: data[3],
          borderWidth: 2,
          tension: 0.1,
          fill: false,
          hidden: data[3].length == 0,
        }
      ]
    };
  }

  private getChartDataRaw(dataDict: CurveDataDict[], curveCount: number): any[][] {
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

  private getChartOptions(): ChartOptions<'line'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      hover: {mode: 'nearest'},
      scales: {
        x: {
          title: {text: 'x', display: true},
          type: 'linear',
          position: 'bottom',
        },
        y: {
          title: {text: 'y', display: true},
          reverse: false,
        }
      },
      plugins: {
        title: {
          text: 'Title',
          display: true,
        }
      }
    };
  }

}
