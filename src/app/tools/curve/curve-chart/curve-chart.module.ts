import { NgModule } from "@angular/core";
import { CurveChartComponent } from "./curve-chart.component";
import { NgChartsModule } from "ng2-charts";
/**
 * Module encapsulating {@link CurveChartComponent}.
 */
@NgModule({
  imports: [
    NgChartsModule,
  ],
  declarations: [CurveChartComponent]
})
export class CurveChartModule {
}
