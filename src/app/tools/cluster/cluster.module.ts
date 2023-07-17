import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClusterComponent} from "./cluster/cluster.component";
import {RouterModule, Routes} from "@angular/router";
import {ClusterStepperComponent} from './cluster-stepper/cluster-stepper.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatButtonModule} from "@angular/material/button";
import {DataSourceComponent} from './data-source/data-source/data-source.component';
import {ClusterDataSourceService} from "./data-source/cluster-data-source.service";
import {FileUploadComponent} from './data-source/file-upload/file-upload.component';
import {MatIconModule} from "@angular/material/icon";
import {DragNDropDirective} from './data-source/drag-n-drop.directive';

const routes: Routes = [
  {path: '', component: ClusterComponent, title: 'Cluster'}
];

@NgModule({
  declarations: [ClusterComponent, ClusterStepperComponent, DataSourceComponent, FileUploadComponent, DragNDropDirective],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [ClusterComponent, RouterModule],
  providers: [ClusterDataSourceService]
})
export class ClusterModule {
}
