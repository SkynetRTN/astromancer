import { Component } from '@angular/core';
import {TableAction} from "../../shared/types/actions";

@Component({
  selector: 'app-variable-light-curve',
  templateUrl: './variable-light-curve.component.html',
  styleUrls: ['./variable-light-curve.component.scss']
})
export class VariableLightCurveComponent {

  actionHandler($event: TableAction[]) {

  }

  uploadHandler($event: File) {

  }
}
