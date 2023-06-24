import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import * as Highcharts from "highcharts";
import {MoonService} from "../moon.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-moon-highchart',
  templateUrl: './moon-highchart.component.html',
  styleUrls: ['./moon-highchart.component.scss']
})
export class MoonHighchartComponent implements AfterViewInit, OnDestroy{
  private destroy$: Subject<any> = new Subject<any>();

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
      shared: true,
    },
    exporting: {
      buttons: {
        contextButton: {
          enabled: false,
        }
      }
    }
  };

  constructor(private service: MoonService) {
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
    this.service.setHighChart(this.chartObject);
  }

  ngAfterViewInit(): void {
    this.setData();
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateData();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  setData() {
    this.chartObject.addSeries({
      name: 'Data',
      data: this.service.getDataArray(),
      type: 'scatter',
    })
  }

  updateData() {
    this.chartObject.series[0].setData(this.service.getDataArray());
  }
}
