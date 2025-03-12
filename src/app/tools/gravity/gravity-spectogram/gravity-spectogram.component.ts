import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {auditTime, debounceTime, Subject, takeUntil} from "rxjs";
import * as Highcharts from "highcharts";
import Heatmap from "highcharts/modules/heatmap"
import Boost from "highcharts/modules/boost"

import { SpectogramService } from '../gravity-spectogram.service';

Heatmap(Highcharts)
Boost(Highcharts)

@Component({
  selector: 'app-gravity-spectogram',
  templateUrl: './gravity-spectogram.component.html',
  styleUrls: ['./gravity-spectogram.component.scss']
})
export class GravitySpectogramComponent implements AfterViewInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;
  chartOptions: Highcharts.Options = {
    boost: {
      seriesThreshold: 5000
    },
    chart: {
      animation: false,
      styledMode: true,
      events: {
        redraw: ()=> {
          console.log("Spectogram Redraw")
        }
      },
    },

    
    colorAxis: [{ stops: [
      [0, 'rgb(26, 0, 31)'],
      [0.2, 'rgb(69, 16, 115)'],
      [0.6, 'rgb(13, 206, 154)'],
      [0.9, 'rgb(195, 255, 0)'],
      // [0, '#051f39'],
      // [0.2, '#4a2480'],
      // [0.6, '#c53a9d'],
      // [0.9, '#ff8e80'],
    ],
      reversed: false,

    //So, the color axis is affected by the model's y value. we have to give the model it's own dummy axis to prevent this.
    }, {visible: false}],
    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      y: 25,
      symbolHeight: 280
  },
  
  tooltip: {
    enabled: true,
    shared: false,
  },
  exporting: {
    buttons: {
      contextButton: {
        enabled: false,
      }
    }
    }
  };
  private destroy$: Subject<any> = new Subject<any>();

  constructor(private service: SpectogramService) {
    this.setChartTitle();
    this.setChartXAxis();
    this.setChartYAxis();
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    this.service.setHighChart(this.chartObject);

  }

  ngAfterViewInit(): void {
    this.initChartSeries();

    this.service.spectogram$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateSpectogram();
      //The xAxis of this chart is controlled by the data, not the user. 
      //It is updated with the data, not with the chart info
      this.setChartXAxis();
      this.setChartYAxis();
      this.updateChart();
    });

    this.service.model$.pipe(
      takeUntil(this.destroy$),
      // auditTime(100),
    ).subscribe(() => {
      let t1 = performance.now()
      this.updateModel();
      let t2 = performance.now()
      console.log("Model updated in ", (t2-t1), " milliseconds.")
      this.updateChart();
    });

    this.service.chartInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setChartTitle();
      // this.setChartXAxis();
      // this.setChartYAxis();
      this.updateChart();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  initChartSeries() {
    this.setData();
  }

  setData() {
    this.chartObject.addSeries({
      name: "Model",
      data: [],
      yAxis: 0,
      colorAxis: 1,
      zIndex: 1,

      // This can be used to add a base x value to every point, which would presumably be faster to how merger time is currently handled
      // The points don't render when the x min and max are set, however. May be worth revisiting later.
      // pointInterval: 1,
      // relativeXValue: true,

      marker: {
        symbol: 'circle',
      },
      
      type: 'spline',

      // dataGrouping: {
      //   anchor: "middle",
      //   groupPixelWidth: 2
      // },
      states: {
        hover: {
          enabled: false
        }
      }
    });

    this.chartObject.addSeries({
      name: "Spectrum",
      data: this.service.getSpectoArray(),
      yAxis:1,
      colorAxis: 0,
      zIndex: 0,
      // interpolation: true,
      type: 'scatter',
      
    });
  }

  updateSpectogram() {
    console.log("updateSpectogram()")
    this.chartObject.series[1].update({
      // boostThreshold: 5000,
      // name: "Spectrum",
      // colsize: this.service.getAxes().dx,
      data: this.service.getSpectoArray(),
      // enableMouseTracking: false,
      // yAxis:1,
      // zIndex: 0,
      // interpolation: true,
      type: 'scatter',
    });
  }

  updateModel() {
    console.log("updateModel()")
    this.chartObject.series[0].setData(
      this.service.getModelArray(), 
      //Redraw chart, do animation, update points
      false, false, false,
    );
    
  }

  private updateChart(): void {
    this.updateFlag = true;
  }

  private setChartTitle(): void {
    this.chartOptions.title = {text: this.service.getChartTitle()};
  }

  //TODO: use set extremes.
  private setChartXAxis(): void {
    let axes = this.service.getAxes()

    this.chartOptions.xAxis = {
      title: {text: this.service.getXAxisLabel()},
      min: axes.xmin,
      max: axes.xmax,
    };

  }

  private setChartYAxis(): void {

    let axes = this.service.getAxes()

    this.chartOptions.yAxis = [
      //Logarithmic axis
      {
      title: {text: this.service.getYAxisLabel()},
      endOnTick: false,
      type: "logarithmic",

      min: axes.ymin,
      max: axes.ymax
      
      },
      //Linear axis
      {
        visible: false,
        endOnTick: false,
        type: "category"
        
      }
    ]
  }

}
