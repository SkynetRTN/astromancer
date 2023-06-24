import {Injectable} from '@angular/core';
import {HonorCodePopupComponent} from "./honor-code-popup.component";
import {MatLegacyDialog as MatDialog} from "@angular/material/legacy-dialog";
import {Observable} from "rxjs";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Injectable()
export class HonorCodePopupService {
  private saveGraphButton!: MatButton;
  private saveGraphSpinner!: MatProgressSpinner;

  constructor(private dialog: MatDialog) {
  }

  public registerSaveGraphButton(button: MatButton): void {
    this.saveGraphButton = button;
  }

  public registerSaveGraphSpinner(spinner: MatProgressSpinner): void {
    this.saveGraphSpinner = spinner;
  }

  public disableSaveGraph(): void {
    this.saveGraphButton.disabled = true;
  }

  public enableSaveGraph(): void {
    this.saveGraphButton.disabled = false;
  }

  public honored(): Observable<string> {
    const modalRef = this.dialog.open(HonorCodePopupComponent,
      {width: '500px',});
    return modalRef.afterClosed();
  }
}
