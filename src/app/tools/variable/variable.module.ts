import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VariableComponent } from './variable/variable.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";



@NgModule({
  declarations: [
    VariableComponent
  ],
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ]
})
export class VariableModule { }
