import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PulsarService } from "../../pulsar.service";

@Component({
  selector: 'app-pulsar-light-curve-form',
  templateUrl: './pulsar-light-curve-form.component.html',
  styleUrls: ['./pulsar-light-curve-form.component.scss']
})
export class PulsarLightCurveFormComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private service: PulsarService) {
    // Initialize the form group with controls
    this.formGroup = this.fb.group({
      backScale: [3, Validators.required],
      // Add other controls as needed
    });
  }

  ngOnInit(): void {
    // Listen for changes in the 'backScale' control and update the service
    this.formGroup.get('backScale')?.valueChanges.subscribe(value => {
      this.service.setbackScale(value);
    });

    // Initialize with the default value on load
    const backScaleValue = this.formGroup.get('backScale')?.value;
    this.service.setbackScale(backScaleValue);
  }
}
