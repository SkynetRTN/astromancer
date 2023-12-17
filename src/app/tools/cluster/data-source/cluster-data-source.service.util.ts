import {FormControl} from "@angular/forms";

export interface ClusterRawData {
  id: string;
  filter: string;
  calibrated_mag: string;
  mag_error: string;
  ra_hours: string;
  dec_degs: string;
}

export interface ClusterLookUpData {
  name: string;
  ra: number;
  dec: number;
  radius: number;
}

export interface ClusterLookUpStack {
  push(data: ClusterLookUpData): void;

  pop(): ClusterLookUpData;

  list(): ClusterLookUpData[];

  hasData(): boolean;

  clear(): void;
}

export class ClusterLookUpStackImpl implements ClusterLookUpStack {
  private data: ClusterLookUpData[] = []
  private maxDataSize: number;

  constructor(maxDataSize: number) {
    this.maxDataSize = maxDataSize;
  }

  list(): ClusterLookUpData[] {
    return this.data.reverse();
  }

  push(data: ClusterLookUpData): void {
    if (!this.nameList().includes(data.name)) {
      if (this.data.length >= this.maxDataSize) {
        this.data = this.data.slice(1, this.data.length);
      }
      this.data.push(data);
    } else {
      this.data = this.data.filter(d => d.name !== data.name);
      this.data.push(data);
    }
  }

  hasData(): boolean {
    return this.data.length > 0;
  }

  pop(): ClusterLookUpData {
    if (this.hasData())
      return this.data.pop()!;
    else
      throw new Error('No data in stack');
  }

  clear(): void {
    this.data = [];
  }

  private nameList(): string[] {
    return this.data.map(data => data.name);
  }
}

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
