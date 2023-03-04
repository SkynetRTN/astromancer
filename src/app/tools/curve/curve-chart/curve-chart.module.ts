import {NgModule} from "@angular/core";
import {CurveChartComponent} from "./curve-chart.component";
import {NgChartsModule} from "ng2-charts";

@NgModule({
  imports: [
    NgChartsModule,
  ],
  declarations: [CurveChartComponent]
})
export class CurveChartModule {
}
