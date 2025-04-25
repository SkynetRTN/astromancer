import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {JobStatus} from "../../../../shared/job/job";
import { GravityStorageService } from '../../storage/gravity-storage.service';
import { GravityDataSourceService } from '../gravity-data-source-service';
import { GravityDataService } from '../../gravity-data.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
    selector: 'app-data-source',
    templateUrl: './data-source.component.html',
    styleUrls: ['./data-source.component.scss', "../../../shared/interface/tools.scss"]
})
export class DataSourceComponent {

    public dataProgress$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public dataStatus$: BehaviorSubject<string> = new BehaviorSubject<string>("Loading...")

    constructor(
        private storageService: GravityStorageService,
        private dataSourceService: GravityDataSourceService,
        private dataService: GravityDataService
    )
    {
        this.dataService.jobProgress$.subscribe((p) => {
            this.dataProgress$.next(p)
        })

        this.dataService.dataStatus$.subscribe((s) => {
            this.dataStatus$.next(s)
        })
    }

    public uploadHandler(file: File)
    {
        this.dataSourceService.fileUpload(file)
    }
}
