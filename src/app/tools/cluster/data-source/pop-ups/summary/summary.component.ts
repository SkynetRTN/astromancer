import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ClusterService} from "../../../cluster.service";
import {ClusterDataService} from "../../../cluster-data.service";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {JobStatus} from "../../../../../shared/job/job";
import {ClusterStorageService} from "../../../storage/cluster-storage.service";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss', '../cluster-data-source-pop-ups.scss']
})
export class SummaryComponent {
  clusterName: string = this.service.getClusterName();
  hasFSR: boolean = this.dataService.getHasFSR();
  loadGaia: boolean = false;
  gaia_text: string = GAIA_TEXT.PENDING;
  progress_mode: ProgressBarMode = 'indeterminate';
  progress_value: number = 0;
  fsr_count: number = this.dataService.getFSRCount();

  constructor(@Inject(MAT_DIALOG_DATA) public data:
                { source: string, filters: string[], starCounts: number, clusterName: string },
              private service: ClusterService,
              private dataService: ClusterDataService,
              private storageService: ClusterStorageService) {
    this.dataService.data$.subscribe(
      () => {
        this.hasFSR = this.dataService.getHasFSR();
        this.fsr_count = this.dataService.getFSRCount();
      });
  }

  next() {
    this.service.setClusterName(this.clusterName);
    if (!this.dataService.getHasFSR()) {
      this.loadGaia = true;
      const job = this.dataService.fetchFieldStarRemoval();
      job.update$.subscribe(
        (job) => {
          this.storageService.setFSRJob(job.getStorageObject());
        });
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
          this.loadGaia = false;
        }
      )
    }
  }

  cancel() {
    this.service.reset();
    this.dataService.reset();
    this.storageService.resetDataSource();
    this.loadGaia = false;
  }
}

enum GAIA_TEXT {
  PENDING = 'GAIA Cross Match Job is Pending',
  RUNNING = 'GAIA Cross Match Job is Running',
}
