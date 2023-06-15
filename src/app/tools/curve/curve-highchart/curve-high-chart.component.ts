import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {CurveService} from "../curve.service";

@Component({
  selector: 'app-curve-highchart',
  templateUrl: './curve-high-chart.component.html',
  styleUrls: ['./curve-high-chart.component.scss']
})
export class CurveHighChartComponent implements AfterViewInit, OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = false;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;
  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
    },
    legend: {
      align: 'center',
    },
  };

  constructor(private service: CurveService) {
    this.setChartTitle();
    this.setChartSeries();
    this.setChartXAxis();
    this.setChartYAxis();
  }

  creationCallback = () => {
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.service.chartInfo$.subscribe(() => {
      this.updateChartTitle();
      this.updateChartXAxis();
      this.updateChartYAxis();
      this.updateChartSeries();
      this.updateChart();
    });
    this.service.data$.subscribe(() => {
      this.updateChartSeries();
      this.updateChart();
    });
    this.service.interface$.subscribe(() => {
      console.log("amongus");
      this.reverseYAxis();
      this.updateChart();
    });
  }

  private updateChart(): void {
    this.updateFlag = true;
  }

  private setChartTitle(): void {
    this.chartOptions.title = {text: this.service.getChartTitle()};
  }

  private updateChartTitle(): void {
    this.chartObject.setTitle({text: this.service.getChartTitle()});
  }

  private setChartSeries(): void {
    let series: any[] = [];
    for (let count = 0; count < 4; count++) {
      series.push({
        name: this.service.getDataLabelArray()[count + 1],
        type: 'line',
        data: this.processData(this.service.getDataArray()[count]),
        visible: false,
      });
    }
    this.chartOptions.series = series;
  }

  private updateChartSeries(): void {
    for (let count = 0; count < 4; count++) {
      this.chartObject.series[count].update({
        name: this.service.getDataLabelArray()[count + 1],
        data: this.processData(this.service.getDataArray()[count]),
        type: 'line',
        visible: count < this.service.getCurveCount(),
      })
    }
  }

  private setChartXAxis(): void {
    this.chartOptions.xAxis = {
      title: {text: this.service.getXAxisLabel()}
    };
  }

  private updateChartXAxis(): void {
    this.chartObject.xAxis[0].setTitle({text: this.service.getXAxisLabel()});
  }

  private setChartYAxis(): void {
    this.chartOptions.yAxis = {
      title: {text: this.service.getYAxisLabel()}
    };
  }

  private updateChartYAxis(): void {
    this.chartObject.yAxis[0].setTitle({text: this.service.getYAxisLabel()});
  }

  private reverseYAxis(): void {
    console.log(this.service.getIsMagnitudeOn());
    this.chartObject.yAxis[0].update({reversed: this.service.getIsMagnitudeOn()});
  }

  private processData(data: number[][]): number[][] {
    return data.filter((value: number[]) => {
      return (value[0] !== null) && (value[1] !== null);
    }).sort((a: number[], b: number[]) => {
      return a[0] - b[0];
    });
  }

}
