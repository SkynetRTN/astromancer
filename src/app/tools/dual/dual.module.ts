import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DualComponent } from './dual/dual.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";
import {DualService} from "./dual.service";



@NgModule({
  declarations: [
    DualComponent
  ],
  imports: [
    CommonModule,
    SimpleDataButtonModule,
    SimpleGraphButtonModule
  ],
  providers: [DualService]
})
export class DualModule { }
