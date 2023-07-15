import {Injectable} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ClusterDataSourceStepper, ClusterDataSourceStepperImpl} from "./cluster-data-source.service.uti";

@Injectable()
export class ClusterDataSourceService implements ClusterDataSourceStepper {
  private readonly dataSourceStepperImpl: ClusterDataSourceStepper = new ClusterDataSourceStepperImpl();

  constructor() {
  }

  getFormControl(): FormControl {
    return this.dataSourceStepperImpl.getFormControl();
  }

  setFormControlStatus(isValid: boolean): void {
    this.dataSourceStepperImpl.setFormControlStatus(isValid);
  }

}
