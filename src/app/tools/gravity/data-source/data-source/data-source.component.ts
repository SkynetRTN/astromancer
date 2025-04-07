import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {JobStatus} from "../../../../shared/job/job";
import { GravityStorageService } from '../../storage/gravity-storage.service';
import { GravityDataSourceService } from '../gravity-data-source-service';

@Component({
    selector: 'app-gravity-data-source',
    templateUrl: './data-source.component.html',
    styleUrls: ['./data-source.component.scss', '../../../shared/interface/tools.scss']
})
export class DataSourceComponent {

    

    constructor(
        private storageService: GravityStorageService,
        private dataSourceService: GravityDataSourceService
    ) {
    }

    public uploadHandler(file: File)
    {
        this.dataSourceService.fileUpload(file)
    }

    public jobReady(): boolean {
        const job = this.storageService.getJob();
        if (job === null) {
            return false;
        }
        const jobComplete: boolean = job.status === JobStatus.COMPLETED;
        return jobComplete;
    }
}
