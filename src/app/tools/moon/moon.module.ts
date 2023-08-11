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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MoonFormComponent} from './moon-form/moon-form.component';
import {MatSliderModule} from "@angular/material/slider";
import {CommonModule, NgIf} from "@angular/common";
import {InterfaceUtilModule} from "../shared/interface/util";
import {RouterModule, Routes} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";


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
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSliderModule,
    FormsModule,
    NgIf,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [MoonComponent, RouterModule],
  providers: [MoonService],
})
export class MoonModule {
}
