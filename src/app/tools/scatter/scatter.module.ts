import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScatterComponent} from './scatter/scatter.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {ScatterService} from "./scatter.service";
import {ScatterTableComponent} from './scatter-table/scatter-table.component';
import {HotTableModule} from "@handsontable/angular";


@NgModule({
  declarations: [
    ScatterComponent,
    ScatterTableComponent
  ],
  imports: [
    CommonModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    HotTableModule
  ],
  providers: [ScatterService,],
})
export class ScatterModule { }
