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
import {VariableLightCurveFormComponent} from './light-curve/variable-light-curve-form/variable-light-curve-form.component';
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
import { VariablePeriodogramHighchartsComponent } from './periodogram/variable-periodogram-highcharts/variable-periodogram-highcharts.component';
import { VariablePeriodogramFormComponent } from './periodogram/variable-periodogram-form/variable-periodogram-form.component';


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
    VariablePeriodogramFormComponent
  ],
  imports: [
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
  ],
  providers: [VariableService],
})
export class VariableModule { }
