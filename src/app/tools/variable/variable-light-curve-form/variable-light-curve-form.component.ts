import {Component, OnDestroy} from '@angular/core';
import {VariableStarOptions} from "../variable.service.util";
import {Subject} from "rxjs";
import {VariableService} from "../variable.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-variable-light-curve-form',
  templateUrl: './variable-light-curve-form.component.html',
  styleUrls: ['./variable-light-curve-form.component.scss']
})
export class VariableLightCurveFormComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  formGroup: FormGroup;
  variableStarKeys = Object.values(VariableStarOptions);

  constructor(private service: VariableService) {
    this.formGroup = new FormGroup({
      variableStar: new FormControl(this.service.getVariableStar(),
        [Validators.required, Validators.pattern('^((?!None).)*$')]),
      refStarMag: new FormControl(this.service.getReferenceStarMagnitude(),
        [Validators.required]),});
    this.formGroup.controls['variableStar'].markAllAsTouched();
    this.formGroup.controls['refStarMag'].markAllAsTouched();

    this.formGroup.valueChanges.subscribe(() => {
      this.service.setVariableStar(this.formGroup.controls['variableStar'].value);
      this.service.setReferenceStarMagnitude(
        parseFloat(this.formGroup.controls['refStarMag'].value));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
