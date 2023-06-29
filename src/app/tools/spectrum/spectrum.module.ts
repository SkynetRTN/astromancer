import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SpectrumComponent} from './spectrum/spectrum.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {SpectrumTableComponent} from './spectrum-table/spectrum-table.component';
import {HotTableModule} from "@handsontable/angular";
import {SpectrumService} from "./spectrum.service";


@NgModule({
  declarations: [
    SpectrumComponent,
    SpectrumTableComponent
  ],
  imports: [
    CommonModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    HotTableModule
  ],
  providers: [SpectrumService]
})
export class SpectrumModule { }
