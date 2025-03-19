import {Component, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {ChartAction} from "../../shared/types/actions";
import {HonorCodePopupService} from "../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../shared/honor-code-popup/honor-code-chart.service";
import {MyFileParser} from "../../shared/data/FileParser/FileParser";
import {auditTime, BehaviorSubject, debounce, debounceTime, Subject, takeUntil, throttleTime, withLatestFrom} from "rxjs";
import {fitValuesToGrid, ModelDataDict, SpectogramDataDict, StrainDataDict} from "../gravity.service.util";
import {FileType} from "../../shared/data/FileParser/FileParser.util";
import {MatDialog} from "@angular/material/dialog";
import { HttpClient } from '@angular/common/http';
import { StrainService } from '../gravity-strainchart/gravity-strain.service';
import { SpectogramService } from '../gravity-spectogram/gravity-spectogram.service';
import { InterfaceService } from '../gravity-form/gravity-interface.service';
import { UpdateSource } from '../../shared/data/utils';
import { environment } from 'src/environments/environment';
import { GravityDataService } from '../gravity-data.service';

@Component({
  selector: 'app-gravity',
  templateUrl: './gravity.component.html',
  styleUrls: ['./gravity.component.scss', "../../shared/interface/tools.scss"]
})
export class GravityComponent implements OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  fileUploaded: Boolean = false;

  // private fileParser: MyFileParser;

  constructor(
    private dataService: GravityDataService,
    private http: HttpClient) {

    dataService.fileUpload$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((v: boolean) => {
      this.fileUploaded = v
      console.log(v)
    })

  }

  actionHandler($action: any) {

  }

  uploadHandler($event: File) {
    this.dataService.uploadHandler($event)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}