import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject, takeUntil} from "rxjs";
import { Job, JobType } from 'src/app/shared/job/job';

@Injectable()
export class GravityDataService {

    
    constructor(
        private http: HttpClient) {
        this.initValues();
    }

    public getGravityData() : Job{        
        const gravityJob = new Job('/gravity/', JobType.FETCH_CATALOG, this.http, 500);
        let payload: any = {

        }
        gravityJob.createJob(payload);

        //While waiting
        gravityJob.update$.pipe(
            takeUntil(gravityJob.complete$)
        ).subscribe((job) => {
            
        });

        //When done
        gravityJob.complete$.subscribe(
            (complete) => {
                if (complete) {
                    
                }
            });
        return gravityJob;
    }

    private initValues() {

    }
}