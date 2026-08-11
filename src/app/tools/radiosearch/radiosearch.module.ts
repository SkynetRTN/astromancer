import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {HighchartsChartModule} from "highcharts-angular";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatSliderModule} from "@angular/material/slider";
import {MatTooltipModule} from "@angular/material/tooltip";

import {RadioSearchComponent} from "./radiosearch.component";
import {RadioSearchHighChartComponent} from "./radiosearch-highchart/radiosearch-high-chart.component";
import {DialogContent} from "./dialogContent.component";
import {RadioSearchHighChartService, RadioSearchService} from "./radiosearch.service";

const routes: Routes = [
  {path: '', component: RadioSearchComponent, title: 'Radio Sources'}
];

@NgModule({
  declarations: [
    RadioSearchComponent,
    RadioSearchHighChartComponent,
    DialogContent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    HighchartsChartModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatSliderModule,
    MatTooltipModule,
  ],
  exports: [RadioSearchComponent, RouterModule, RadioSearchHighChartComponent],
  providers: [RadioSearchService, RadioSearchHighChartService],
})
export class RadioSearchModule {
}
