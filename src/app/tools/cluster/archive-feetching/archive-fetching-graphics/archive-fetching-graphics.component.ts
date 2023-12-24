import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FetchPopupComponent} from "../fetch-popup/fetch-popup.component";
import * as Highcharts from "highcharts";
import {ClusterService} from "../../cluster.service";

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
    private matDialog: MatDialog) {
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
  }
}
