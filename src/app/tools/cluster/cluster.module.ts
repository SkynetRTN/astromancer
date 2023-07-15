import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClusterComponent} from "./cluster/cluster.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {path: '', component: ClusterComponent, title: 'Cluster'}
];

@NgModule({
  declarations: [ClusterComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [ClusterComponent, RouterModule],
})
export class ClusterModule { }
