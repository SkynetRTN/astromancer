import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subject, takeUntil, debounceTime, withLatestFrom} from "rxjs";
import * as Highcharts from "highcharts";
import { environment } from 'src/environments/environment';

import {
  fitValuesToGrid
} from "./param-matching/gravity.service.util";

import { StrainService } from './param-matching/gravity-strainchart/gravity-strain.service';
import { SpectogramService } from './param-matching/gravity-spectogram/gravity-spectogram.service';
import { InterfaceService } from './param-matching/gravity-form/gravity-interface.service';
import { HttpClient } from '@angular/common/http';

import { UpdateSource } from '../shared/data/utils';

import { Job, JobType, JobStatus } from 'src/app/shared/job/job';
import { MyFileParser } from '../shared/data/FileParser/FileParser';
import {FileType} from "../shared/data/FileParser/FileParser.util";
import { GravityDataSourceService } from './data-source/gravity-data-source-service';
import { GravityStorageService } from './storage/gravity-storage.service';

@Injectable()
export class GravityDataService implements OnDestroy {

    private destroy$: Subject<void> = new Subject<void>();

    private jobIdSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
    public jobId$ = this.jobIdSubject.asObservable()

    private dataReadySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public dataReady$ = this.dataReadySubject.asObservable()

    // This represents our server side data
    private gravJob: Job;
    
    constructor(
        // private dataSourceService: GravityDataSourceService,
        private storageService:  GravityStorageService,
        private http: HttpClient,) 
    {

        this.gravJob = new Job('/gravity/file', JobType.PROCESS_GRAVITY_DATA, this.http, 500);

        this.gravJob.statusUpdate$.pipe(
        takeUntil(this.destroy$),
        takeUntil(this.gravJob.complete$)
        ).subscribe(
        (status: JobStatus) => {
            // if(status == )
            // alert("error " + error);
        });

        this.gravJob.progressUpdate$.pipe(
        takeUntil(this.destroy$),
        takeUntil(this.gravJob.complete$)
        ).subscribe(
        (progress: any) => {
        console.log(progress);
        });
        
        this.gravJob.complete$.pipe(
        takeUntil(this.destroy$),
        ).subscribe(
        (complete) => {

            if(!complete)
                //do error handling
                return;

            console.log("Job complete")

            let id = this.gravJob.getJobId()
            if(id)
            {
                console.log(id)
                this.jobIdSubject.next(id)
            }
            
            this.dataReadySubject.next(true)

        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    uploadHandler($event: File, gps_time?: number) {
        console.log("Upload")
        let payload = new FormData()
        payload.append('file', $event as File, 'file')
        if(gps_time) payload.append('time', gps_time.toString())

        this.gravJob.createJob(payload);
    }

    public reset() {
        this.storageService.resetDataSource();
        this.dataReadySubject.next(false);
    }
}