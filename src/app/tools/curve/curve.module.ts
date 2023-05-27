import {NgModule} from "@angular/core";
import {CurveComponent} from "./curve.component";
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {LineFormComponent} from "./line-form/line-form.component";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CurveTableComponent} from './curve-table/curve-table.component';
import {HotTableModule} from "@handsontable/angular";
import {CurveService} from "./curve.service";
import {CurveChartComponent} from "./curve-chart/curve-chart.component";
import {NgChartsModule} from "ng2-charts";
import {CurveChartFormComponent} from './curve-chart-form/curve-chart-form.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

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
  ],
  declarations: [
    CurveComponent,
    LineFormComponent,
    CurveTableComponent,
    CurveChartComponent,
    CurveChartFormComponent,
  ],
  exports: [CurveComponent],
  providers: [CurveService],
})
export class CurveModule {
}
