import {Injectable} from '@angular/core';
import {HonorCodePopupComponent} from "./honor-code-popup.component";
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HonorCodePopupService {

  constructor(private dialog: MatDialog) {
  }

  honored(): Observable<string> {
    const modalRef = this.dialog.open(HonorCodePopupComponent,
      {width: '500px',});
    return modalRef.afterClosed();
  }
}
