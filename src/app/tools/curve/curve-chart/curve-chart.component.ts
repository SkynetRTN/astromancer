import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Chart} from "chart.js";
import {ChartConfiguration, ChartOptions} from "chart.js/dist/types";
import {updateLine} from "../../common/charts/utils";

@Component({
  selector: 'app-curve-chart',
  templateUrl: './curve-chart.component.html',
  styleUrls: ['./curve-chart.component.css']
})
export class CurveChartComponent implements OnInit, AfterViewInit{

  constructor() { }

  lineChart!: Chart;

  lineChartData: ChartConfiguration<'line'>['data'] = {
    datasets: [
      {
        label: 'y1',
        data: [],
        borderWidth: 2,
        tension: 0.1,
        fill: false,
        hidden: false,
      }, {
        label: 'y2',
        data: [],
        borderWidth: 2,
        tension: 0.1,
        fill: false,
        hidden: true,
      }, {
        label: 'y3',
        data: [],
        borderWidth: 2,
        tension: 0.1,
        fill: false,
        hidden: true,
      }, {
        label: 'y4',
        data: [],
        borderWidth: 2,
        tension: 0.1,
        fill: false,
        hidden: true,
      }
    ]
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    hover: {mode: 'nearest'},
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
      },
      y: {
        reverse: false,
      }
    }
  };

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.lineChart = Chart.getChart("chart") as Chart;
    updateLine([{x:1, y1:2}, {x:2, y1:3}, {x:3, y1:4}], this.lineChart, 0, 'x', 'y1');
  }

}
