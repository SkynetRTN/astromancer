import {NgModule} from "@angular/core";
import {InputSliderComponent} from "./input-slider/input-slider.component";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    MatInputModule,
    MatSliderModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    InputSliderComponent
  ],
  declarations: [InputSliderComponent]
})
export class InterfaceUtilModule {
}
