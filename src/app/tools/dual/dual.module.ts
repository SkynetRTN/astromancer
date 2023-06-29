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
import {MatLegacyFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule} from "@angular/material/legacy-input";


@NgModule({
  declarations: [
    DualComponent,
    DualTableComponent,
    DualChartFormComponent
  ],
  imports: [
    CommonModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    HotTableModule,
    FormsModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    ReactiveFormsModule
  ],
  providers: [DualService]
})
export class DualModule { }
