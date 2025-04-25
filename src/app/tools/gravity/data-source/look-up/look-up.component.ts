import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import { GravityDataSourceService } from '../gravity-data-source-service';
import { dateToGPS, GravityEvent, Pagination, SearchParams } from '../gravity-data-source.service.utils';
import { DatasetController } from 'chart.js';

@Component({
  selector: 'app-look-up',
  templateUrl: './look-up.component.html',
  styleUrls: ['./look-up.component.scss']
})
export class LookUpComponent {
  value = '';
  lookUpForm = new FormGroup({
    min_date: new FormControl<Date>(new Date(2015,8,13)),
    max_date: new FormControl<Date>(new Date()),
  })

  events: GravityEvent[] = [];

  pagination: Pagination = {
    total_items: 0,
    page_length: 20}

  constructor(private dataSourceService: GravityDataSourceService,
              private dialog: MatDialog) 
  {
    dataSourceService.results$.subscribe((events) => {
      this.events = events;
    })

    dataSourceService.pagination$.subscribe((page) => {
      this.pagination = page
    })
  }

  submit() {
    let params: SearchParams = {
      min_time: this.lookUpForm.controls['min_date'].value ? dateToGPS(this.lookUpForm.controls['min_date'].value) : undefined,
      max_time: this.lookUpForm.controls['max_date'].value ? dateToGPS(this.lookUpForm.controls['max_date'].value) : undefined,
    }

    this.dataSourceService.submitSearchParams(params)
  }

  selectEvent(name: string, detector: string)
  {
    this.dataSourceService.selectFileVersion(name, detector)
  }

  selectPage(index: number)
  {
    this.dataSourceService.setPage(index)
  }
}
