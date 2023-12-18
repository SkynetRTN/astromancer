import {Component} from '@angular/core';
import {ClusterDataService} from "../cluster-data.service";
import {ClusterService} from "../cluster.service";

@Component({
  selector: 'app-cluster-stepper',
  templateUrl: './cluster-stepper.component.html',
  styleUrls: ['./cluster-stepper.component.scss', '../../shared/interface/tools.scss']
})
export class ClusterStepperComponent {
  hasFSR: boolean = this.dataService.getHasFSR();
  index: number = 0;

  constructor(private service: ClusterService,
              private dataService: ClusterDataService,) {
    this.dataService.data$.subscribe(data => {
      this.hasFSR = this.dataService.getHasFSR();
    });
    this.service.tabIndex$.subscribe(index => {
      this.index = index;
    });
  }
}
