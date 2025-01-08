import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject, takeUntil} from "rxjs";
import { Job, JobType } from 'src/app/shared/job/job';
import {environment} from "../../../environments/environment";
import { GravityStorage } from './gravity.service.util';
import { JobStorageObject } from 'src/app/shared/job/job';

@Injectable()
export class GravityDataService {

      private uploadSubject: Subject<any> = new Subject<any>();
      public upload$ = this.uploadSubject.asObservable();
    
    constructor(
        private http: HttpClient) {
        this.initValues();
    }

    public processGravityData(file: File) : Job {        
        const gravityJob = new Job('/gravity/file', JobType.PROCESS_GRAVITY_DATA, this.http, 500);
        let payload = new FormData()
        payload.append('file', file as Blob, 'file')

        gravityJob.createJob(payload);

        //While waiting
        gravityJob.update$.pipe(
            takeUntil(gravityJob.complete$)
        ).subscribe((job) => {
            // this.gravityStorage.setJob(job.getStorageObject());
        });

        //When done
        gravityJob.complete$.subscribe(
            (complete) => {
                if (complete) {
                    this.getGravityDataProcessed(gravityJob.getJobId())
                }
            });
        return gravityJob;
    }

    public getGravityDataProcessed(id: number | null) {
        if (id !== null)
            this.http.get(`${environment.apiUrl}/gravity/file`,
                {params: {'id': id}}).subscribe(
                (resp: any) => {
                    this.uploadSubject.next(resp.file)
                }
            );
    }
    

    private initValues() {

    }
}