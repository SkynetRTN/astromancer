import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {PulsarService} from "../../pulsar.service";
import {FormControl, FormGroup, Validators, FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-pulsar-light-curve-form',
  templateUrl: './pulsar-light-curve-form.component.html',
  styleUrls: ['./pulsar-light-curve-form.component.scss']
})
export class PulsarLightCurveFormComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private pulsarService: PulsarService) {
    // Initialize the form group with controls
    this.formGroup = this.fb.group({
      backScale: [3, Validators.required],
      // Add other controls as needed
    });
  }



  ngOnInit(): void {
    // Subscribe to value changes of the backScale form control
    this.formGroup.get('backScale')?.valueChanges.subscribe(value => {
      this.onBackScaleChange(value);
    });
  }

  onBackScaleChange(value: number): void {
    // Call the function to handle the backScale change
    this.updateBackScale(value);
  }

  updateBackScale(value: number): void {
    // Update the backScale value in the service or perform any other necessary actions
    this.pulsarService.setbackScale(value);

  /*
    let currentData = this.pulsarService.getData();
    console.log("currentData", currentData);
    let channel1 = this.pulsarService.backgroundSubtraction(
      currentData.map(dataPoint => dataPoint.frequency).filter((freq): freq is number => freq !== null),
      currentData.map(dataPoint => dataPoint.channel1).filter((channel): channel is number => channel !== null),
      this.pulsarService.getbackScale()
    );
    let channel2 = this.pulsarService.backgroundSubtraction(
      currentData.map(dataPoint => dataPoint.frequency).filter((freq): freq is number => freq !== null),
      currentData.map(dataPoint => dataPoint.channel2).filter((channel): channel is number => channel !== null),
      this.pulsarService.getbackScale()
    );

    const combinedData = currentData.map((row, index) => ({
      frequency: row.frequency as number,
      channel1: channel1[index] as number,
      channel2: channel2[index] as number,
    }));

    console.log("here it is", combinedData);
*/
   // this.pulsarService.updateData(combinedData);
  }
}



