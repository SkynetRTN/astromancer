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
import {SummaryComponent} from './data-source/pop-ups/summary/summary.component';
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
import {FetchComponent} from './data-source/pop-ups/fetch/fetch.component';
import {MatSelectModule} from "@angular/material/select";
import {ClusterStorageService} from "./storage/cluster-storage.service";
import {MatTabsModule} from "@angular/material/tabs";
import {InProgressComponent} from './data-source/pop-ups/in-progress/in-progress.component';
import {ResetComponent} from './data-source/pop-ups/reset/reset.component';
import {FieldStarRemovalComponent} from './FSR/field-star-removal/field-star-removal.component';
import {HistogramSliderInputComponent} from './FSR/histogram-slider-input/histogram-slider-input.component';
import {NgChartsModule} from "ng2-charts";
import {HighchartsChartModule} from "highcharts-angular";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSliderModule} from "@angular/material/slider";
import {PieChartComponent} from './FSR/pie-chart/pie-chart.component';

const routes: Routes = [
  {path: '', component: ClusterComponent, title: 'Cluster'}
];

@NgModule({
  declarations: [ClusterComponent, ClusterStepperComponent, DataSourceComponent, FileUploadComponent, DragNDropDirective, SummaryComponent, LookUpComponent, FetchComponent, InProgressComponent, ResetComponent, FieldStarRemovalComponent, HistogramSliderInputComponent, PieChartComponent],
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
    MatSelectModule,
    MatTabsModule,
    NgChartsModule,
    HighchartsChartModule,
    MatSlideToggleModule,
    MatSliderModule,
  ],
  exports: [ClusterComponent, RouterModule],
  providers: [ClusterDataSourceService, ClusterService, ClusterDataService, ClusterStorageService]
})
export class ClusterModule {
}
