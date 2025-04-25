import {NgModule} from "@angular/core";
import {InputSliderComponent} from "./input-slider/input-slider.component";
import {MatInputModule} from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import {MatSliderModule} from "@angular/material/slider";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgIf} from "@angular/common";
import { FileUploadBigComponent } from "../file-upload-big/file-upload-big.component";
import { ErrorComponent } from "../error-popup/error.component";
import { DragNDropDirective } from "../file-upload-big/drag-n-drop.directive";
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
    imports: [
        MatIconModule,
        MatInputModule,
        MatDialogModule,
        MatSliderModule,
        ReactiveFormsModule,
        FormsModule,
        JsonPipe,
        NgIf
    ],
  exports: [
    InputSliderComponent,
    FileUploadBigComponent,
    ErrorComponent
  ],
  declarations: [InputSliderComponent, FileUploadBigComponent, ErrorComponent, DragNDropDirective]
})
export class InterfaceUtilModule {
}
