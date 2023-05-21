import {AfterViewInit, Component} from '@angular/core';
import {Chart} from "chart.js";
import {ChartConfiguration, ChartOptions} from "chart.js/dist/types";
import {ChartComponent} from "../../shared/directives/chart.directive";
import {CurveService} from "../curve.service";

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
export class CurveChartComponent implements AfterViewInit {
  /**
   * The Chart.js Object
   */
  lineChart!: Chart;
  /**
   * Chart.js object data configuration
   */
  lineChartData: ChartConfiguration<'line'>['data'] = this.service.getChartData();
  /**
   * Chart.js object options configuration
   */
  lineChartOptions: ChartOptions<'line'> = this.service.getChartOptions();

  constructor(private service: CurveService) {
  }

  ngAfterViewInit(): void {
    this.lineChart = this.service.getChart();
    this.service.data$.subscribe(
      () => {
        this.lineChartData = this.service.getChartData();
        this.lineChart?.update('none');
      }
    )
    this.service.chartInfo$.subscribe(
      () => {
        this.lineChartOptions = this.service.getChartOptions();
        this.lineChart?.update('none');
      }
    )
  }
}
