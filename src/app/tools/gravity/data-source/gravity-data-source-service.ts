import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, interval, sample, Subject } from "rxjs";
import { Pagination, GravityEvent, SearchParams, Detector, dateToGPS, GPSToDate } from "./gravity-data-source.service.utils";
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from "../../shared/error-popup/error.component";
import { error } from "console";
import { LoadingBlockComponent } from "./loading-block/loading-block";
import { GravityStorageService } from "../storage/gravity-storage.service";
import { GravityDataService } from "../gravity-data.service";

@Injectable()
export class GravityDataSourceService implements OnDestroy {
    private destroy$: Subject<void> = new Subject<void>;

    private paginationSubject: Subject<Pagination> = new Subject<Pagination>()
    public pagination$ = this.paginationSubject.asObservable()
    
    private resultsSubject: Subject<GravityEvent[]> = new Subject
    public results$ = this.resultsSubject.asObservable()

    


    private sourceSelectionSubject: Subject<File> = new Subject<File>

    params: SearchParams = {};

    constructor(
        private http: HttpClient,
        private dataService: GravityDataService,
    ) {

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
        //On the api pages are 1-indexed, but mat paginator uses 0-indexing
        page+=1

        if(page<=0) page=1;


        this.eventLookUp(this.params, page)
    }

    private eventLookUp(params: SearchParams, page: number = 1): void {

        let payload = {
            'min-gps-time': (params.min_time? params.min_time : 0),
            'max-gps-time': (params.max_time? params.max_time : dateToGPS(new Date())),
            'page': page
        }

        this.http.get(`https://gwosc.org/api/v2/event-versions`,
            {'params': payload}
        ).subscribe((resp: any) => {

            let pagination: Pagination = {
                page_length: resp.results_per_page,
                total_items: resp.results_count
            }

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
            this.paginationSubject.next(pagination)
        })
    }

    //If, in the future, we allow users to actually use different durations/sample rates of files, create enums for these values
    private fileLookUp(name: string, detector: string, sample_rate: number = 16, duration: number = 32) {

        this.dataService.selectionHandler(name, detector)
    };


    public fileUpload(file: File, gps_time?: number)
    {
        this.dataService.uploadHandler(file, gps_time)
    }
}
