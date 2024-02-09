import {Component, Inject} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss', '../cluster-data-source-pop-ups.scss']
})
export class ErrorComponent {
  protected readonly JSON = JSON;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { error: HttpErrorResponse }) {
  }

}
