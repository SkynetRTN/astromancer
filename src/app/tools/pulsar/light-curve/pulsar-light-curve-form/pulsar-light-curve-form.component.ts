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
  dataOptions: { label: string; value: string }[] = [];

  constructor(private fb: FormBuilder, private pulsarService: PulsarService) {
    this.dataOptions = [
      { label: 'Raw', value: 'raw' },
      { label: 'Subtracted', value: 'subtracted' }
    ];

    this.formGroup = this.fb.group({
      backScale: [3, Validators.required],
      dataOptions: ['raw', Validators.required]
    });
  }

  ngOnInit(): void {
    // Subscribe to value changes of the backScale form control
    this.formGroup.get('backScale')?.valueChanges.subscribe(value => {
      this.onBackScaleChange(value);
    });
    this.formGroup.get('dataOptions')?.valueChanges.subscribe(value => {
      this.onDataOptionsChange(value);
    });
  }
  
  onBackScaleChange(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      let chartData = this.pulsarService.getRawData();

      // Extract data for processing
      const jd = chartData.map(item => item.jd ?? 0);
      const source1 = chartData.map(item => item.source1 ?? 0);
      const source2 = chartData.map(item => item.source2 ?? 0);

      if (typeof value !== 'number' || isNaN(value) || value <= 2.2 * ((Math.max(...jd) - Math.min(...jd)) / source1.length)) return;
      // Apply background subtraction based on the provided backScale
      const subtractedSource1 = this.pulsarService.backgroundSubtraction(jd, source1, value);
      const subtractedSource2 = this.pulsarService.backgroundSubtraction(jd, source2, value);
    
      // Update chart data with background-subtracted values
      chartData = chartData.map((item, index) => ({
        jd: jd[index],
        source1: subtractedSource1[index],
        source2: subtractedSource2[index],
      }));
      
      // Set updated data back to the service
      this.pulsarService.setData(chartData);
      }
    }

  onDataOptionsChange(value: string): void{
    this.pulsarService.setTableType(value);
  }
  }
