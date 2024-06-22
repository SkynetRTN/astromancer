import { Component, OnDestroy } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {debounceTime, Subject, takeUntil} from "rxjs";
import {RcService} from "../rc.service";
import { 
  rfiSubPreset,
  surfaceModel,
  channel,
  spectrum, 
  gainCalibration,
  imageCoordinate,
  timeDelayOption } from '../rc.service.util';

@Component({
  selector: 'app-rc',
  templateUrl: './rc.component.html',
  styleUrls: ['./rc.component.scss', "../../shared/interface/tools.scss"]
})
export class RcComponent implements OnDestroy{
  RcForm!: FormGroup;
  private destroy$: Subject<any> = new Subject<any>();
  channels=Object.values(channel);
  spectrums=Object.values(spectrum);
  gCals=Object.values(gainCalibration);
  imgCoords=Object.values(imageCoordinate);
  tdls=Object.values(timeDelayOption);
  constructor(private service: RcService) {
    this.service.interfaceInfo$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(info => {
      this.RcForm = new FormGroup({
        name: new FormControl(this.service.getName(), [Validators.required]),
        
        channel: new FormControl(this.service.getChannel(), [Validators.required]),
        spectrum: new FormControl(this.service.getSpectrum(), [Validators.required]),
        gainCalibration: new FormControl(this.service.getGainCalibration(), [Validators.required]),
        imageCoordinate: new FormControl(this.service.getImageCoordinate(), [Validators.required]),
        timeDelayOption: new FormControl(this.service.getTimeDelayOption(), [Validators.required]),
        includeRawImage: new FormControl(this.service.getIncludeRawImage(), [Validators.required]),

        frequencyRangePreset: new FormControl(this.service.getFrequencyRangePreset(), [Validators.required]),
        minFrequency: new FormControl(this.service.getMinFrequency(), [Validators.required]),
        maxFrequency: new FormControl(this.service.getMaxFrequency(), [Validators.required]),
        skipFrequency: new FormControl(this.service.getSkipFrequency(), [Validators.required]),
        minFrequencySkip: new FormControl(this.service.getMinFrequencySkip(), [Validators.required]),
        maxFrequencySkip: new FormControl(this.service.getMaxFrequencySkip(), [Validators.required]),

        oneDBkgSub: new FormControl(this.service.getOneDBkgSub(), [Validators.required]),
        rfiSubPreset: new FormControl(this.service.getRfiSubPreset(), [Validators.required]),
        rfiSubScale: new FormControl(this.service.getRfiSubScale(), [Validators.required]),
        surfaceModel: new FormControl(this.service.getSurfaceModel(), [Validators.required]),
        surfaceModelScale: new FormControl(this.service.getSurfaceModelScale(), [Validators.required])
      })

      this.RcForm.controls['name'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(name => {
        this.service.setName(name);
      });

      this.RcForm.controls['channel'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(channel => {
        this.service.setChannel(channel);
      });

      this.RcForm.controls['spectrum'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(spectrum => {
        this.service.setSpectrum(spectrum);
      });

      this.RcForm.controls['gainCalibration'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(gainCalibration => {
        this.service.setGainCalibration(gainCalibration);
      });

      this.RcForm.controls['imageCoordinate'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(imageCoordinate => {
        this.service.setImageCoordinate(imageCoordinate);
      });

      this.RcForm.controls['timeDelayOption'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(timeDelayOption => {
        this.service.setTimeDelayOption(timeDelayOption);
      });

      this.RcForm.controls['includeRawImage'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(includeRawImage => {
        this.service.setIncludeRawImage(includeRawImage);
      });

      this.RcForm.controls['frequencyRangePreset'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(frequencyRangePreset => {
        this.service.setFrequencyRangePreset(frequencyRangePreset);
      });

      this.RcForm.controls['minFrequency'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(minFrequency => {
        this.service.setMinFrequency(minFrequency);
      });

      this.RcForm.controls['maxFrequency'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(maxFrequency => {
        this.service.setMaxFrequency(maxFrequency);
      });

      this.RcForm.controls['skipFrequency'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(skipFrequency => {
        this.service.setSkipFrequency(skipFrequency);
      });

      this.RcForm.controls['minFrequencySkip'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(minFrequencySkip => {
        this.service.setMinFrequencySkip(minFrequencySkip);
      });

      this.RcForm.controls['maxFrequencySkip'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(maxFrequencySkip => {
        this.service.setMaxFrequencySkip(maxFrequencySkip);
      });

      this.RcForm.controls['oneDBkgSub'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(oneDBkgSub => {
        this.service.setOneDBkgSub(oneDBkgSub);
      });

      this.RcForm.controls['rfiSubPreset'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(rfiSubPreset => {
        this.service.setRfiSubPreset(rfiSubPreset);
      });

      this.RcForm.controls['rfiSubScale'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(rfiSubScale => {
        this.service.setRfiSubScale(rfiSubScale);
      });

      this.RcForm.controls['surfaceModel'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(surfaceModel => {
        this.service.setSurfaceModel(surfaceModel);
      });

      this.RcForm.controls['surfaceModelScale'].valueChanges.pipe(
        debounceTime(200),
      ).subscribe(surfaceModelScale => {
        this.service.setSurfaceModelScale(surfaceModelScale);
      });
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  resetForm() {
    this.service.resetForm();
  }

  submitForm() {
    this.service.submitForm();
  }
}
