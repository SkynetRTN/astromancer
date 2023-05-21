import {Component} from '@angular/core';
import {CurveCounts} from "../../../model/curve.model";
import {FormControl} from "@angular/forms";
import {CurveService} from "../curve.service";

/**
 * Type for passing/parsing number of curve to be plotted to the @LineFormComponent
 */

/**
 * Data form for the {@link CurveComponent}
 *
 * Contains one selector for number of curves; and a toggle button for magnitude to flip Y axis.
 */
@Component({
  selector: 'app-line-form',
  templateUrl: './line-form.component.html',
  styleUrls: ['./line-form.component.scss'],
})
export class LineFormComponent {
  curveCounts = {
    [CurveCounts.ONE]: CurveCounts.ONE,
    [CurveCounts.TWO]: CurveCounts.TWO,
    [CurveCounts.THREE]: CurveCounts.THREE,
    [CurveCounts.FOUR]: CurveCounts.FOUR,
  };

  curveCountsKeys = Object.values(this.curveCounts);

  form = new FormControl(CurveCounts.ONE);

  constructor(private dataService: CurveService) {
  }

  onCurveNumChange() {
    // @ts-ignore
    this.dataService.setCurveCount(this.form.value);
  };

  onMagnitude(value: boolean) {
    this.dataService.setMagnitudeOn(value);
  }
}
