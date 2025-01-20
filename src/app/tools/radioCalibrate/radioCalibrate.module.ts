import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import {RadioCalibrateComponent} from "./radioCalibrate.component";
import {RouterModule, Routes} from "@angular/router";
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component"
import {HotTableModule} from "@handsontable/angular";
import {HighchartsChartModule} from "highcharts-angular";
import {MatSliderModule} from "@angular/material/slider";
import {CommonModule, NgIf} from "@angular/common";
import {InterfaceUtilModule} from "../shared/interface/util";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from '@angular/material/table'; 
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { AppRoutingModule } from '../../app-routing.module';
import { AppComponent } from '../../app.component';
import { MatOptionModule } from '@angular/material/core';


const routes: Routes = [
  {path: '', component: RadioCalibrateComponent, title: 'Radio Calibration'}
];

@NgModule({
    declarations: [
        RadioCalibrateComponent
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
            MatOptionModule,
            MatSelectModule,


    ],
    exports: [RadioCalibrateComponent],
  })
export class RadioCalibrateModule {
 }
