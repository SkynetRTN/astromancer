import {NgModule} from "@angular/core";
import {CurveComponent} from "./curve.component";
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {LineFormComponent} from "./line-form/line-form.component";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CurveTableComponent} from './curve-table/curve-table.component';
import {HotTableModule} from "@handsontable/angular";
import {CurveService} from "./curve.service";
import {CurveChartComponent} from "./curve-chart/curve-chart.component";
import {NgChartsModule} from "ng2-charts";
import {CurveChartFormComponent} from './curve-chart-form/curve-chart-form.component';
import {MatIconModule} from "@angular/material/icon";
import {CurveHighChartComponent} from './curve-highchart/curve-high-chart.component';
import {HighchartsChartModule} from "highcharts-angular";
import {HonorCodePopupService} from "../shared/honor-code-popup/honor-code-popup.service";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

const routes: Routes = [
  {path: '', component: CurveComponent, title: 'Curve'}
];


/**
 * Module encapsulating {@link CurveComponent}
 */
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgChartsModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    HotTableModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    HighchartsChartModule,
    MatDialogModule,
  ],
  declarations: [
    CurveComponent,
    LineFormComponent,
    CurveTableComponent,
    CurveChartComponent,
    CurveChartFormComponent,
    CurveHighChartComponent,
  ],
  exports: [CurveComponent, RouterModule],
  providers: [CurveService, HonorCodePopupService],
})
export class CurveModule {
}




