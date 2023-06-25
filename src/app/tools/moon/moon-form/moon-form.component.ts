import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";

@Component({
  selector: 'app-moon-form',
  templateUrl: './moon-form.component.html',
  styleUrls: ['./moon-form.component.scss'],
})
export class MoonFormComponent implements OnDestroy {
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

  constructor() {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onChange($event: any) {
  }
}
