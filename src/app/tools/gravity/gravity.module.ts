import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ParamMatching} from './param-matching/param-matching/param-matching.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {HotTableModule} from "@handsontable/angular";
import {InterfaceService as InterfaceService} from "./param-matching/gravity-form/gravity-interface.service";
import {GravityFormComponent} from './param-matching/gravity-form/gravity-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InterfaceUtilModule} from "../shared/interface/util";
import { FileUploadBigComponent } from '../shared/file-upload-big/file-upload-big.component';

import {GravityStrainchartComponent} from './param-matching/gravity-strainchart/gravity-strainchart.component';
import { GravitySpectogramComponent } from './param-matching/gravity-spectogram/gravity-spectogram.component';
import {HighchartsChartModule} from "highcharts-angular";
import {RouterModule, Routes} from "@angular/router";

import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import { MatListModule } from '@angular/material/list';
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatSliderModule} from "@angular/material/slider";
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

import { SpectogramService } from './param-matching/gravity-spectogram/gravity-spectogram.service';
import { StrainService } from './param-matching/gravity-strainchart/gravity-strain.service';
import { ResultSummaryComponent } from './param-matching/result-summary/result-summary.component';
import { MatDividerModule } from '@angular/material/divider';

import { LookUpComponent } from './data-source/look-up/look-up.component';
import { GravityDataService } from './gravity-data.service';
import { GravityStorageService } from './storage/gravity-storage.service';
import { GravityComponent } from './gravity/gravity.component';
import { DataSourceComponent } from './data-source/data-source/data-source.component';
import { GravityDataSourceService } from './data-source/gravity-data-source-service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BufferComponent } from './data-source/buffer-popup/buffer-popup';
import { MatCardModule } from '@angular/material/card';


const routes: Routes = [
  {path: '', component: GravityComponent, title: 'Gravity'}
];

@NgModule({
  declarations: [
    DataSourceComponent,
    GravityComponent,
    LookUpComponent,
    ParamMatching,
    BufferComponent,
    GravityFormComponent,
    GravityStrainchartComponent,
    GravitySpectogramComponent,
    ResultSummaryComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SimpleDataButtonModule,
    InterfaceUtilModule,
    SimpleGraphButtonModule,
    HotTableModule,
    FormsModule,

    MatCardModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatGridListModule,
    MatListModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSliderModule,

    ReactiveFormsModule,
    HighchartsChartModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [DataSourceComponent, GravityComponent, LookUpComponent, ParamMatching, RouterModule, GravityStrainchartComponent],
  providers: [GravityStorageService, GravityDataService, GravityDataSourceService, InterfaceService, SpectogramService, StrainService]
})
export class GravityModule {
}
