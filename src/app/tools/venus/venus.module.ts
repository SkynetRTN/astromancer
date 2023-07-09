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
import {MatLegacyFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule} from "@angular/material/legacy-input";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";
import {MatLegacyButtonModule} from "@angular/material/legacy-button";

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
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatLegacyButtonModule,
  ],
  exports: [VenusComponent, RouterModule],
  providers: [VenusService],
})
export class VenusModule {
}
