import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScatterComponent } from './scatter/scatter.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";



@NgModule({
  declarations: [
    ScatterComponent
  ],
  imports: [
    CommonModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule
  ]
})
export class ScatterModule { }
