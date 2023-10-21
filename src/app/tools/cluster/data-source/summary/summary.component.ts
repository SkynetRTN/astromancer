import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ClusterDataSourceService} from "../cluster-data-source.service";
import {ClusterService} from "../../cluster.service";
import {ClusterDataService} from "../../cluster-data.service";
import {take} from "rxjs";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  clusterName: string = '';
  isSummaryHidden: boolean = false;
  isLoadHidden: boolean = true;
  isCompleteHidden: boolean = true;
  isFailedHidden: boolean = true;
  gaiaStarCount: number = 0;
  totalStarCount: number = 0;


  constructor(@Inject(MAT_DIALOG_DATA) public data:
                { source: string, filters: string[], starCounts: number, clusterName: string },
              private service: ClusterService,
              private dataService: ClusterDataService,
              private dataSourceService: ClusterDataSourceService,) {
    this.clusterName = data.clusterName;
  }

  next() {
    this.isSummaryHidden = true;
    this.isLoadHidden = false;
    this.service.setClusterName(this.clusterName);
    this.dataService.fetchFieldStarRemoval();
    this.dataService.data$.pipe(
      take(1)
    ).subscribe(
      (data) => {
        this.isLoadHidden = true;
        this.isCompleteHidden = false;
        this.gaiaStarCount = data.filter((star) => {
          return star.fsr !== null && star.fsr.distance !== undefined;
        }).length;
        this.totalStarCount = data.length;
      }
    )
  }
}
