import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ClusterService} from "../../cluster.service";
import {ClusterDataService} from "../../cluster-data.service";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {JobStatus} from "../../../../shared/job/job";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  clusterName: string = '';
  hasFSR: boolean = this.dataService.getHasFSR();
  loadGaia: boolean = false;
  gaia_text: string = GAIA_TEXT.PENDING;
  progress_mode: ProgressBarMode = 'indeterminate';
  progress_value: number = 0;
  fsr_count: number = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data:
                { source: string, filters: string[], starCounts: number, clusterName: string },
              private service: ClusterService,
              private dataService: ClusterDataService,) {
    this.service.setClusterName(this.clusterName);
    this.hasFSR = this.dataService.getHasFSR();
  }

  next() {
    this.service.setClusterName(this.clusterName);
    if (!this.dataService.getHasFSR()) {
      this.loadGaia = true;
      const job = this.dataService.fetchFieldStarRemoval();
      job.statusUpdate$.subscribe(
        (status) => {
          if (status === JobStatus.PENDING) {
            this.progress_mode = 'indeterminate';
            this.progress_value = 0;
          } else if (status === JobStatus.RUNNING) {
            this.progress_mode = 'determinate';
            this.gaia_text = GAIA_TEXT.RUNNING;
          }
        });
      job.progressUpdate$.subscribe(
        (progress) => {
          if (progress !== null) {
            this.progress_value = progress;
          }
        });
      this.dataService.data$.pipe(
      ).subscribe(
        () => {
          this.progress_mode = 'indeterminate';
          this.progress_value = 100;
          this.fsr_count = this.dataService.getFSRCount();
          this.dataService.setHasFSR(true);
          this.hasFSR = true;
          this.loadGaia = false;
        }
      )
    }
  }

  cancel() {
    this.service.init();
    this.dataService.init();
    this.hasFSR = this.dataService.getHasFSR();
    this.loadGaia = false;
  }
}

enum GAIA_TEXT {
  PENDING = 'GAIA Cross Match Job is Pending',
  RUNNING = 'GAIA Cross Match Job is Running',
}
