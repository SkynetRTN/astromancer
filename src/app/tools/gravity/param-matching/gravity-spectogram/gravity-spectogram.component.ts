import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {auditTime, debounceTime, Subject, takeUntil} from "rxjs";
import * as Highcharts from "highcharts";
import Heatmap from "highcharts/modules/heatmap"
import Boost from "highcharts/modules/boost"

import { SpectogramService } from './gravity-spectogram.service';

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
    xAxis: {
      title: {text: "Time (Seconds)"},
    },

    yAxis: [
      //Logarithmic axis
      {
      title: {text: "Frequency (Hz)"},
      endOnTick: false,
      type: "logarithmic",
      
      },
      //Linear axis
      {
        visible: false,
        endOnTick: false,
        type: "category"
        
      }
    ],
    
    colorAxis: [{ stops: [
      [0, 'rgb(26, 0, 31)'],
      [0.2, 'rgb(69, 16, 115)'],
      [0.6, 'rgb(13, 206, 154)'],
      [0.9, 'rgb(195, 255, 0)'],
      // [0, '#051f39'],
      // [0.2, '#4a2480'],
      // [0.6, '#f42e1f'],
      // [0.9, '#ffffff'],

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
        enabled: false
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

    console.log("Hewwo I add chart uwu")
    this.chartObject.addSeries(
      {
      name: "Spectrum",
      data: this.service.getSpectoArray(),
      yAxis:1,
      colorAxis: 0,
      boostBlending: "add",
      zIndex: 0,
      interpolation: false,
      type: 'heatmap',
      
    });
  }

  updateSpectogram() {
    console.log("updateSpectogram()")
    let axes = this.service.getAxes()
    this.chartObject.yAxis[0].setExtremes(axes.ymin, axes.ymax, false)
    this.chartObject.xAxis[0].setExtremes(axes.xmin, axes.xmax, false)

    //This prevents the glitched yellow spectogram. That wasn't an issue before, so it may be worth looking into other solutions.
    this.chartObject.series[1].setData([[0,0,0]])

    this.chartObject.series[1].update({
      // boostThreshold: 5000,
      // name: "Spectrum",
      colsize: this.service.getAxes().dx,
      data: this.service.getSpectoArray(),
      // enableMouseTracking: false,
      // yAxis:1,
      // zIndex: 0,
      type: 'heatmap',
    },false);
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


  // private setChartAxes(): void {
  //   let axes = this.service.getAxes()
  //   this.chartObject.xAxis[0].setExtremes(axes.xmin, axes.xmax, false)
  //   this.chartObject.yAxis[0].setExtremes(axes.ymin, axes.ymax, false)
  // }
}
