import {NgModule} from '@angular/core';
import {VenusComponent} from './venus/venus.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {VenusService} from "./venus.service";
import {VenusTableComponent} from './venus-table/venus-table.component';
import {HotTableModule} from "@handsontable/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {VenusHighchartComponent} from './venus-highchart/venus-highchart.component';
import {HighchartsChartModule} from "highcharts-angular";
import {VenusChartFormComponent} from './venus-chart-form/venus-chart-form.component';
import {MatLegacyFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule} from "@angular/material/legacy-input";


@NgModule({
  declarations: [
    VenusComponent,
    VenusTableComponent,
    VenusHighchartComponent,
    VenusChartFormComponent
  ],
  imports: [
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    HotTableModule,
    FormsModule,
    HighchartsChartModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    ReactiveFormsModule,
  ],
  providers: [VenusService],
})
export class VenusModule { }
