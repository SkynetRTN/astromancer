import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import * as Highcharts from "highcharts";
import {Subject, takeUntil} from "rxjs";
import {VenusService} from "../venus.service";

@Component({
  selector: 'app-venus-highchart',
  templateUrl: './venus-highchart.component.html',
  styleUrls: ['./venus-highchart.component.scss']
})
export class VenusHighchartComponent implements AfterViewInit, OnDestroy {
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
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private service: VenusService) {
    this.setChartTitle();
    this.setChartXAxis();
    this.setChartYAxis();
  }

  ngAfterViewInit(): void {
    this.service.setHighChart(this.chartObject);
    this.setData();
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      () => {
        this.updateData();
      }
    );
    this.service.chartInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      () => {
        this.setChartTitle();
        this.setChartXAxis();
        this.setChartYAxis();
        this.updateChart();
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    // this.service.setHighChart(this.chartObject);
  }

  private setData() {
    this.chartObject.addSeries({
      name: this.service.getDataLabel(),
      data: this.service.getDataArray(),
      type: 'scatter',
    });
    this.chartObject.addSeries({
      name: "Geocentric",
      data: this.service.getGeocentricModelDataUpper(),
      type: 'area',
    });
    this.chartObject.addSeries({
      name: "Geocentric",
      data: this.service.getGeocentricModelDataLower(),
      type: 'area',
      showInLegend: false,
    });
    this.chartObject.addSeries({
      name: "Heliocentric",
      data: this.service.getHeliocentricModelData(),
      type: 'line',
    });
  }

  private updateData() {
    this.chartObject.series[0].update({
      name: this.service.getDataLabel(),
      data: this.service.getDataArray(),
      type: 'scatter',
    });
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

  private updateChart() {
    this.updateFlag = true;
  }
}
