import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-moon-form',
  templateUrl: './moon-form.component.html',
  styleUrls: ['./moon-form.component.scss'],
})
export class MoonFormComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  formGroup = new FormGroup({
    amplitude: new FormControl(30,
      [Validators.required, Validators.min(1), Validators.max(750)],
    ),
  })

  constructor() {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onChange($event: any) {
    console.log($event);
  }
}
