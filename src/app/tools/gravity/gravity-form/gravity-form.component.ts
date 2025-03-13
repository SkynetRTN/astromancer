import {Component} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";

import {InterfaceService} from "./gravity-interface.service";

import {InputSliderValue} from "../../shared/interface/input-slider/input-slider.component";
import { SpectogramService } from '../gravity-spectogram/gravity-spectogram.service';

@Component({
  selector: 'app-gravity-form',
  templateUrl: './gravity-form.component.html',
  styleUrls: ['./gravity-form.component.scss']
})
export class GravityFormComponent {
  formGroup = new FormGroup({
    // mergerTime: new FormControl(16,
    //       [Validators.required, Validators.min(10), Validators.max(20)]),
    // totalMass: new FormControl(30,
    //       [Validators.required, Validators.min(25), Validators.max(250)]),
    // massRatio: new FormControl(30,
    //       [Validators.required, Validators.min(10), Validators.max(20)]),
    // phaseShift: new FormControl(30,
    //       [Validators.required, Validators.min(10), Validators.max(20)]),
    // distance: new FormControl(30,
    //       [Validators.required, Validators.min(10), Validators.max(20)]),
    // inclination: new FormControl(30,
    //       [Validators.required, Validators.min(10), Validators.max(20)]),
    
  })

  protected mergerTimeSubject : Subject<number> = new Subject<number>();
  protected totalMassSubject : Subject<number> = new Subject<number>();
  protected massRatioSubject : Subject<number> = new Subject<number>();
  protected phaseShiftSubject : Subject<number> = new Subject<number>();
  protected distanceSubject : Subject<number> = new Subject<number>();
  protected inclinationSubject : Subject<number> = new Subject<number>();

  constructor(
    private service: InterfaceService,
    private spectogramService: SpectogramService
  ) {
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
      default: console.log("Bad interface event: " + $event.key);
    }
  }
}


enum GravityModelParameters {
  MERGERTIME  = 'mergerTime',
  TOTALMASS   = 'totalMass',
  MASSRATIO   = 'massRatio',
  PHASESHIFT  = 'phaseShift',
  DISTANCE    = 'distance',
  INCLINATION = 'inclination',
}

