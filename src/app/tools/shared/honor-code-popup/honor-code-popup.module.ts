import {NgModule} from "@angular/core";
import {HonorCodePopupComponent} from "./honor-code-popup.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";

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
