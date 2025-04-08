import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, interval, sample, Subject } from "rxjs";
import { Pagination, GravityEvent, SearchParams, Detector, dateToGPS, GPSToDate } from "./gravity-data-source.service.utils";
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from "../../shared/error-popup/error.component";
import { error } from "console";
import { BufferComponent } from "./buffer-popup/buffer-popup";
import { GravityStorageService } from "../storage/gravity-storage.service";
import { GravityDataService } from "../gravity-data.service";

@Injectable()
export class GravityDataSourceService implements OnDestroy {
    private destroy$: Subject<void> = new Subject<void>;

    private paginationSubject: BehaviorSubject<Pagination> = new BehaviorSubject<Pagination>({curent_page:0, page_length:0, total_pages:0})
    public pagination$ = this.paginationSubject.asObservable()
    
    private resultsSubject: Subject<GravityEvent[]> = new Subject
    public results$ = this.resultsSubject.asObservable()



    private sourceSelectionSubject: Subject<File> = new Subject<File>

    params: SearchParams = {};

    constructor(
        private http: HttpClient,
        private dataService: GravityDataService,
        private storaage: GravityStorageService,
        private dialog: MatDialog
    ) {



        this.pagination$.subscribe((page: Pagination) =>
        {
            if(!this.params) return;

            this.eventLookUp(this.params, page.curent_page)
        })
    }


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public submitSearchParams(params: SearchParams)
    {
        this.params = params;
        this.eventLookUp(params)
    }

    public selectFileVersion(name: string, detector: string)
    {
        this.fileLookUp(name, detector)
    }

    public setPage(page: number)
    {
        if(page<=0) page=1;


        this.eventLookUp(this.params, page)
    }

    private updatePagination(page: Pagination)
    {
        this.paginationSubject.next(page)
    }

    private eventLookUp(params: SearchParams, page: number = 1): void {

        let payload = {
            'min-gps-time': (params.min_time? params.min_time : 0),
            'max-gps-time': (params.max_time? params.max_time : dateToGPS(new Date())),
            // 'page': page
        }

        this.http.get(`https://gwosc.org/api/v2/event-versions`,
            {'params': payload}
        ).subscribe((resp: any) => {
            // let pagination: Pagination = {
            //     page_length: resp.,
            //     total_pages: ,
            //     curent_page:
            // }

            let searchResult: GravityEvent[] = resp.results.map((element: any) => {
                let time = GPSToDate(element['gps'])
                return {
                    Name: element["shortName"],
                    Detectors: element['detectors'],
                    Time: time.toLocaleDateString(),
                    URL: element["doi"]
                }
            });

            this.resultsSubject.next(searchResult)
        })
    }

    //If, in the future, we allow users to actually use different durations/sample rates of files, create enums for these values
    private fileLookUp(name: string, detector: string, sample_rate: number = 16, duration: number = 32) {

        this.dataService.selectionHandler(name, detector)
        
        // let payload = {
        //     'detector': detector,
        //     'sample-rate': sample_rate,
        //     'duration': duration,
        //     'file-format': 'hdf5',
        //     // 'page': page
        // }
        
        // //making a request and then another request feels bad, but thats the api. This
        // this.http.get(`${eventURL}/strain-files`,
        //     {'params': payload}
        // ).subscribe((resp: any) => {
        //     try {
        //         let url = resp.results[0]["download_url"] as string
        //         let time = resp.results[0]["gps_start"] as number

        //         console.log(url)

        //         // this.dialog.open(BufferComponent, {data: { progress: interval(10) }})
                
        //         const xhr = new XMLHttpRequest();
        //         xhr.open('GET', url);
        //         xhr.responseType = 'blob';

        //         xhr.onload = () => {
        //             if (xhr.status === 200) {
        //                 const blob = xhr.response;

        //                 //Do what we always do.
        //                 this.fileUpload(blob, time)
        // }
    };

    // xhr.send();
    //         }

    //         catch(e) {
    //             this.dialog.open(ErrorComponent, {data: {message: "Couldn't fetch that file... Try a different event or version!"}})
    //         }
    //     })
    // }

    public fileUpload(file: File, gps_time?: number)
    {
        this.dataService.uploadHandler(file, gps_time)
    }
}
