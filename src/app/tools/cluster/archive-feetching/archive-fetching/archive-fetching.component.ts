import {Component} from '@angular/core';
import {ClusterService} from "../../cluster.service";
import {MatDialog} from "@angular/material/dialog";
import {FetchPopupComponent} from "../fetch-popup/fetch-popup.component";

@Component({
  selector: 'app-archive-fetching',
  templateUrl: './archive-fetching.component.html',
  styleUrls: ['./archive-fetching.component.scss', '../../../shared/interface/tools.scss']
})
export class ArchiveFetchingComponent {

  constructor(private service: ClusterService,
              private matDialog: MatDialog) {
    // this.launchArchiveFetching();
  }

  toFiledStarRemoval() {
    this.service.setTabIndex(1);
  }

  launchArchiveFetching() {
    this.matDialog.open(FetchPopupComponent, {
      width: '720px',
      disableClose: true,
    });
  }
}
