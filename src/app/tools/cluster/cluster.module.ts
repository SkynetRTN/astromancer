import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClusterComponent} from "./cluster/cluster.component";
import {RouterModule, Routes} from "@angular/router";
import {ClusterStepperComponent} from './cluster-stepper/cluster-stepper.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatButtonModule} from "@angular/material/button";
import {DataSourceComponent} from './data-source/data-source/data-source.component';
import {ClusterDataSourceService} from "./data-source/cluster-data-source.service";

const routes: Routes = [
  {path: '', component: ClusterComponent, title: 'Cluster'}
];

@NgModule({
  declarations: [ClusterComponent, ClusterStepperComponent, DataSourceComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatStepperModule,
    MatButtonModule
  ],
  exports: [ClusterComponent, RouterModule],
  providers: [ClusterDataSourceService]
})
export class ClusterModule {
}
