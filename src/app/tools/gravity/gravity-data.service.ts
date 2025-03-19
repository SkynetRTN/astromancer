import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subject, takeUntil, debounceTime, withLatestFrom} from "rxjs";
import * as Highcharts from "highcharts";
import { environment } from 'src/environments/environment';

import {
  fitValuesToGrid
} from "./gravity.service.util";

import { StrainService } from './gravity-strainchart/gravity-strain.service';
import { SpectogramService } from './gravity-spectogram/gravity-spectogram.service';
import { InterfaceService } from './gravity-form/gravity-interface.service';
import { HttpClient } from '@angular/common/http';

import { UpdateSource } from './../shared/data/utils';

import { Job, JobType, JobStatus } from 'src/app/shared/job/job';
import { MyFileParser } from '../shared/data/FileParser/FileParser';
import {FileType} from "./../shared/data/FileParser/FileParser.util";

@Injectable()
export class GravityDataService implements OnDestroy {

    private destroy$: Subject<void> = new Subject<void>();
    
    private fileUploadSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
    public fileUpload$ = this.fileUploadSubject.asObservable();

    // This represents our server side data
    private gravJob: Job;
    
    constructor(
        private strainService: StrainService,
        private spectogramService: SpectogramService,
        private interfaceService: InterfaceService,
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

            this.fetchSpectogram()
            this.fileUploadSubject.next(true)

            // const spectogramResult: number[][] = [];

            // let strain = data[0]
            // let spectogram: number[][] = data[1].data
            // let axes = data[1].axes

            // console.log("Spectogram points: ", spectogram.length * spectogram[0].length)
            // console.log("Strain points: ", strain.length)

            // let xmin = parseFloat(axes.x[0])
            // let xmax = parseFloat(axes.x[1])
            // let dx   = parseFloat(axes.x[2])
            // let ymin = axes.y[0]
            // let ymax = axes.y[1]

            // this.spectogramService.setAxes({'dx': dx, 'xmin': xmin, 'xmax': xmax, 'ymin': ymin, 'ymax': ymax})
            // this.strainService.setAxes({'xmin': xmin, 'xmax': xmax})
            // this.interfaceService.setMergerRange({'min':xmin, 'max': xmax})

            // // strain.map((p: number[]) => {
            // //   strainResult.push({Time: p[0], Strain: p[1]})
            // // })
            // // this.strainService.setData(strain);


            // spectogram.forEach( (y, i) => y.forEach( (value, j) => {
            // // if(x==null || y==null) return 
            // spectogramResult.push([i*dx + xmin , j, value?value:0 ])
            // } ) )
            // this.spectogramService.setSpecto(spectogramResult)
            
            // this.fileUploadSubject.next(true)
        });
        
        //TODO: replace debounceTime with audit, and an observable that emits when the models are retrieved.
        this.interfaceService.serverParameters$.pipe(
        takeUntil(this.destroy$),

        // TEMPORARY.
        withLatestFrom(this.fileUploadSubject),

        debounceTime(60)
        ).subscribe(
        ([source, file]) => {
            console.log("Server param update")

            //don't make a request before the user has a chance to fiddle with the interface
            // if(source==UpdateSource.INIT) return;
    
                this.fetchModels(this.interfaceService.getTotalMass(),
                            this.interfaceService.getMassRatio(),
                            this.interfaceService.getPhaseShift())

            if(file)
            {
                this.fetchStrain(this.interfaceService.getTotalMass(),
                                this.interfaceService.getMassRatio(),
                                this.interfaceService.getPhaseShift())
            }
        }
        )

    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    uploadHandler($event: File) {
        console.log("Upload")
        let payload = new FormData()
        payload.append('file', $event as File, 'file')
        this.gravJob.createJob(payload);

    }

    private fetchModels(totalMass: number, massRatio: number, phase: number) {
      
        let time = performance.now()
    
        phase = (phase * Math.PI)/180
    
        let payload = fitValuesToGrid(totalMass,massRatio,phase)
    
        let freqMassError = totalMass/payload['total_mass_freq']
    
        this.http.get(
          `${environment.apiUrl}/gravity/model`,
            {'params': payload}).subscribe(
              (resp: any) => {
                // let strainModel: StrainDataDict[] = []
                let freqModel: number[][] = []
                
                let temp = time
                time = performance.now()
                console.log("Model Retrieved in ", (time - temp), " Milliseconds")
    
                resp.frequency.forEach((p: number[]) => {
                  if(p[0] != null && p[1] != null)
                  {
                    freqModel.push([p[0]*freqMassError, p[1]/freqMassError])
                  }
                })
                console.log(freqModel.length)
    
                // resp.strain.forEach((p: number[]) => {
                //   if(p[0] != null && p[1] != null)
                //   {
                //     strainModel.push({ 'Time': p[0], 'Strain': p[1]})
                //   }
                // })
                // console.log(strainModel.length)
    
                // strainModel.sort((a,b) =>  +(a.Time as number) - +(b.Time as number))
    
                 //Calling these functions causes subscription updates.
                 //VERY Slow. Debouncing allows them to run async at least
                this.spectogramService.setModelData(freqModel)
                this.strainService.setModelData(resp.strain)
              }
            )
    }

    //The strain wave is bandpassed and normalized based on the model params
    private fetchStrain(totalMass: number, massRatio: number, phase: number) {

        let id = this.gravJob.getJobId()
        if(id == null) return;

        phase = (phase * Math.PI)/180
    
        let payload = fitValuesToGrid(totalMass,massRatio,phase)
        payload['id'] = id;
    
        let freqMassError = totalMass/payload["total_mass_freq"]

        this.http.get(
            `${environment.apiUrl}/gravity/strain`,
              {'params': payload}).subscribe(
                (resp: any) => {
                
                console.log(resp)
                this.strainService.setData(resp.file)
            })
    }

    private fetchSpectogram() {
        let id = this.gravJob.getJobId()
        if(id == null) return;

        this.http.get(`${environment.apiUrl}/gravity/spectogram`,
        {params: {'id': id} }).subscribe(
        (resp: any) => {

            console.log(resp)

            const spectogramResult: number[][] = [];

            let spectogram: number[][] = resp.file.data
            let axes = resp.file.axes

            console.log("Spectogram points: ", spectogram.length * spectogram[0].length)

            let xmin = parseFloat(axes.x[0])
            let xmax = parseFloat(axes.x[1])
            let dx   = parseFloat(axes.x[2])
            let ymin = axes.y[0]
            let ymax = axes.y[1]

            this.spectogramService.setAxes({'dx': dx, 'xmin': xmin, 'xmax': xmax, 'ymin': ymin, 'ymax': ymax})
            this.strainService.setAxes({'xmin': xmin, 'xmax': xmax})
            this.interfaceService.setMergerRange({'min':xmin, 'max': xmax})

            spectogram.forEach( (y, i) => y.forEach( (value, j) => {
            // if(x==null || y==null) return 
            spectogramResult.push([i*dx + xmin , j, value?value:0 ])
            } ) )
            this.spectogramService.setSpecto(spectogramResult)
            
            this.fileUploadSubject.next(true)

        })
    }
}