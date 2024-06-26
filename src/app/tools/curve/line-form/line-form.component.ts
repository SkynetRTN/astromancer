import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {CurveService} from "../curve.service";
import {CurveCounts} from "../curve.service.util";
import {MatLegacySlideToggle as MatSlideToggle} from "@angular/material/legacy-slide-toggle";
import {Subject, takeUntil} from 'rxjs';

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
export class LineFormComponent implements AfterViewInit, OnDestroy {
  curveCounts = {
    [CurveCounts.ONE]: CurveCounts.ONE,
    [CurveCounts.TWO]: CurveCounts.TWO,
    [CurveCounts.THREE]: CurveCounts.THREE,
    [CurveCounts.FOUR]: CurveCounts.FOUR,
  };
  curveCountsKeys = Object.values(this.curveCounts);
  form = new FormControl(CurveCounts.ONE);
  @ViewChild("magSlider") magSlider!: MatSlideToggle;
  magnitude: boolean = this.service.getIsMagnitudeOn();
  private destroy$: Subject<any> = new Subject<any>();

  constructor(private service: CurveService) {
    this.form.setValue(this.service.getCurveCount());
    this.magnitude = this.service.getIsMagnitudeOn();
  }

  onCurveNumChange() {
    // @ts-ignore
    this.service.setCurveCount(this.form.value);
  };

  onMagnitude(value: boolean) {
    this.service.setIsMagnitudeOn(value);
  }

  ngAfterViewInit(): void {
    this.service.interface$.pipe(takeUntil(this.destroy$)
    ).subscribe((curveInterface) => {
      this.form.setValue(curveInterface.getCurveCount());
      this.magSlider.checked = curveInterface.getIsMagnitudeOn();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }


}
