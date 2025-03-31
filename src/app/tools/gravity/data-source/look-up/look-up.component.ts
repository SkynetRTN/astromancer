import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import { GravityDataSourceService } from '../gravity-data-source-service';
import { dateToGPS, GravityEvent, SearchParams } from '../gravity-data-source.service.utils';

@Component({
  selector: 'app-look-up',
  templateUrl: './look-up.component.html',
  styleUrls: ['./look-up.component.scss']
})
export class LookUpComponent {
  value = '';
  lookUpForm = new FormGroup({
    min_date: new FormControl<Date>(new Date(2015,9,14)),
    max_date: new FormControl<Date>(new Date()),
  })

  events: GravityEvent[] = [];

  constructor(private dataSourceService: GravityDataSourceService,
              private dialog: MatDialog) 
  {
    dataSourceService.results$.subscribe((events) => {
      this.events = events;
    })
  }

  submit() {
    let params: SearchParams = {
      min_time: this.lookUpForm.controls['min_date'].value ? dateToGPS(this.lookUpForm.controls['min_date'].value) : undefined,
      max_time: this.lookUpForm.controls['max_date'].value ? dateToGPS(this.lookUpForm.controls['max_date'].value) : undefined,
    }

    this.dataSourceService.submitSearchParams(params)
  }

  selectEvent(event_url: string, detector: string)
  {
    this.dataSourceService.selectFileVersion(event_url, detector)
  }
}
