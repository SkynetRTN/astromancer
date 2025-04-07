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
    
    constructor(
        // private dataSourceService: GravityDataSourceService,
        private storageService:  GravityStorageService,
        private http: HttpClient,) 
    {
        this.init() 
    }

    public reset() {
        this.storageService.resetDataSource();
        this.dataReadySubject.next(false)
        // this.initValues();
        // this.sourcesSubject.next(this.sources);
    }

    public init() {
        let cachedJob = this.storageService.getJob()
        if(cachedJob)
        {
            let jobCopy = new Job(cachedJob.url, cachedJob.type, this.http, cachedJob.updateInterval)

            this.jobBuilder(jobCopy)
            jobCopy.reincarnate(cachedJob)

            return
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    uploadHandler($event: File, gps_time?: number) {
        console.log("Upload")

        let gravJob = new Job("/gravity/file" , JobType.PROCESS_GRAVITY_DATA, this.http, 500);
        let payload = new FormData()
        payload.append('file', $event as File, 'file')
        if(gps_time) payload.append('time', gps_time.toString())

        this.jobBuilder(gravJob)
        gravJob.createJob(payload)
    }

    selectionHandler(name: string, detector: string) {
        let gravJob = new Job("/gravity/event" , JobType.PROCESS_GRAVITY_DATA, this.http, 500);
        let payload = {name: name, detector: detector}

        this.jobBuilder(gravJob) 
        gravJob.createJob(payload)
    }

    jobBuilder(gravJob: Job) {
        
        gravJob.statusUpdate$.pipe(
        takeUntil(this.destroy$),
        takeUntil(gravJob.complete$)
        ).subscribe(
        (status: JobStatus) => {
            if(status == JobStatus.FAILED) alert("error: failed to retrieve data.");
        });

        gravJob.progressUpdate$.pipe(
        takeUntil(this.destroy$),
        takeUntil(gravJob.complete$)
        ).subscribe(
        (progress: any) => {
        console.log(progress);
        });
        
        gravJob.complete$.pipe(
        takeUntil(this.destroy$),
        ).subscribe(
        (complete) => {

            if(!complete)
                //do error handling
                return;

            console.log("Job complete")

            let id = gravJob.getJobId()
            if(id)
            {
                console.log(id)
                this.jobIdSubject.next(id)
                this.storageService.setJob(gravJob.getStorageObject())
            }
            
            this.dataReadySubject.next(true)
        });
    }
}