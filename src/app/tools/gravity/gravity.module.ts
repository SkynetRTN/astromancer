import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GravityComponent} from './gravity/gravity.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {HotTableModule} from "@handsontable/angular";
import {InterfaceService as InterfaceService} from "./gravity-form/gravity-interface.service";
import {GravityFormComponent} from './gravity-form/gravity-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InterfaceUtilModule} from "../shared/interface/util";
import { FileUploadBigComponent } from '../shared/file-upload-big/file-upload-big.component';

import {GravityStrainchartComponent} from './gravity-strainchart/gravity-strainchart.component';
import { GravitySpectogramComponent } from './gravity-spectogram/gravity-spectogram.component';
import {HighchartsChartModule} from "highcharts-angular";
import {RouterModule, Routes} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatSliderModule} from "@angular/material/slider";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { SpectogramService } from './gravity-spectogram/gravity-spectogram.service';
import { StrainService } from './gravity-strainchart/gravity-strain.service';
import { ResultSummaryComponent } from './result-summary/result-summary.component';
import { MatDividerModule } from '@angular/material/divider';
import { GravityDataService } from './gravity-data.service';


const routes: Routes = [
  {path: '', component: GravityComponent, title: 'Gravity'}
];

@NgModule({
  declarations: [
    GravityComponent,
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
    MatDividerModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatInputModule,
    HighchartsChartModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [GravityComponent, RouterModule, GravityStrainchartComponent],
  providers: [GravityDataService, InterfaceService, SpectogramService, StrainService]
})
export class GravityModule {
}
