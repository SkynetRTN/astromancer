import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import * as Highcharts from "highcharts";
import More from "highcharts/highcharts-more";
import {PulsarService} from "../../pulsar.service";
import {PulsarStarOptions} from "../../pulsar.service.util";

@Component({
  selector: 'app-pulsar-light-curve-highchart',
  templateUrl: './pulsar-light-curve-highchart.component.html',
  styleUrls: ['./pulsar-light-curve-highchart.component.scss']
})
export class PulsarLightCurveHighchartComponent implements AfterViewInit, OnDestroy {
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
    }
  };
  private destroy$: Subject<any> = new Subject<any>();

  constructor(private service: PulsarService) {
    More(Highcharts);
    this.setChartTitle();
    this.setChartXAxis();
    this.setChartYAxis();
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    this.service.setHighChartLightCurve(this.chartObject);

  }

  ngAfterViewInit(): void {
    this.initChartSeries();
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateChartSeries();
      this.updateChart();
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
      this.updateChartSeries();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  initChartSeries() {
    this.setSources();
    this.setPulsar();
    this.updateChart();
  }

  updateChartSeries(): void {
    this.updateSources();
    this.updatePulsar();
    this.updateChart();
  }

  setSources() {
    const labels: string[] = this.service.getDataLabelArray();
    const data: (number | null)[][][] = this.service.getChartSourcesDataArray();
    const errors: (number | null)[][][] = this.service.getChartSourcesErrorArray();
    for (let i = 0; i < 2; i++) {
      this.chartObject.addSeries({
        name: labels[i],
        data: data[i],
        type: 'scatter',
        visible: this.service.getPulsarStar() === PulsarStarOptions.NONE,
        showInLegend: this.service.getPulsarStar() === PulsarStarOptions.NONE,
        marker: {
          symbol: 'circle',
          radius: 5,
        },
        tooltip: {
          pointFormat: '<b>({point.x:.2f}, {point.y:.2f})</b>'
        }
      });
      this.chartObject.addSeries({
        name: "Error",
        data: errors[i],
        type: 'errorbar',
        visible: this.service.getPulsarStar() === PulsarStarOptions.NONE,
        showInLegend: false,
        enableMouseTracking: false,
        whiskerLength: 0,
      });
    }
  }

  updateSources() {
    const labels: string[] = this.service.getDataLabelArray();
    const data: (number | null)[][][] = this.service.getChartSourcesDataArray();
    const errors: (number | null)[][][] = this.service.getChartSourcesErrorArray();
    for (let i = 0; i < 2; i++) {
      this.chartObject.series[2 * i].update({
        name: labels[i],
        data: data[i],
        type: 'scatter',
        visible: this.service.getPulsarStar() === PulsarStarOptions.NONE,
        showInLegend: this.service.getPulsarStar() === PulsarStarOptions.NONE,
        marker: {
          symbol: 'circle',
        }
      });
      this.chartObject.series[2 * i + 1].update({
        name: "error",
        data: errors[i],
        type: 'errorbar',
        visible: this.service.getPulsarStar() === PulsarStarOptions.NONE,
        whiskerLength: 0,
      });
    }
  }

  setPulsar() {
    this.chartObject.addSeries({
      name: this.service.getDataLabel(),
      data: this.service.getChartPulsarDataArray(),
      type: 'scatter',
      visible: this.service.getPulsarStar() !== PulsarStarOptions.NONE,
      showInLegend: this.service.getPulsarStar() !== PulsarStarOptions.NONE,
      tooltip: {
        pointFormat: '<b>({point.x:.2f}, {point.y:.2f})</b>'
      }
    });
    this.chartObject.addSeries({
      name: "Error",
      data: this.service.getChartPulsarErrorArray(),
      type: 'errorbar',
      visible: this.service.getPulsarStar() !== PulsarStarOptions.NONE,
      showInLegend: false,
      enableMouseTracking: false,
      whiskerLength: 0,
    });
  }

  updatePulsar() {
    this.chartObject.series[4].update({
      name: this.service.getDataLabel(),
      data: this.service.getChartPulsarDataArray(),
      type: 'scatter',
      visible: this.service.getPulsarStar() !== PulsarStarOptions.NONE,
      showInLegend: this.service.getPulsarStar() !== PulsarStarOptions.NONE,
    });
    this.chartObject.series[5].update({
      name: "Error",
      data: this.service.getChartPulsarErrorArray(),
      type: 'errorbar',
      visible: this.service.getPulsarStar() !== PulsarStarOptions.NONE,
      whiskerLength: 0,
    });
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
      title: {text: this.service.getYAxisLabel()},
      reversed: true,
    };
  }

}