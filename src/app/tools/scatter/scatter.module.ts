import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScatterComponent} from './scatter/scatter.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {ScatterService} from "./scatter.service";
import {ScatterTableComponent} from './scatter-table/scatter-table.component';
import {HotTableModule} from "@handsontable/angular";
import {ScatterHighchartComponent} from './scatter-highchart/scatter-highchart.component';
import {HighchartsChartModule} from "highcharts-angular";
import {ScatterChartFormComponent} from './scatter-chart-form/scatter-chart-form.component';
import {ReactiveFormsModule} from "@angular/forms";
import {ScatterFormComponent} from './scatter-form/scatter-form.component';
import {InterfaceUtilModule} from "../shared/interface/util";
import {RouterModule, Routes} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [
  {path: '', component: ScatterComponent, title: 'Scatter'}
];

@NgModule({
  declarations: [
    ScatterComponent,
    ScatterTableComponent,
    ScatterHighchartComponent,
    ScatterChartFormComponent,
    ScatterFormComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    HotTableModule,
    HighchartsChartModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    InterfaceUtilModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [ScatterComponent, RouterModule, ScatterHighchartComponent],
  providers: [ScatterService],
})
export class ScatterModule {
}
