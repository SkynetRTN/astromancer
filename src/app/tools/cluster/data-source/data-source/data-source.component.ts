import {Component} from '@angular/core';
import {ClusterDataSourceService} from "../cluster-data-source.service";
import {MatDialog} from "@angular/material/dialog";
import {SummaryComponent} from "../summary/summary.component";
import {filterWavelength} from "../../cluster.util";
import {delay, interval, throttle} from "rxjs";
import {ClusterDataService} from "../../cluster-data.service";

@Component({
  selector: 'app-data-source',
  templateUrl: './data-source.component.html',
  styleUrls: ['./data-source.component.scss', '../../../shared/interface/tools.scss']
})
export class DataSourceComponent {
  constructor(
    private dataService: ClusterDataService,
    private dataSourceService: ClusterDataSourceService,
    private dialog: MatDialog,) {
    this.dataSourceService.rawData$.pipe(
      delay(100),
      throttle(() => interval(1000)),
    ).subscribe(
      () => {
        this.dialog.open(SummaryComponent,
          {
            width: 'fit-content',
            data: {
              source: "File Upload",
              filters: this.dataSourceService.getFilters().sort((a, b) => {
                return filterWavelength[a] - filterWavelength[b];
              }),
              starCounts: this.dataSourceService.getSources().length,
              clusterName: '',
            }
          });
      }
    )
  }
}
