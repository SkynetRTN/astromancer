import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VariableComponent} from './variable/variable.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {VariableLightCurveComponent} from './variable-light-curve/variable-light-curve.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {VariableService} from "./variable.service";
import {VariableTableComponent} from './variable-table/variable-table.component';
import {HotTableModule} from "@handsontable/angular";


@NgModule({
  declarations: [
    VariableComponent,
    VariableLightCurveComponent,
    VariableTableComponent
  ],
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    HotTableModule
  ],
  providers: [VariableService],
})
export class VariableModule { }
