import {NgModule} from "@angular/core";
import {MoonComponent} from "./moon/moon.component";
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {MoonTableComponent} from "./moon-table/moon-table.component";
import {HotTableModule} from "@handsontable/angular";
import {MoonService} from "./moon.service";
import {MoonHighchartComponent} from "./moon-highchart/moon-highchart.component";
import {HighchartsChartModule} from "highcharts-angular";
import {MoonChartFormComponent} from './moon-chart-form/moon-chart-form.component';
import {MatLegacyFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule} from "@angular/material/legacy-input";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    MoonComponent,
    MoonTableComponent,
    MoonHighchartComponent,
    MoonChartFormComponent,
  ],
  imports: [
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    HotTableModule,
    HighchartsChartModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    ReactiveFormsModule
  ],
  providers: [MoonService],
})
export class MoonModule {
}
