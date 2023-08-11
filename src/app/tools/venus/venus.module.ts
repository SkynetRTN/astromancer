import {NgModule} from '@angular/core';
import {VenusComponent} from './venus/venus.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {VenusService} from "./venus.service";
import {VenusTableComponent} from './venus-table/venus-table.component';
import {HotTableModule} from "@handsontable/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {VenusHighchartComponent} from './venus-highchart/venus-highchart.component';
import {HighchartsChartModule} from "highcharts-angular";
import {VenusChartFormComponent} from './venus-chart-form/venus-chart-form.component';
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";


const routes: Routes = [
  {path: '', component: VenusComponent, title: 'Venus'}
];

@NgModule({
  declarations: [
    VenusComponent,
    VenusTableComponent,
    VenusHighchartComponent,
    VenusChartFormComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    HotTableModule,
    FormsModule,
    HighchartsChartModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [VenusComponent, RouterModule],
  providers: [VenusService],
})
export class VenusModule {
}
