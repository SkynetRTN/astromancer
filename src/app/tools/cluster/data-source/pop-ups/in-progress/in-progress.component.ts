import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ClusterService} from "../../../cluster.service";
import {ClusterDataService} from "../../../cluster-data.service";
import {ClusterStorageService} from "../../../storage/cluster-storage.service";
import {HttpClient} from "@angular/common/http";
import {FILTER, Source} from "../../../cluster.util";
import {Job, JobStorageObject, JobType} from "../../../../../shared/job/job";

@Component({
    selector: 'app-in-progress',
    templateUrl: './in-progress.component.html',
    styleUrls: ['./in-progress.component.scss', '../cluster-data-source-pop-ups.scss']
})
export class InProgressComponent {
    isJobComplete: boolean = false;
    clusterName: string = this.service.getClusterName();
    jobType: JobType;
    sources: Source[] = [];
    filters: FILTER[] = [];

    constructor(private http: HttpClient,
                private service: ClusterService,
                private dataService: ClusterDataService,
                private storageService: ClusterStorageService,
                public dialog: MatDialog) {
        const jobObject: JobStorageObject = this.storageService.getJob()!;
        this.jobType = jobObject.type;
        const job = new Job(jobObject.url, jobObject.type, this.http);
        job.reincarnate(jobObject);
        job.complete$.subscribe(
            (result) => {
                this.isJobComplete = true;
                if (result) {
                    if (jobObject.type === JobType.FIELD_STAR_REMOVAL) {
                        this.dataService.getFSRResults(jobObject.id);
                    } else if (jobObject.type === JobType.FETCH_CATALOG) {
                        this.dataService.getCatalogResults(jobObject.id);
                    }
                    this.storageService.setJob(job.getStorageObject());
                }
            });
        this.dataService.sources$.subscribe(
            () => {
                this.sources = this.dataService.getSources();
                this.filters = this.dataService.getFilters();
            });
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
