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
    xAxis: {
      minRange: 0.1,
      alignTicks: false,
      maxPadding: 0,
    },
    yAxis: {
      minRange: 0.1,
      alignTicks: false,
      maxPadding: 0,
      endOnTick: false,
      startOnTick: false,
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
      title: {text: this.service.getXAxisLabel()},
      minRange: 0.1,
    };
  }

  private setChartYAxis(): void {
    this.chartOptions.yAxis = {
      title: {text: this.service.getYAxisLabel()},
      minRange: 0.1,
      endOnTick: false,
      startOnTick: false,
    };
  }

  private adjustScale(): void {
    const data: (number | null)[][] = this.service.getDataArray().filter(d => d[0] !== null && d[1] !== null)
      .concat([[0, 0]]); // Add the sun
    // .concat(this.service.getModel().filter(d => d[0] !== null && d[1] !== null)); // No Model for the time being
    let minX: number = Math.min(...data.map(d => d[0]!));
    let maxX: number = Math.max(...data.map(d => d[0]!));
    let minY: number = Math.min(...data.map(d => d[1]!));
    let maxY: number = Math.max(...data.map(d => d[1]!));

    // Adjusting the min/max values to avoid having data points on the very edge
    minX -= 2;
    maxX += 2;
    minY -= 2;
    maxY += 2;

    const plotRatio = this.chartObject.plotWidth / this.chartObject.plotHeight;
    const xDiff = (maxX - minX);
    const yDiff = (maxY - minY);
    const dataRatio = xDiff / yDiff;

    if (dataRatio < plotRatio) {
      const addition = (yDiff * plotRatio - xDiff) / 2;
      minX -= addition;
      maxX += addition;
    } else {
      const addition = (xDiff / plotRatio - yDiff) / 2;
      minY -= addition;
      maxY += addition;
    }

    this.chartObject.xAxis[0].setExtremes(minX, maxX);
    this.chartObject.yAxis[0].setExtremes(minY, maxY);
  }

}
