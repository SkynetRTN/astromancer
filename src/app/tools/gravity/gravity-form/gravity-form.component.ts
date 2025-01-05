import {Component} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";

import {GravityService} from "../gravity.service";

import {InputSliderValue} from "../../shared/interface/input-slider/input-slider.component";

@Component({
  selector: 'app-gravity-form',
  templateUrl: './gravity-form.component.html',
  styleUrls: ['./gravity-form.component.scss']
})
export class GravityFormComponent {
  formGroup = new FormGroup({
    mergerTime: new FormControl(30,
          [Validators.required, Validators.min(10), Validators.max(20)]),
  })

  protected mergerTimeSubject : Subject<number> = new Subject<number>();
  protected totalMassSubject : Subject<number> = new Subject<number>();
  protected massRatioSubject : Subject<number> = new Subject<number>();
  protected phaseShiftSubject : Subject<number> = new Subject<number>();
  protected distanceSubject : Subject<number> = new Subject<number>();
  protected inclinationSubject : Subject<number> = new Subject<number>();

  constructor(private service: GravityService) {
  }

  onChange($event: InputSliderValue) {
    switch($event.key)
    {
      case GravityModelParameters.MERGERTIME: this.service.setMergerTime($event.value); break;
      case GravityModelParameters.TOTALMASS: this.service.setTotalMass($event.value); break;
      case GravityModelParameters.MASSRATIO: this.service.setMassRatio($event.value); break;
      case GravityModelParameters.PHASESHIFT: this.service.setPhaseShift($event.value); break;
      case GravityModelParameters.DISTANCE: this.service.setDistance($event.value); break;
      case GravityModelParameters.INCLINATION: this.service.setInclination($event.value); break;
    }

  }
}


enum GravityModelParameters {
  MERGERTIME = 'mergertime',
  TOTALMASS = 'totalmass',
  MASSRATIO = 'massratio',
  PHASESHIFT = 'phaseshift',
  DISTANCE = 'distance',
  INCLINATION = 'inclination',
}

