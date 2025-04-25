import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subject, takeUntil, debounceTime, withLatestFrom, distinct} from "rxjs";
import { HttpClient } from '@angular/common/http';

import { Job, JobType, JobStatus } from 'src/app/shared/job/job';
import { GravityStorageService } from './storage/gravity-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../shared/error-popup/error.component';

@Injectable()
export class GravityDataService implements OnDestroy {

    private destroy$: Subject<void> = new Subject<void>();

    private jobIdSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
    public jobId$ = this.jobIdSubject.asObservable()

    private jobProgressSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public jobProgress$ = this.jobProgressSubject.asObservable()

    private dataStatusSubject: BehaviorSubject<string> = new BehaviorSubject<string>("Loading...");
    public dataStatus$ = this.dataStatusSubject.asObservable()
    
    constructor(
        // private dataSourceService: GravityDataSourceService,
        private storageService:  GravityStorageService,
        private http: HttpClient,
        private dialog: MatDialog) 
    {
        this.init() 
    }

    public reset() {
        this.storageService.resetDataSource();
        this.jobProgressSubject.next(0)
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

        this.dataStatusSubject.next("Sending Data For Processing...")
        gravJob.createJob(payload)
    }

    selectionHandler(name: string, detector: string) {
        let gravJob = new Job("/gravity/event" , JobType.PROCESS_GRAVITY_DATA, this.http, 500);
        let payload = {name: name, detector: detector}

        this.jobBuilder(gravJob)

        this.dataStatusSubject.next("Fetching Gravity Data...")
        gravJob.createJob(payload)
    }

    jobBuilder(gravJob: Job) {
        this.jobProgressSubject.next(1)
        
        gravJob.statusUpdate$.pipe(
        takeUntil(this.destroy$),
        takeUntil(gravJob.complete$),
        distinct()
        ).subscribe(
        (status: JobStatus) => {

            //This feels like it would fit better in dataSourceSubject...
            switch(status)
            {
                case JobStatus.FAILED: this.jobProgressSubject.next(0); break;
                case JobStatus.PENDING: this.dataStatusSubject.next("Waiting For Processing..."); break;
                case JobStatus.RUNNING: this.dataStatusSubject.next("Processing Data..."); break;
                case JobStatus.COMPLETED: this.dataStatusSubject.next("Retrieving Data..."); break;
                default: break;
            }
        });

        gravJob.progressUpdate$.pipe(
        takeUntil(this.destroy$),
        takeUntil(gravJob.complete$)
        ).subscribe(
        (progress: any) => {
            console.log("Job Progress: " + progress)
            this.jobProgressSubject.next(progress)
        });
        
        gravJob.complete$.pipe(
        takeUntil(this.destroy$),
        ).subscribe(
        (complete) => {

            if(!complete)
            {    
                this.jobProgressSubject.next(0)
                let error = gravJob.getError()
                this.dialog.open(ErrorComponent, {data: {error: error, title: "Data not found", message: error?.error['error']}})
                
                return;
            }

            console.log("Job complete")

            let id = gravJob.getJobId()
            if(id)
            {
                console.log(id)
                this.jobIdSubject.next(id)
                this.storageService.setJob(gravJob.getStorageObject())
            }
            
            this.jobProgressSubject.next(100)
        });
    }
}