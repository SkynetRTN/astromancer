import {AfterViewInit, Component} from '@angular/core';
import * as Highcharts from 'highcharts';
import {CurveService} from "../curve.service";

@Component({
  selector: 'app-curve-highchart',
  templateUrl: './curve-high-chart.component.html',
  styleUrls: ['./curve-high-chart.component.scss']
})
export class CurveHighChartComponent implements AfterViewInit {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;
  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
    },
    legend: {
      align: 'center',
    },
    tooltip: {
      enabled: true,
      shared: true,
    }
  };

  constructor(private service: CurveService) {
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    this.setChartTitle();
    this.setChartXAxis();
    this.setChartYAxis();
    this.setChartSeries();
  }

  ngAfterViewInit(): void {

    this.service.chartInfo$.subscribe(() => {
      this.updateChartTitle();
      this.updateChartXAxis();
      this.updateChartYAxis();
      this.updateChartSeries();
      this.updateChart();
    });
    this.service.data$.subscribe((data) => {
      this.updateChartSeries();
      this.updateChart();
    });
    this.service.interface$.subscribe(() => {
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
    for (let count = 0; count < 4; count++) {
      this.chartObject.addSeries({
        name: this.service.getDataLabelArray()[count + 1],
        type: 'line',
        data: this.processData(this.service.getDataArray()[count]),
      });
    }
  }

  private updateChartSeries(): void {
    const name = this.service.getDataLabelArray();
    const data = this.service.getDataArray();
    for (let count = 0; count < 4; count++) {
      const processedData = this.processData(data[count]);
      this.chartObject.series[count].update({
        name: name[count + 1],
        data: processedData,
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
    this.chartObject.yAxis[0].update({reversed: this.service.getIsMagnitudeOn()});
  }

  private processData(data: number[][]): number[][] {
    return data.filter((value: number[]) => {
      // return true;
      return (value[0] !== null);
    }).sort((a: number[], b: number[]) => {
      return a[0] - b[0];
    });
  }

}
