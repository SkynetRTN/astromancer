import {Component,} from '@angular/core';
import {TableAction} from "../shared/types/actions";
import {CurveService} from "./curve.service";

/**
 * Curve Component
 */
@Component({
  selector: 'app-curve',
  templateUrl: './curve.component.html',
  styleUrls: ['./curve.component.scss'],
  providers: [CurveService],
})
export class CurveComponent {
  constructor(private service: CurveService) {
  }

  actionHandler(actions: TableAction[]) {
    actions.forEach((action) => {
      if (action.action === "addRow"){
        this.service.getTable().alter("insert_row_below");
      }
    })
  }
}

