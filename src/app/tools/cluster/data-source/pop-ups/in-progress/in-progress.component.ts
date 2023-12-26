import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ClusterService} from "../../../cluster.service";
import {ClusterDataService} from "../../../cluster-data.service";
import {ClusterStorageService} from "../../../storage/cluster-storage.service";
import {DataSourceStorageObject} from "../../../storage/cluster-storage.service.util";
import {Job, JobStorageObject} from "../../../../../shared/job/job";
import {HttpClient} from "@angular/common/http";
import {FILTER, Source} from "../../../cluster.util";

@Component({
  selector: 'app-in-progress',
  templateUrl: './in-progress.component.html',
  styleUrls: ['./in-progress.component.scss', '../cluster-data-source-pop-ups.scss']
})
export class InProgressComponent {
  jobType: boolean;
  isJobComplete: boolean = false;
  clusterName: string = this.service.getClusterName();
  sources: Source[] = [];
  filters: FILTER[] = [];

  constructor(private http: HttpClient,
              private service: ClusterService,
              private dataService: ClusterDataService,
              private storageService: ClusterStorageService,
              public dialog: MatDialog) {
    const storageObject: DataSourceStorageObject = this.storageService.getDataSource();
    let jobStorage: JobStorageObject;
    if (storageObject.FSRJob) {
      this.jobType = true;
      jobStorage = storageObject.FSRJob!;
    } else {
      this.jobType = false;
      jobStorage = storageObject.lookUpJob!;
    }
    if (this.storageService.getHasFSR()) {
      this.sources = this.dataService.getSources();
      this.filters = this.dataService.getFilters();
      this.isJobComplete = true;
    } else {
      const job = new Job(jobStorage.url, http, jobStorage.updateInterval);
      job.reincarnate(jobStorage);
      job.complete$.subscribe(
        () => {
          this.isJobComplete = true;
          if (this.jobType && job.getJobId()) {
            this.dataService.setSources(jobStorage.payload);
            this.dataService.getFSRResults(job.getJobId());
            this.dataService.syncUserPhotometry(job.getJobId()!);
          } else {
            this.dataService.getCatalogResults(job.getJobId());
          }
        });
      this.dataService.data$.subscribe(
        () => {
          this.sources = this.dataService.getSources();
          this.filters = this.dataService.getFilters();
        });
    }
  }

  next() {
    if (this.isJobComplete) {
      this.service.setTabIndex(1);
      this.dialog.closeAll();
    }
  }

  cancel() {
    this.service.reset();
    this.dataService.reset();
  }
}
