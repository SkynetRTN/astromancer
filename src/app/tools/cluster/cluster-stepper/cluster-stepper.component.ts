import {Component} from '@angular/core';
import {ClusterDataService} from "../cluster-data.service";
import {ClusterService} from "../cluster.service";
import {ClusterStorageService} from "../storage/cluster-storage.service";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
    selector: 'app-cluster-stepper',
    templateUrl: './cluster-stepper.component.html',
    styleUrls: ['./cluster-stepper.component.scss', '../../shared/interface/tools.scss']
})
export class ClusterStepperComponent {
    hasFSR: boolean;
    index: number = this.storageService.getTabIndex();

    constructor(private service: ClusterService,
                private storageService: ClusterStorageService,
                private dataService: ClusterDataService,) {
        this.hasFSR = this.storageService.getJob() !== null;
        this.dataService.sources$.subscribe(data => {
            this.hasFSR = this.storageService.getJob()?.status === 'COMPLETED';
        });
        this.service.tabIndex$.subscribe(index => {
            this.index = index;
        });
    }

    changeIndex($event: MatTabChangeEvent) {
        this.service.setTabIndex($event.index);
    }
}
