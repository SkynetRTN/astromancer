import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {MoonService} from "../moon.service";
import {InputSliderValue} from "../../shared/interface/input-slider/input-slider.component";

import {UpdateSource} from "../../shared/data/utils";

@Component({
  selector: 'app-moon-form',
  templateUrl: './moon-form.component.html',
  styleUrls: ['./moon-form.component.scss'],
})
export class MoonFormComponent implements AfterViewInit, OnDestroy {
  formGroup = new FormGroup({
    amplitude: new FormControl(30,
      [Validators.required, Validators.min(1), Validators.max(750)],
    ),
  })
  protected amplitudeSubject: Subject<number> = new Subject<number>();
  protected periodSubject: Subject<number> = new Subject<number>();
  protected phaseSubject: Subject<number> = new Subject<number>();
  protected tiltSubject: Subject<number> = new Subject<number>();
  private destroy$ = new Subject<void>();

  constructor(private service: MoonService) {
  }

  onChange($event: InputSliderValue) {
    if ($event.key === MoonModelParameters.AMPLITUDE) {
      this.service.setAmplitude($event.value);
    } else if ($event.key === MoonModelParameters.PERIOD) {
      this.service.setPeriod($event.value);
    } else if ($event.key === MoonModelParameters.PHASE) {
      this.service.setPhase($event.value);
    } else if ($event.key === MoonModelParameters.TILT) {
      this.service.setTilt($event.value);
    }
  }

  ngAfterViewInit(): void {
    this.amplitudeSubject.next(this.service.getAmplitude());
    this.periodSubject.next(this.service.getPeriod());
    this.phaseSubject.next(this.service.getPhase());
    this.tiltSubject.next(this.service.getTilt());

    this.service.interface$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      (source: UpdateSource) => {
        if (source !== UpdateSource.INTERFACE) {
          this.amplitudeSubject.next(this.service.getAmplitude());
          this.periodSubject.next(this.service.getPeriod());
          this.phaseSubject.next(this.service.getPhase());
          this.tiltSubject.next(this.service.getTilt());
        }
      }
    )
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


enum MoonModelParameters {
  AMPLITUDE = 'amplitude',
  PERIOD = 'period',
  PHASE = 'phase',
  TILT = 'tilt',
}

