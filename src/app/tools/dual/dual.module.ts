import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DualComponent } from './dual/dual.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {DualService} from "./dual.service";
import { DualTableComponent } from './dual-table/dual-table.component';
import {HotTableModule} from "@handsontable/angular";



@NgModule({
  declarations: [
    DualComponent,
    DualTableComponent
  ],
  imports: [
    CommonModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    HotTableModule
  ],
  providers: [DualService]
})
export class DualModule { }
