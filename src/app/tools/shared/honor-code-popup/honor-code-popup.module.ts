import {NgModule} from "@angular/core";
import {HonorCodePopupComponent} from "./honor-code-popup.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";

/**
 * Module encapsulating {@link HonorCodePopupComponent}
 */
@NgModule({
  imports: [
    NgbModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
  ],
  declarations: [HonorCodePopupComponent]
})
export class HonorCodePopupModule {
}
