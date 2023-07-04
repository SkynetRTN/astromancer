import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import * as Highcharts from "highcharts";
import More from "highcharts/highcharts-more";
import {VariableService} from "../../variable.service";
import {VariableStarOptions} from "../../variable.service.util";

@Component({
  selector: 'app-variable-light-curve-highchart',
  templateUrl: './variable-light-curve-highchart.component.html',
  styleUrls: ['./variable-light-curve-highchart.component.scss']
})
export class VariableLightCurveHighchartComponent implements AfterViewInit, OnDestroy {
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

  constructor(private service: VariableService) {
    More(Highcharts);
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
    this.setVariable();
    this.updateYAxis();
    this.updateChart();
  }

  updateChartSeries(): void {
    this.updateSources();
    this.updateVariable();
    this.updateYAxis();
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
        visible: this.service.getVariableStar() === VariableStarOptions.NONE,
        showInLegend: this.service.getVariableStar() === VariableStarOptions.NONE,
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
        visible: this.service.getVariableStar() === VariableStarOptions.NONE,
        showInLegend: false,
        enableMouseTracking: false,
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
        visible: this.service.getVariableStar() === VariableStarOptions.NONE,
        showInLegend: this.service.getVariableStar() === VariableStarOptions.NONE,
        marker: {
          symbol: 'circle',
        }
      });
      this.chartObject.series[2 * i + 1].update({
        name: "error",
        data: errors[i],
        type: 'errorbar',
        visible: this.service.getVariableStar() === VariableStarOptions.NONE,
      });
    }
  }

  setVariable() {
    this.chartObject.addSeries({
      name: this.service.getDataLabel(),
      data: this.service.getChartVariableDataArray(),
      type: 'scatter',
      visible: this.service.getVariableStar() !== VariableStarOptions.NONE,
      showInLegend: this.service.getVariableStar() !== VariableStarOptions.NONE,
      tooltip: {
        pointFormat: '<b>({point.x:.2f}, {point.y:.2f})</b>'
      }
    });
    this.chartObject.addSeries({
      name: "Error",
      data: this.service.getChartVariableErrorArray(),
      type: 'errorbar',
      visible: this.service.getVariableStar() !== VariableStarOptions.NONE,
      showInLegend: false,
      enableMouseTracking: false,
    });
  }

  updateVariable() {
    this.chartObject.series[4].update({
      name: this.service.getDataLabel(),
      data: this.service.getChartVariableDataArray(),
      type: 'scatter',
      visible: this.service.getVariableStar() !== VariableStarOptions.NONE,
      showInLegend: this.service.getVariableStar() !== VariableStarOptions.NONE,
    });
    this.chartObject.series[5].update({
      name: "Error",
      data: this.service.getChartVariableErrorArray(),
      type: 'errorbar',
      visible: this.service.getVariableStar() !== VariableStarOptions.NONE,
    });
  }

  private updateYAxis(): void {
    this.chartObject.yAxis[0].update({reversed: this.service.getVariableStar() !== VariableStarOptions.NONE});
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

}
