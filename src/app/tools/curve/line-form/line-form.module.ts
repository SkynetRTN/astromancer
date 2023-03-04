import { NgModule } from "@angular/core";
import { LineFormComponent } from "./line-form.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FormsModule } from "@angular/forms";

/**
 * Module encapsulating {@link LineFormComponent}.
 */
@NgModule({
  imports: [
    MatSelectModule,
    BrowserAnimationsModule, // required for MatSelectModule for some reason :(
    MatButtonToggleModule,
    FormsModule,
  ],
  declarations: [LineFormComponent]
})
export class LineFormModule {
}
