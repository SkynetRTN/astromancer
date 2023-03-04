import { NgModule } from "@angular/core";
import { CurveComponent } from "./curve.component";
import { StandardLayoutModule } from "../shared/standard-layout/standard-layout.component";
import { StandardGraphInfoModule } from "../shared/standard-graph-info/standard-graph-info.component";
import { SimpleDataButtonModule } from "../shared/simple-data-button/simple-data-button.component";
import { SimpleGraphButtonModule } from "../shared/simple-graph-button/simple-graph-button.component";
import { LineFormModule } from "./line-form/line-form.module";
import { CurveChartModule } from "./curve-chart/curve-chart.module";
import { SimpleTableImplModule } from "../shared/tables/simple-table-impl/simple-table-impl.module";

/**
 * Module encapsulating {@link CurveComponent}
 */
@NgModule({
  imports: [
    StandardLayoutModule,
    LineFormModule,
    CurveChartModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    StandardGraphInfoModule,
    SimpleTableImplModule,
  ],
  declarations: [
    CurveComponent,
  ],
  exports: [CurveComponent],
})
export class CurveModule {
}
