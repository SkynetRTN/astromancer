import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GravityComponent} from './gravity/gravity.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {GravityTableComponent} from './gravity-table/gravity-table.component';
import {HotTableModule} from "@handsontable/angular";
import {GravityService} from "./gravity.service";
import {GravityFormComponent} from './gravity-form/gravity-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InterfaceUtilModule} from "../shared/interface/util";

import {GravityChartFormComponent} from './gravity-chart-form/gravity-chart-form.component';

import {GravityHighchartComponent} from './gravity-highchart/gravity-highchart.component';
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
import { GravityDataService } from './gravity-data.service';


const routes: Routes = [
  {path: '', component: GravityComponent, title: 'Gravity'}
];

@NgModule({
  declarations: [
    GravityComponent,
    GravityTableComponent,
    GravityFormComponent,
    GravityChartFormComponent,
    GravityHighchartComponent,
    GravitySpectogramComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SimpleDataButtonModule,
    InterfaceUtilModule,
    SimpleGraphButtonModule,
    HotTableModule,
    FormsModule,
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
  exports: [GravityComponent, RouterModule, GravityHighchartComponent],
  providers: [GravityService, GravityDataService]
})
export class GravityModule {
}
