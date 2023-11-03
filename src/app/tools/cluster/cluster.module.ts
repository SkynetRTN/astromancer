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
import {SummaryComponent} from './data-source/summary/summary.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ClusterDataService} from "./cluster-data.service";
import {ClusterService} from "./cluster.service";
import {HttpClientModule} from "@angular/common/http";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {LookUpComponent} from './data-source/look-up/look-up.component';
import {MatListModule} from "@angular/material/list";

const routes: Routes = [
  {path: '', component: ClusterComponent, title: 'Cluster'}
];

@NgModule({
  declarations: [ClusterComponent, ClusterStepperComponent, DataSourceComponent, FileUploadComponent, DragNDropDirective, SummaryComponent, LookUpComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatListModule,
  ],
  exports: [ClusterComponent, RouterModule],
  providers: [ClusterDataSourceService, ClusterService, ClusterDataService]
})
export class ClusterModule {
}
