import {NgModule} from "@angular/core";
import {CurveComponent} from "./curve.component";
import {StandardLayoutModule} from "../shared/standard-layout/standard-layout.component";
import {StandardGraphInfoModule} from "../shared/standard-graph-info/standard-graph-info.component";
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {CurveChartModule} from "./curve-chart/curve-chart.module";
import {SimpleTableImplModule} from "../shared/tables/simple-table-impl/simple-table-impl.module";
import {LineFormComponent} from "./line-form/line-form.component";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CurveTableComponent} from './curve-table/curve-table.component';
import {HotTableModule} from "@handsontable/angular";
import {CurveDataService} from "../../service/curve-data.service";
import {CurveService} from "../../service/curve.service";

/**
 * Module encapsulating {@link CurveComponent}
 */
@NgModule({
  imports: [
    StandardLayoutModule,
    CurveChartModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    StandardGraphInfoModule,
    SimpleTableImplModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HotTableModule,
  ],
  declarations: [
    CurveComponent,
    LineFormComponent,
    CurveTableComponent,
  ],
  exports: [CurveComponent],
  providers: [CurveDataService, CurveService],
})
export class CurveModule {
}
