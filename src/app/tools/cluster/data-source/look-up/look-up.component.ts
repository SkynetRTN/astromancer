import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ClusterDataSourceService} from "../cluster-data-source.service";
import {ClusterLookUpStackImpl} from "../cluster-data-source.service.util";
import {MatDialog} from "@angular/material/dialog";
import {FetchComponent} from "../pop-ups/fetch/fetch.component";

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

  constructor(private dataSourceService: ClusterDataSourceService, private dialog: MatDialog) {
    this.dataSourceService.lookUpData$.subscribe(
      data => {
        this.recentLookUpsStack.push(data);
        this.dialog.open(FetchComponent,
          {data: data});
      });
  }

  submit() {
    this.dataSourceService.lookUpCluster(this.lookUpFrom.controls['name'].value!);
  }
}
