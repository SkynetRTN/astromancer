import {Component} from '@angular/core';
import {ClusterDataSourceService} from "../cluster-data-source.service";
import {MatDialog} from "@angular/material/dialog";
import {SummaryComponent} from "../pop-ups/summary/summary.component";
import {filterWavelength} from "../../cluster.util";
import {delay, interval, throttle} from "rxjs";
import {ClusterStorageService} from "../../storage/cluster-storage.service";
import {InProgressComponent} from "../pop-ups/in-progress/in-progress.component";
import {ClusterService} from "../../cluster.service";
import {ResetComponent} from "../pop-ups/reset/reset.component";
import {JobStatus} from "../../../../shared/job/job";
import {ErrorComponent} from "../pop-ups/error/error.component";

@Component({
    selector: 'app-data-source',
    templateUrl: './data-source.component.html',
    styleUrls: ['./data-source.component.scss', '../../../shared/interface/tools.scss']
})
export class DataSourceComponent {
    constructor(
        private service: ClusterService,
        private storageService: ClusterStorageService,
        private dataSourceService: ClusterDataSourceService,
        private dialog: MatDialog,) {
        this.dataSourceService.rawData$.pipe(
            delay(100),
            throttle(() => interval(1000)),
        ).subscribe(
            () => {
                const count = this.dataSourceService.getSources().length;
                if (count === 0) {
                    this.dialog.open(ErrorComponent,
                        {data: {error: null, message: "No sources or calibrated magnitude found in file."}});
                    return;
                }
                this.dialog.open(SummaryComponent,
                    {
                        width: 'fit-content',
                        disableClose: true,
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
                    disableClose: true,
                });
        }
        this.service.tabIndex$.subscribe(index => {
            if (index === 0 && this.resetPrompt()) {
                this.dialog.open(ResetComponent,
                    {
                        width: 'fit-content',
                        disableClose: true,
                    });
            }
        });
    }

    private jobInProgress(): boolean {
        const job = this.storageService.getJob();
        if (job === null) {
            return false;
        }
        const jobNotConfirmed: boolean = job.status === JobStatus.COMPLETED && this.storageService.getTabIndex() === 0;
        const jobNotComplete: boolean = job.status !== JobStatus.COMPLETED;
        return jobNotComplete || jobNotConfirmed;
    }

    private resetPrompt(): boolean {
        return this.storageService.getJob() !== null;
    }

}
