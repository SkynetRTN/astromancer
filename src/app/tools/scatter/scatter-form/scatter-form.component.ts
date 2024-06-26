import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {InputSliderValue} from "../../shared/interface/input-slider/input-slider.component";
import {ScatterService} from "../scatter.service";

import {UpdateSource} from "../../shared/data/utils";

@Component({
  selector: 'app-scatter-form',
  templateUrl: './scatter-form.component.html',
  styleUrls: ['./scatter-form.component.scss']
})
export class ScatterFormComponent implements AfterViewInit, OnDestroy {
  protected distanceSubject: Subject<number> = new Subject<number>();
  protected diameterSubject: Subject<number> = new Subject<number>();
  private destroy$ = new Subject<void>();

  constructor(private service: ScatterService) {
  }

  ngAfterViewInit() {
    this.distanceSubject.next(this.service.getDistance());
    this.diameterSubject.next(this.service.getDiameter());

    this.service.interface$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      (source: UpdateSource) => {
        if (source !== UpdateSource.INTERFACE) {
          this.distanceSubject.next(this.service.getDistance());
          this.diameterSubject.next(this.service.getDiameter());
        }
      }
    )
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onChange($event: InputSliderValue) {
    if ($event.key === ScatterModelParameters.DISTANCE) {
      this.service.setDistance(parseFloat($event.value));
    } else if ($event.key === ScatterModelParameters.DIAMETER) {
      this.service.setDiameter(parseFloat($event.value));
    }
  }
}

enum ScatterModelParameters {
  DISTANCE = "distance",
  DIAMETER = "diameter",
}
