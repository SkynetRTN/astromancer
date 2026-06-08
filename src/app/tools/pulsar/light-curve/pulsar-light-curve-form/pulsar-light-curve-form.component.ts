import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import { PulsarService } from "../../pulsar.service";

@Component({
  selector: 'app-pulsar-light-curve-form',
  templateUrl: './pulsar-light-curve-form.component.html',
  styleUrls: ['./pulsar-light-curve-form.component.scss']
})
export class PulsarLightCurveFormComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  dataOptions: { label: string; value: string }[] = [];
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private pulsarService: PulsarService) {
    this.dataOptions = [
      { label: 'Raw', value: 'raw' },
      { label: 'Subtracted', value: 'subtracted' }
    ];
    this.formGroup = this.fb.group({
      backScale: [this.pulsarService.getbackScale(), Validators.required],
      dataOptions: [this.pulsarService.getTableType(), Validators.required]
    });
  }

  ngOnInit(): void {
    // Subscribe to value changes of the backScale form control
    this.formGroup.get('backScale')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.onBackScaleChange(value);
      });
    this.formGroup.get('dataOptions')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.onDataOptionsChange(value);
      });

    // Reflect service-side backScale changes (e.g. file upload resetting to
    // the default of 3) in the form input. emitEvent: false prevents this
    // from re-firing onBackScaleChange, which would try to re-run
    // background subtraction on the in-progress upload data.
    this.pulsarService.backScale$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const control = this.formGroup.get('backScale');
        if (control && control.value !== value) {
          control.setValue(value, { emitEvent: false });
        }
      });

    // Same for table type — keeps the Raw/Subtracted dropdown in sync if
    // anything sets it programmatically.
    this.pulsarService.tableType$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const control = this.formGroup.get('dataOptions');
        if (control && control.value !== value) {
          control.setValue(value, { emitEvent: false });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onBackScaleChange(value: number): void {
    if (typeof value === 'number' && !isNaN(value)) {
      let chartData = this.pulsarService.getRawData();

      // Extract data for processing
      const jd = chartData.map(item => item.jd ?? 0);
      const source1 = chartData.map(item => item.source1 ?? 0);
      const source2 = chartData.map(item => item.source2 ?? 0);

      if (jd.length === 0) return;
      // Loop instead of Math.max/min(...jd) — spread overflows the stack on
      // multi-hundred-thousand-sample data files.
      let jdMin = jd[0], jdMax = jd[0];
      for (let i = 1; i < jd.length; i++) {
        if (jd[i] < jdMin) jdMin = jd[i];
        if (jd[i] > jdMax) jdMax = jd[i];
      }
      if (typeof value !== 'number' || isNaN(value) || value <= 2.2 * ((jdMax - jdMin) / source1.length)) return;
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
      this.pulsarService.setbackScale(value);
      }
    }

  onDataOptionsChange(value: string): void{
    this.pulsarService.setTableType(value);
  }
}
