import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import * as Highcharts from "highcharts";
import {Subject, takeUntil} from "rxjs";
import {ScatterService} from "../scatter.service";

@Component({
  selector: 'app-scatter-highchart',
  templateUrl: './scatter-highchart.component.html',
  styleUrls: ['./scatter-highchart.component.scss']
})
export class ScatterHighchartComponent implements AfterViewInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;
  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      styledMode: true,
    },
    legend: {
      align: 'center',
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
    },
  };
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private service: ScatterService) {
    this.setChartTitle();
    this.setChartXAxis();
    this.setChartYAxis();
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    // this.service.setHighChart(this.chartObject);
  }

  ngAfterViewInit(): void {
    this.initChartSeries();
    this.service.setHighChart(this.chartObject);
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateData();
      this.adjustScale();
    });
    this.service.chartInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.setChartTitle();
      this.setChartXAxis();
      this.setChartYAxis();
      this.updateChart();
    });
    this.service.interface$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateModel();
      this.updateCross();
      this.adjustScale();
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initChartSeries() {
    this.setSun();
    this.setData();
    this.setModel();
    this.setCross();
  }

  private setSun() {
    this.chartObject.addSeries({
      name: "Sun",
      data: [[0, 0]],
      type: 'scatter',
      marker: {
        radius: 10,
      }
    })
  }

  private setData() {
    this.chartObject.addSeries({
      name: this.service.getDataLabel(),
      data: this.service.getDataArray(),
      type: 'scatter',
      marker: {
        symbol: 'circle',
      }
    })
  }

  private updateData() {
    this.chartObject.series[1].update({
      name: this.service.getDataLabel(),
      data: this.service.getDataArray(),
      type: 'scatter',
      marker: {
        symbol: 'circle',
      }
    });
  }

  private setModel(): void {
    this.chartObject.addSeries({
      name: "Model",
      data: this.service.getModel(),
      type: 'scatter',
      marker: {
        symbol: 'circle',
        radius: 0.7,
      }
    })
  }

  private updateModel(): void {
    this.chartObject.series[2].setData(this.service.getModel());
  }

  private setCross(): void {
    this.chartObject.addSeries({
      name: "Cross",
      data: ([[this.service.getDistance(), 0]] as any),
      type: "scatter",
      marker: {
        symbol: 'diamond',
        radius: 5,
      },
      enableMouseTracking: false,
      showInLegend: false,
    })
  }

  private updateCross(): void {
    this.chartObject.series[3].setData([[this.service.getDistance(), 0]] as any);
  }

  private updateChart(): void {
    this.updateFlag = true;
  }

  private setChartTitle(): void {
    this.chartOptions.title = {text: this.service.getChartTitle()};
  }

  private setChartXAxis(): void {
    this.chartOptions.xAxis = {
      title: {text: this.service.getXAxisLabel()}
    };
  }

  private setChartYAxis(): void {
    this.chartOptions.yAxis = {
      title: {text: this.service.getYAxisLabel()}
    };
  }

  private adjustScale(): void {
    const data: (number | null)[][] = this.service.getDataArray().filter(d => d[0] !== null && d[1] !== null);
    let minX: number = Math.min(...data.map(d => d[0]!));
    let maxX: number = Math.max(...data.map(d => d[0]!));
    let minY: number = Math.min(...data.map(d => d[1]!));
    let maxY: number = Math.max(...data.map(d => d[1]!));

    // Adjusting the min/max values to avoid having data points on the very edge
    minX -= 3;
    maxX += 3;
    minY -= 3;
    maxY += 3;

    // This is the ratio of the length of X axis over the length of Y axis
    const screenRatio = this.chartObject.plotWidth / this.chartObject.plotHeight;
    let dataRatio = (maxX - minX) / (maxY - minY);

    if (dataRatio < screenRatio) {
      let m = (maxX + minX) / 2;
      let d = (maxX - minX) / 2;
      maxX = m + d / dataRatio * screenRatio;
      minX = m - d / dataRatio * screenRatio;
    } else {
      let m = (maxY + minY) / 2;
      let d = (maxY - minY) / 2;
      maxY = m + d * dataRatio / screenRatio;
      minY = m - d * dataRatio / screenRatio;
    }

    this.chartObject.xAxis[0].setExtremes(Math.floor(minX), Math.ceil(maxX));
    this.chartObject.yAxis[0].setExtremes(Math.floor(minY), Math.ceil(maxY));


  }

}
