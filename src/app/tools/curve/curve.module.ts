import {NgModule} from "@angular/core";
import {CurveComponent} from "./curve.component";
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {LineFormComponent} from "./line-form/line-form.component";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CurveTableComponent} from './curve-table/curve-table.component';
import {HotTableModule} from "@handsontable/angular";
import {CurveService} from "./curve.service";
import {CurveChartComponent} from "./curve-chart/curve-chart.component";
import {NgChartsModule} from "ng2-charts";
import {CurveChartFormComponent} from './curve-chart-form/curve-chart-form.component';
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacySlideToggleModule as MatSlideToggleModule} from "@angular/material/legacy-slide-toggle";
import { CurveHighChartComponent } from './curve-highchart/curve-high-chart.component';
import {HighchartsChartModule} from "highcharts-angular";

/**
 * Module encapsulating {@link CurveComponent}
 */
@NgModule({
  imports: [
    NgChartsModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HotTableModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    HighchartsChartModule,
  ],
  declarations: [
    CurveComponent,
    LineFormComponent,
    CurveTableComponent,
    CurveChartComponent,
    CurveChartFormComponent,
    CurveHighChartComponent,
  ],
  exports: [CurveComponent],
  providers: [CurveService],
})
export class CurveModule {
}
