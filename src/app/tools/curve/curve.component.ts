import {Component,} from '@angular/core';
import {CurveDataService} from "../../service/curve-data.service";
import {TableAction} from "../shared/types/actions";
import {CurveService} from "../../service/curve.service";

/**
 * Curve Component
 */
@Component({
  selector: 'app-curve',
  templateUrl: './curve.component.html',
  styleUrls: ['./curve.component.scss'],
  providers: [CurveDataService],
})
export class CurveComponent {
  constructor(private service: CurveService) {
  }

  actionHandler(actions: TableAction[]) {
    actions.forEach((action) => {
      if (action.action === "addRow")
        this.service.getTable().alter("insert_row_below");
    })
  }
}

