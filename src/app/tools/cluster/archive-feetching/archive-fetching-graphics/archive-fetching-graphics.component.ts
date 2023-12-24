import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FetchPopupComponent} from "../fetch-popup/fetch-popup.component";
import * as Highcharts from "highcharts";
import {ClusterService} from "../../cluster.service";
import {ClusterDataService} from "../../cluster-data.service";
import {filterFSR} from "../../cluster-data.service.util";

@Component({
  selector: 'app-archive-fetching-graphics',
  templateUrl: './archive-fetching-graphics.component.html',
  styleUrls: ['./archive-fetching-graphics.component.scss', '../../../shared/interface/tools.scss']
})
export class ArchiveFetchingGraphicsComponent {
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = true;
  chartConstructor: any = "chart";
  chartObject!: Highcharts.Chart;

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
    },
    title: {
      text: undefined,
    },
    plotOptions: {
      column: {
        stacking: 'normal',
      },
    },
    legend: {
      reversed: true,
    },
    tooltip: {
      format: '<b>{key}</b><br/>{series.name}: {y}<br/>' +
        'Total: {point.stackTotal}'
    },
    xAxis: {
      categories: ['User', 'GAIA'],
    },
    series: [
      {
        name: 'Unused Catalog Stars',
        type: 'column',
        data: [0, 1100],
        colorIndex: 2,
      },
      {
        name: 'Field Stars',
        type: 'column',
        data: [200, 400],
        colorIndex: 1,
      },
      {
        name: 'Cluster Stars',
        type: 'column',
        data: [300, 700],
        colorIndex: 0,
      },
    ],
  }

  constructor(
    private service: ClusterService,
    private dataService: ClusterDataService,
    private matDialog: MatDialog) {
  }

  refreshChart() {
    this.chartObject.series[0].setData([this.getUserPhotometryData().unused, 1100]);
    this.chartObject.series[1].setData([this.getUserPhotometryData().field, 400]);
    this.chartObject.series[2].setData([this.getUserPhotometryData().cluster, 700]);
  }

  chartInitialized($event: Highcharts.Chart) {
    this.chartObject = $event;
  }

  toFiledStarRemoval() {
    this.service.setTabIndex(1);
  }

  toIsochroneMatching() {
    this.service.setTabIndex(3);
  }

  launchArchiveFetching() {
    this.matDialog.open(FetchPopupComponent, {
      width: '720px',
      disableClose: true,
    });
    this.refreshChart();
  }

  private getUserPhotometryData(): StarCountByType {
    const data = this.dataService.getUserPhotometry();
    if (!data) {
      return {cluster: 0, field: 0, unused: 0};
    }
    const result = filterFSR(data, this.service.getFsrParams());
    return {cluster: result.fsr.length, field: result.not_fsr.length, unused: 0};
  }
}

interface StarCountByType {
  cluster: number;
  field: number;
  unused: number;
}
