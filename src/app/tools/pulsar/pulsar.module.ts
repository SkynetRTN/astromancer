import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PulsarComponent} from './pulsar/pulsar.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {PulsarLightCurveComponent} from './light-curve/pulsar-light-curve.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {PulsarService} from "./pulsar.service";
import {HotTableModule} from "@handsontable/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
// import {
//   PulsarLightCurveHighchartComponent
// } from './light-curve/pulsar-light-curve-highchart/pulsar-light-curve-highchart.component';
import {HighchartsChartModule} from "highcharts-angular";
import {PulsarPeriodogramComponent} from './periodogram/pulsar-periodogram.component';
import {
  PulsarPeriodogramHighchartsComponent
} from './periodogram/pulsar-periodogram-highcharts/pulsar-periodogram-highcharts.component';
import {
  PulsarPeriodFoldingComponent
} from './period-folding/pulsar-period-folding.component';
import {
    PulsarPeriodFoldingHighchartsComponent
} from './period-folding/pulsar-period-folding-highcharts/pulsar-period-folding-highcharts.component';
import {InterfaceUtilModule} from "../shared/interface/util";
import {RouterModule, Routes} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";

const routes: Routes = [
  {path: '', component: PulsarComponent, title: 'Pulsar'}
];

@NgModule({
  declarations: [
    PulsarComponent,
    PulsarLightCurveComponent,
    // PulsarLightCurveHighchartComponent,
    PulsarPeriodogramComponent,
    PulsarPeriodogramHighchartsComponent,
    PulsarPeriodFoldingComponent,
    PulsarPeriodFoldingHighchartsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    HotTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    HighchartsChartModule,
    InterfaceUtilModule,
    MatDialogModule,
  ],
  exports: [PulsarComponent, RouterModule],
  providers: [PulsarService],
})
export class PulsarModule {
}
