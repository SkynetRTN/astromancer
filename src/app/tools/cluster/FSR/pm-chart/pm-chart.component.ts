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
    },
    title: {
      text: "2D Proper Motion of " + this.service.getClusterName(),
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
      enabled: false,
    },
    series: [{
      name: "Proper Motion",
      type: "scatter",
      data: [],
      marker: {
        radius: 1,
      }
    }],
    credits: {
      enabled: false,
    }
  }

  constructor(private service: ClusterService,
              private dataService: ClusterDataService) {
  }

  ngAfterViewInit(): void {
    this.updateData();
    this.dataService.fsrFiltered$.pipe(
      debounceTime(500)
    ).subscribe(
      () => {
        this.updateData();
      });
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
  }

  private updateData() {
    this.chartObject.series[0].setData(this.dataService.get2DpmChartData());
    this.updateFraming();
  }

  // 2 sigma clipping
  private updateFraming() {
    const data = this.dataService.getSources(true);
    const pmRa = data.map((source) => {
      return source.fsr!.pm_ra
    }).sort((a, b) => {
      return a - b
    });
    const pmDec = data.map((source) => {
      return source.fsr!.pm_dec
    }).sort((a, b) => {
      return a - b
    });
    const pmRaMin = pmRa[Math.floor(pmRa.length * 0.05)];
    const pmRaMax = pmRa[Math.ceil(pmRa.length * 0.95)];
    const pmDecMin = pmDec[Math.floor(pmDec.length * 0.05)];
    const pmDecMax = pmDec[Math.ceil(pmDec.length * 0.95)];
    this.chartObject.xAxis[0].setExtremes(pmRaMin, pmRaMax);
    this.chartObject.yAxis[0].setExtremes(pmDecMin, pmDecMax);
  }


}
