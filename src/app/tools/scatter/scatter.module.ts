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
import {MatLegacyFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule} from "@angular/material/legacy-input";
import {ReactiveFormsModule} from "@angular/forms";
import {ScatterFormComponent} from './scatter-form/scatter-form.component';
import {InterfaceUtilModule} from "../shared/interface/util";
import {RouterModule, Routes} from "@angular/router";

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
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    ReactiveFormsModule,
    InterfaceUtilModule
  ],
  exports: [ScatterComponent, RouterModule],
  providers: [ScatterService],
})
export class ScatterModule {
}
