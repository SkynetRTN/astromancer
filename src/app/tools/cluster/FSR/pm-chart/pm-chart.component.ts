import {AfterViewInit, Component} from '@angular/core';
import * as Highcharts from "highcharts";
import {ClusterService} from "../../cluster.service";
import {ClusterDataService} from "../../cluster-data.service";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-pm-chart',
  templateUrl: './pm-chart.component.html',
  styleUrls: ['./pm-chart.component.scss']
})
export class PmChartComponent implements AfterViewInit {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;

  chartOptions: Highcharts.Options = {
    chart: {
      type: "scatter",
      animation: false,
      styledMode: true,
    },
    title: {
      text: "Proper Motion",
    },
    xAxis: {
      title: {
        text: "Proper Motion in RA (mas/yr)",
      }
    },
    yAxis: {
      title: {
        text: "Proper Motion in Dec (mas/yr)",
      }
    },
    legend: {
      enabled: true,
    },
    series: [
      {
        name: "Cluster Stars",
        type: "scatter",
        data: [],
        marker: {
          radius: 1,
        },
        zIndex: 2,
      },
      {
        name: "Field Stars",
        type: "scatter",
        data: [],
        marker: {
          radius: 1,
        },
        zIndex: 1,
      },
      {
        name: "PM Cut",
        type: "scatter",
        data: [[0, 0], [3, 3]],
        marker: {
          radius: 1,
          symbol: "line",
        },
        zIndex: 0,
      },
    ],
    tooltip: {
      enabled: true,
    },
    credits: {
      enabled: false,
    }
  }

  constructor(private service: ClusterService,
              private dataService: ClusterDataService) {
  }

  ngAfterViewInit(): void {
    this.updateData();
    this.updateCut();
    this.dataService.fsrFiltered$.pipe(
      debounceTime(500)
    ).subscribe(
      () => {
        this.updateData();
        this.updateCut();
      });
    this.service.fsrFraming$.subscribe(
      () => {
        this.updateFraming();
      });
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
  }

  private updateData() {
    this.chartObject.series[0].setData(this.dataService.get2DpmChartData()['cluster']);
    this.chartObject.series[1].setData(this.dataService.get2DpmChartData()['field']);
    this.updateFraming();
  }


  private updateFraming() {
    const framing = this.service.getFsrFraming()
    if (framing.pm_ra) {
      this.chartObject.xAxis[0].setExtremes(framing.pm_ra.min, framing.pm_ra.max);
    }
    if (framing.pm_dec) {
      this.chartObject.yAxis[0].setExtremes(framing.pm_dec.min, framing.pm_dec.max);
    }
  }

  private updateCut() {
    const cut = this.getCutData();
    this.chartObject.series[2].setData(cut);
  }

  private getCutData(): number[][] {
    const data: number[][] = [];
    if (this.service.getFsrParams().pm_dec == null || this.service.getFsrParams().pm_ra == null)
      return [];
    const segments = 80;
    const maxDec = this.service.getFsrParams().pm_dec!.max;
    const minDec = this.service.getFsrParams().pm_dec!.min;
    const maxRa = this.service.getFsrParams().pm_ra!.max;
    const minRa = this.service.getFsrParams().pm_ra!.min;
    const delta = 2 * Math.PI / segments;
    const a = (maxRa - minRa) / 2;
    const b = (maxDec - minDec) / 2;
    const center_ra = (maxRa + minRa) / 2
    const center_dec = (maxDec + minDec) / 2
    for (let i = 0; i < segments; i++) {
      const x = a * Math.cos(i * delta) + center_ra;
      const y = b * Math.sin(i * delta) + center_dec;
      data.push([x, y]);
    }
    return data;
  }


}
