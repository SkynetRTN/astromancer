import {NgModule} from "@angular/core";
import {RadioSearchComponent} from "./radiosearch.component";
import {RadioSearchService} from "./radiosearch.service";
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component"
import {HotTableModule} from "@handsontable/angular";
import {HighchartsChartModule} from "highcharts-angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSliderModule} from "@angular/material/slider";
import {CommonModule, NgIf} from "@angular/common";
import {InterfaceUtilModule} from "../shared/interface/util";
import {RouterModule, Routes} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from '@angular/material/table'; 
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {RadioSearchHighChartComponent} from "./radiosearch-highchart/radiosearch-high-chart.component";
import {RadioSearchHighChartService} from "./radiosearch.service";
import {RadioSearchCanvasComponent} from "./radiosearch-canvas/radiosearch-canvas.component";


const routes: Routes = [
  {path: '', component: RadioSearchComponent, title: 'Radio Sources'}
];

@NgModule({
  declarations: [
    RadioSearchComponent,
    RadioSearchHighChartComponent,
    RadioSearchCanvasComponent,
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
    MatTableModule,
    MatIconModule, 
    MatSortModule,
    ReactiveFormsModule,
    MatSliderModule,
    FormsModule,
    NgIf,
    MatDialogModule,
    MatButtonModule,
  ],
  exports: [RadioSearchComponent, RouterModule, RadioSearchHighChartComponent, RadioSearchCanvasComponent],
  providers: [RadioSearchService, RadioSearchHighChartService],
})
export class RadioSearchModule {
}
