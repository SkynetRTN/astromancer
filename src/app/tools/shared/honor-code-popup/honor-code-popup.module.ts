import {NgModule} from "@angular/core";
import {HonorCodePopupComponent} from "./honor-code-popup.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {NgIf} from "@angular/common";

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
    NgIf,
  ],
  declarations: [HonorCodePopupComponent]
})
export class HonorCodePopupModule {
}
