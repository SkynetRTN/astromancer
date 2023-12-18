import {Component} from '@angular/core';
import {ClusterDataSourceService} from "../cluster-data-source.service";
import {MatDialog} from "@angular/material/dialog";
import {SummaryComponent} from "../pop-ups/summary/summary.component";
import {filterWavelength} from "../../cluster.util";
import {delay, interval, throttle} from "rxjs";
import {ClusterDataService} from "../../cluster-data.service";
import {ClusterStorageService} from "../../storage/cluster-storage.service";
import {InProgressComponent} from "../pop-ups/in-progress/in-progress.component";

@Component({
  selector: 'app-data-source',
  templateUrl: './data-source.component.html',
  styleUrls: ['./data-source.component.scss', '../../../shared/interface/tools.scss']
})
export class DataSourceComponent {
  constructor(
    private dataService: ClusterDataService,
    private storageService: ClusterStorageService,
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
    );
    if (this.jobInProgress()) {
      this.dialog.open(InProgressComponent,
        {
          width: 'fit-content',
        });
    }
  }

  private jobInProgress(): boolean {
    const jobNotConfirmed: boolean = this.storageService.getHasFSR() && this.storageService.getTabIndex() === 0;
    const jobs = this.storageService.getDataSource()
    const jobNotComplete: boolean = jobs.FSRJob !== null || jobs.lookUpJob !== null;
    return jobNotComplete || jobNotConfirmed;
  }

}
