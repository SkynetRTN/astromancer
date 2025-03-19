import {NgModule} from "@angular/core";
import {InputSliderComponent} from "./input-slider/input-slider.component";
import {MatInputModule} from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import {MatSliderModule} from "@angular/material/slider";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import { FileUploadBigComponent } from "../file-upload-big/file-upload-big.component";

@NgModule({
    imports: [
        MatIconModule,
        MatInputModule,
        MatSliderModule,
        ReactiveFormsModule,
        FormsModule,
        NgIf
    ],
  exports: [
    InputSliderComponent,
    FileUploadBigComponent
  ],
  declarations: [InputSliderComponent, FileUploadBigComponent]
})
export class InterfaceUtilModule {
}
