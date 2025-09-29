import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GalaxyComponent} from './galaxy/galaxy.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {GalaxyTableComponent} from './galaxy-table/galaxy-table.component';
import {HotTableModule} from "@handsontable/angular";
import {GalaxyService} from "./galaxy.service";
import {GalaxyFormComponent} from './galaxy-form/galaxy-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


import {GalaxyChartFormComponent} from './galaxy-chart-form/galaxy-chart-form.component';

import {GalaxyHighchartComponent} from './galaxy-highchart/galaxy-highchart.component';
import {HighchartsChartModule} from "highcharts-angular";
import {RouterModule, Routes} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatSliderModule} from "@angular/material/slider";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";


const routes: Routes = [
  {path: '', component: GalaxyComponent, title: 'Galaxy'}
];

@NgModule({
  declarations: [
    GalaxyComponent,
    GalaxyTableComponent,
    GalaxyFormComponent,
    GalaxyChartFormComponent,
    GalaxyHighchartComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SimpleDataButtonModule,
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
  exports: [GalaxyComponent, RouterModule, GalaxyHighchartComponent],
  providers: [GalaxyService]
})
export class GalaxyModule {
}
