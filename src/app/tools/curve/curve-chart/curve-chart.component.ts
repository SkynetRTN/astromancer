import {AfterViewInit, Component, EventEmitter, Injector, OnInit} from '@angular/core';
import {Chart} from "chart.js";
import {ChartConfiguration, ChartOptions} from "chart.js/dist/types";
import {updateLine} from "../../common/charts/utils";
import {ChartComponent} from "../../common/directives/chart.directive";
import {ChartAction} from "../../common/types/actions";


@Component({
  selector: 'app-curve-chart',
  templateUrl: './curve-chart.component.html',
  styleUrls: ['./curve-chart.component.css']
})
export class CurveChartComponent implements OnInit, AfterViewInit, ChartComponent{
  chartUpdateObs$: EventEmitter<ChartAction[]>;
  constructor(args: Injector) {
    this.chartUpdateObs$ = args.get('chartUpdateObs$');
    this.chartUpdateObs$.subscribe((actions: ChartAction[]) => {
      for (let action of actions){
        if (action.action == "flipY"){
          this.setYAxisRevers(action.payload);
        }
      }
    });
  }

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

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.lineChart = Chart.getChart("chart") as Chart;
    updateLine([{x:1, y1:2}, {x:2, y1:3}, {x:3, y1:4}], this.lineChart, 0, 'x', 'y1');
  }

  setYAxisRevers(isReversed: boolean){
    if (this.lineChart.options.scales && this.lineChart.options.scales['y']){
      this.lineChart.options.scales['y'].reverse = isReversed;
      this.lineChart.update('none');
    }
  }

}
