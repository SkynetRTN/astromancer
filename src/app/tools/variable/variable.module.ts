import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VariableComponent} from './variable/variable.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {VariableLightCurveComponent} from './light-curve/variable-light-curve/variable-light-curve.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {VariableService} from "./variable.service";
import {VariableTableComponent} from './light-curve/variable-table/variable-table.component';
import {HotTableModule} from "@handsontable/angular";
import {
  VariableLightCurveFormComponent
} from './light-curve/variable-light-curve-form/variable-light-curve-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {
  VariableLightCurveChartFormComponent
} from './light-curve/variable-light-curve-chart-form/variable-light-curve-chart-form.component';
import {
  VariableLightCurveHighchartComponent
} from './light-curve/variable-light-curve-highchart/variable-light-curve-highchart.component';
import {HighchartsChartModule} from "highcharts-angular";
import {VariablePeriodogramComponent} from './periodogram/variable-periodogram/variable-periodogram.component';
import {
  VariablePeriodogramHighchartsComponent
} from './periodogram/variable-periodogram-highcharts/variable-periodogram-highcharts.component';
import {
  VariablePeriodogramFormComponent
} from './periodogram/variable-periodogram-form/variable-periodogram-form.component';
import {
  VariablePeriodFoldingComponent
} from './period-folding/variable-period-folding/variable-period-folding.component';
import {
  VariablePeriodFoldingFormComponent
} from './period-folding/variable-period-folding-form/variable-period-folding-form.component';
import {
  VariablePeriodFoldingHighchartComponent
} from './period-folding/variable-period-folding-highchart/variable-period-folding-highchart.component';
import {InterfaceUtilModule} from "../shared/interface/util";
import {RouterModule, Routes} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";

const routes: Routes = [
  {path: '', component: VariableComponent, title: 'Variable'}
];

@NgModule({
  declarations: [
    VariableComponent,
    VariableLightCurveComponent,
    VariableTableComponent,
    VariableLightCurveFormComponent,
    VariableLightCurveChartFormComponent,
    VariableLightCurveHighchartComponent,
    VariablePeriodogramComponent,
    VariablePeriodogramHighchartsComponent,
    VariablePeriodogramFormComponent,
    VariablePeriodFoldingComponent,
    VariablePeriodFoldingFormComponent,
    VariablePeriodFoldingHighchartComponent
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
  exports: [VariableComponent, RouterModule, VariableLightCurveHighchartComponent],
  providers: [VariableService],
})
export class VariableModule {
}
