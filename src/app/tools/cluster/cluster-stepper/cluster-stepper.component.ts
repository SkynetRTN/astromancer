import {Component} from '@angular/core';
import {ClusterDataSourceService} from "../data-source/cluster-data-source.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-cluster-stepper',
  templateUrl: './cluster-stepper.component.html',
  styleUrls: ['./cluster-stepper.component.scss']
})
export class ClusterStepperComponent {
  protected dataSourceFormControl: FormControl;

  constructor(private dataSourceService: ClusterDataSourceService) {
    this.dataSourceFormControl = this.dataSourceService.getFormControl();
  }

}
