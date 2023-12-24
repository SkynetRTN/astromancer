import {Component} from '@angular/core';
import {ClusterService} from "../../../cluster.service";
import {ClusterDataService} from "../../../cluster-data.service";
import {ClusterStorageService} from "../../../storage/cluster-storage.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss', '../cluster-data-source-pop-ups.scss']
})
export class ResetComponent {

  constructor(
    private service: ClusterService,
    private dataService: ClusterDataService,
    private clusterStorageService: ClusterStorageService,
    private dialog: MatDialog,
  ) {
  }

  proceed() {
    this.service.reset();
    this.dataService.reset();
  }


  cancel() {
    this.service.setTabIndex(1);
    this.dialog.closeAll();
  }
}
