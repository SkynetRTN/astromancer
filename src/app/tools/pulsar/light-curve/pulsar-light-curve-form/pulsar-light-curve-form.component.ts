import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {FormControl, FormGroup, Validators, FormBuilder} from "@angular/forms";
import { PulsarService } from "../../pulsar.service";
import { on } from 'events';

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


  updateBackScale(value: number): void {
    if (value == null) {
      // Delay the execution of the code by 500 milliseconds if value is null
return; }
     else {
      // Update the backScale value in the service or perform any other necessary actions
      this.pulsarService.setbackScale(value);
    }
  }
    onBackScaleChange(value: number): void {

    let chartData = this.pulsarService.getCombinedData();
    
   // console.log("rawdata1", chartData);
  
    // Extract data for processing
    const jd = chartData.map(item => item.jd ?? 0);
    const source1 = chartData.map(item => item.source1 ?? 0);
    const source2 = chartData.map(item => item.source2 ?? 0);
  
    //console.log("rawdata1", source1);
  
    // Apply background subtraction based on the provided backScale
    const subtractedSource1 = this.pulsarService.backgroundSubtraction(jd, source1, value);
    const subtractedSource2 = this.pulsarService.backgroundSubtraction(jd, source2, value);
  
    // Update chart data with background-subtracted values
    chartData = chartData.map((item, index) => ({
      jd: jd[index],
      source1: subtractedSource1[index],
      source2: subtractedSource2[index],
    }));
    
    console.log(value, "new data", chartData);
    // Set updated data back to the service
    this.pulsarService.setData(chartData);
    }
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
