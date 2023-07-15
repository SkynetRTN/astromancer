import {FormControl} from "@angular/forms";

export interface ClusterDataSourceStepper {
  getFormControl(): FormControl;

  setFormControlStatus(isValid: boolean): void;
}


export class ClusterDataSourceStepperImpl implements ClusterDataSourceStepper {
  private readonly formControl: FormControl;

  constructor() {
    this.formControl = new FormControl({});
    this.setFormControlStatus(false);
  }

  getFormControl(): FormControl {
    return this.formControl;
  }

  setFormControlStatus(isValid: boolean): void {
    if (isValid) {
      this.formControl.setErrors(null);
    } else {
      this.formControl.setErrors({'isValid': false});
    }
  }
}
