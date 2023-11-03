import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ClusterDataSourceService} from "../cluster-data-source.service";
import {ClusterLookUpStackImpl} from "../cluster-data-source.service.util";

@Component({
  selector: 'app-look-up',
  templateUrl: './look-up.component.html',
  styleUrls: ['./look-up.component.scss']
})
export class LookUpComponent {
  value = '';
  lookUpFrom = new FormGroup({
    name: new FormControl(''),
  })
  recentLookUpsStack: ClusterLookUpStackImpl = new ClusterLookUpStackImpl(5);

  constructor(private dataSourceService: ClusterDataSourceService) {
    this.dataSourceService.lookUpData$.subscribe(
      data => {
        this.recentLookUpsStack.push(data);
      });
  }

  submit() {
    this.dataSourceService.lookUpCluster(this.lookUpFrom.controls['name'].value!);
  }
}
