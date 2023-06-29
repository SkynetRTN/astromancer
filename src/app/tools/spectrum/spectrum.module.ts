import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpectrumComponent } from './spectrum/spectrum.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";



@NgModule({
  declarations: [
    SpectrumComponent
  ],
  imports: [
    CommonModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule
  ]
})
export class SpectrumModule { }
