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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MoonFormComponent} from './moon-form/moon-form.component';
import {MatSliderModule} from "@angular/material/slider";
import {CommonModule, NgIf} from "@angular/common";
import {InterfaceUtilModule} from "../shared/interface/util";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {path: '', component: MoonComponent, title: 'Moon'}
];

@NgModule({
  declarations: [
    MoonComponent,
    MoonTableComponent,
    MoonHighchartComponent,
    MoonChartFormComponent,
    MoonFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    InterfaceUtilModule,
    HotTableModule,
    HighchartsChartModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    ReactiveFormsModule,
    MatSliderModule,
    FormsModule,
    NgIf,
  ],
  exports: [MoonComponent, RouterModule],
  providers: [MoonService],
})
export class MoonModule {
}
