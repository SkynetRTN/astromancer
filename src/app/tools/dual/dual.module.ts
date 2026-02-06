import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DualComponent} from './dual/dual.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {DualService} from "./dual.service";
import {DualTableComponent} from './dual-table/dual-table.component';
import {HotTableModule} from "@handsontable/angular";
import {DualChartFormComponent} from './dual-chart-form/dual-chart-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DualHighchartComponent} from './dual-highchart/dual-highchart.component';
import {HighchartsChartModule} from "highcharts-angular";
import {DualEchartComponent} from './dual-echart/dual-echart.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {RouterModule, Routes} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";


const routes: Routes = [
  {path: '', component: DualComponent, title: 'Dual'}
];

@NgModule({
  declarations: [
    DualComponent,
    DualTableComponent,
    DualChartFormComponent,
    DualHighchartComponent,
    DualEchartComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    HotTableModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [DualComponent, RouterModule, DualEchartComponent, DualHighchartComponent],
  providers: [DualService]
})
export class DualModule {
}
