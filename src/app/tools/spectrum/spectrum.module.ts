import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SpectrumComponent} from './spectrum/spectrum.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {SpectrumTableComponent} from './spectrum-table/spectrum-table.component';
import {HotTableModule} from "@handsontable/angular";
import {SpectrumService} from "./spectrum.service";
import {SpectrumFormComponent} from './spectrum-form/spectrum-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


import {SpectrumChartFormComponent} from './spectrum-chart-form/spectrum-chart-form.component';

import {SpectrumHighchartComponent} from './spectrum-highchart/spectrum-highchart.component';
import {HighchartsChartModule} from "highcharts-angular";
import {SpectrumEchartComponent} from './spectrum-echart/spectrum-echart.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {RouterModule, Routes} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatSliderModule} from "@angular/material/slider";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";


const routes: Routes = [
  {path: '', component: SpectrumComponent, title: 'Spectrum'}
];

@NgModule({
  declarations: [
    SpectrumComponent,
    SpectrumTableComponent,
    SpectrumFormComponent,
    SpectrumChartFormComponent,
    SpectrumHighchartComponent,
    SpectrumEchartComponent
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
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [SpectrumComponent, RouterModule, SpectrumEchartComponent],
  providers: [SpectrumService]
})
export class SpectrumModule {
}
