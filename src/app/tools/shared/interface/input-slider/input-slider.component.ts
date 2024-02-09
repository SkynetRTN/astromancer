import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {FormControl, FormControlOptions, Validators} from "@angular/forms";
import {debounceTime, Subject, takeUntil, throttleTime} from "rxjs";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'my-input-slider',
  templateUrl: './input-slider.component.html',
  styleUrls: ['./input-slider.component.scss'],
})
export class InputSliderComponent implements OnDestroy, AfterViewInit {

  @Input() minValue!: number;
  @Input() maxValue!: number;
  @Input() defaultValue!: number;
  @Input() step!: number;
  @Input() stepValue: number = 0.01;
  @Input() isLog: boolean = false;
  @Input() numOverride: boolean = false;
  @Input() name!: string;
  @Input() label!: string;
  @Input() value$!: Subject<number>;
  @Input() inputPrecision: number = 2;
  @Input() hintText: string | null = null;
  @Output() value: EventEmitter<InputSliderValue> = new EventEmitter<InputSliderValue>();


  @ViewChild("input") inputChild!: MatInput;
  protected sliderSubject: Subject<any> = new Subject<any>();
  protected readonly SliderUtil = SliderUtil;
  protected formControl!: FormControl;
  private slider$ = this.sliderSubject.asObservable();
  private destroy$ = new Subject<void>();
  private validators: Validators[] = [Validators.min(this.minValue), Validators.max(this.maxValue), Validators.required];

  constructor() {
    this.formControl = new FormControl(this.defaultValue, this.validators as FormControlOptions);
  }

  ngAfterViewInit(): void {
    this.validators = this.numOverride ? [Validators.required] : this.validators;
    this.formControl = new FormControl(this.defaultValue, this.validators as FormControlOptions);
    this.formControl.statusChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(this.numOverride ? 0 : 2000)
    ).subscribe(
      (status) => {
        if (status === "INVALID") {
          if (!this.numOverride) {
            if (this.formControl.hasError('min')) {
              this.formControl.setValue(this.minValue);
            } else if (this.formControl.hasError('max')) {
              this.formControl.setValue(this.maxValue);
            }
          }
        }
      }
    )
    this.formControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      throttleTime(25, undefined, {leading: false, trailing: true}),
    ).subscribe(
      (value) => {
        this.valueChange(value);
      });
    this.slider$.pipe(
      takeUntil(this.destroy$),
      throttleTime(25, undefined, {leading: false, trailing: true}),
    ).subscribe(
      (value) => {
        this.formControl.setValue(value);
        this.valueChange(this.formControl.value);
      });
    this.value$?.pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      (value) => {
        this.formControl.setValue(value, {emitEvent: false});
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  valueChange(value: any) {
    this.value.emit({key: this.name, value: value});
  }
}

export interface InputSliderValue {
  key: string;
  value: any;
}

class SliderUtil {
  public static inputToSlider(input: string | number, isLog: boolean) {
    const value = typeof input === 'number' ? input : parseFloat(input);
    if (isLog) {
      return Math.log(value);
    } else {
      return value;
    }
  }

  public static sliderToInput($event: Event, isLog: boolean, precision: number) {
    const slider = parseFloat(($event.target as HTMLInputElement).value);
    if (isLog) {
      return String(SliderUtil.myRound(Math.exp(slider), precision));
    } else {
      return String(SliderUtil.myRound(slider, precision));
    }
  }

  public static getSliderMin(min: string | number, isLog: boolean) {
    const minNum = typeof min === 'number' ? min : parseFloat(min);
    return SliderUtil.inputToSlider(minNum, isLog);
  }

  public static getSliderMax(max: string | number, isLog: boolean) {
    const maxNum = typeof max === 'number' ? max : parseFloat(max);
    return SliderUtil.inputToSlider(maxNum, isLog);
  }

  public static getSliderStep(min: string | number, max: string | number, step: number | string, isLog: boolean): number {
    const minNum = typeof min === 'number' ? min : parseFloat(min);
    const maxNum = typeof max === 'number' ? max : parseFloat(max);
    const stepNum = typeof step === 'number' ? step : parseFloat(step);
    if (!isLog) {
      return stepNum;
    } else {
      return (Math.log(maxNum) - Math.log(minNum)) / ((maxNum - minNum) / stepNum)
    }
  }

  private static myRound(value: number, precision: number) {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
  }
}
