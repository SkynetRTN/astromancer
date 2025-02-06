import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PulsarComponent} from './pulsar/pulsar.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {PulsarLightCurveComponent} from './light-curve/pulsar-light-curve/pulsar-light-curve.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {PulsarService} from "./pulsar.service";
import {PulsarTableComponent} from './light-curve/pulsar-table/pulsar-table.component';
import {HotTableModule} from "@handsontable/angular";
import {
  PulsarLightCurveFormComponent
} from './light-curve/pulsar-light-curve-form/pulsar-light-curve-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {
  PulsarLightCurveChartFormComponent
} from './light-curve/pulsar-light-curve-chart-form/pulsar-light-curve-chart-form.component';
import {
  PulsarLightCurveHighchartComponent
} from './light-curve/pulsar-light-curve-highchart/pulsar-light-curve-highchart.component';
import {HighchartsChartModule} from "highcharts-angular";
import {PulsarPeriodogramComponent} from './periodogram/pulsar-periodogram/pulsar-periodogram.component';
import {
  PulsarPeriodogramHighchartsComponent
} from './periodogram/pulsar-periodogram-highcharts/pulsar-periodogram-highcharts.component';
import {
  PulsarPeriodogramFormComponent
} from './periodogram/pulsar-periodogram-form/pulsar-periodogram-form.component';
import {
  PulsarPeriodFoldingComponent
} from './period-folding/pulsar-period-folding/pulsar-period-folding.component';
import {
  PulsarPeriodFoldingFormComponent
} from './period-folding/pulsar-period-folding-form/pulsar-period-folding-form.component';
import {
  PulsarPeriodFoldingHighchartComponent
} from './period-folding/pulsar-period-folding-highchart/pulsar-period-folding-highchart.component';
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
    PulsarTableComponent,
    PulsarLightCurveFormComponent,
    PulsarLightCurveChartFormComponent,
    PulsarLightCurveHighchartComponent,
    PulsarPeriodogramComponent,
    PulsarPeriodogramHighchartsComponent,
    PulsarPeriodogramFormComponent,
    PulsarPeriodFoldingComponent,
    PulsarPeriodFoldingFormComponent,
    PulsarPeriodFoldingHighchartComponent
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
  exports: [PulsarComponent, RouterModule, PulsarLightCurveHighchartComponent],
  providers: [PulsarService],
})
export class PulsarModule {
}
