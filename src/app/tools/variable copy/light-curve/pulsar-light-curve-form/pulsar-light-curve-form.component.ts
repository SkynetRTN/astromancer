import {Component, OnDestroy} from '@angular/core';
import {PulsarLightCurveOptions} from "../../pulsar.service.util";
import {Subject} from "rxjs";
import {PulsarService} from "../../pulsar.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-pulsar-light-curve-form',
  templateUrl: './pulsar-light-curve-form.component.html',
  styleUrls: ['./pulsar-light-curve-form.component.scss']
})
export class PulsarLightCurveFormComponent implements OnDestroy {
  formGroup: FormGroup;
  pulsarStarKeys = Object.values(PulsarLightCurveOptions);
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private service: PulsarService) {
    this.formGroup = new FormGroup({
      refStarMag: new FormControl(this.service.getReferenceStarMagnitude(),
        [Validators.required]),
    });
    this.formGroup.controls['backScale'].markAllAsTouched();

    this.formGroup.valueChanges.subscribe(() => {
      this.service.setReferenceStarMagnitude(
        parseFloat(this.formGroup.controls['backScale'].value));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
