import {Injectable} from '@angular/core';
import {MyFileParser} from "../../shared/data/FileParser/FileParser";
import {FileType} from "../../shared/data/FileParser/FileParser.util";
import {Subject} from "rxjs";
import {
    ClusterLookUpData,
    ClusterLookUpStack,
    ClusterLookUpStackImpl,
    ClusterRawData
} from "./cluster-data-source.service.util";
import {FILTER, Source} from "../cluster.util";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ClusterStorageService} from "../storage/cluster-storage.service";

@Injectable()
export class ClusterDataSourceService {
    public lookUpDataStack: ClusterLookUpStack = new ClusterLookUpStackImpl(5);
    private rawDataSubject: Subject<ClusterRawData[]> = new Subject<ClusterRawData[]>();
    public rawData$ = this.rawDataSubject.asObservable();
    private lookUpDataSubject: Subject<ClusterLookUpData | null> = new Subject<ClusterLookUpData | null>();
    public lookUpData$ = this.lookUpDataSubject.asObservable();
    private readonly fileParser: MyFileParser = new MyFileParser(FileType.CSV,
        ['id', 'filter', 'calibrated_mag', 'mag_error', 'ra_hours', 'dec_degs'])
    private lookUpDataArraySubject: Subject<ClusterLookUpData[]> = new Subject<ClusterLookUpData[]>();
    public lookUpDataArray$ = this.lookUpDataArraySubject.asObservable();

    private rawData: ClusterRawData[] = [];
    private sources: Source[] = [];
    private filters: FILTER[] = [];

    constructor(private http: HttpClient,
                private storageService: ClusterStorageService,) {
        this.lookUpDataStack.load(this.storageService.getRecentSearches());
        this.lookUpDataArraySubject.next(this.lookUpDataStack.list());
    }

    init() {
        this.rawData = [];
        this.sources = [];
        this.filters = [];
    }

    onFileUpload(file: File): void {
        this.fileParser.data$.subscribe(
            data => {
                this.setRawData(data);
            });
        this.fileParser.error$.subscribe(
            error => {
                alert("File Upload Error: " + error);
            });
        this.fileParser.readFile(file, true);
    }

    getSources(): Source[] {
        return this.sources;
    }

    getFilters(): FILTER[] {
        return this.filters;
    }

    public lookUpCluster(query: string): void {
        this.http.get(`${environment.apiUrl}/cluster/lookup`, {params: {'name': query}}).subscribe(
            (response: any) => {
                const data: ClusterLookUpData = {
                    name: query,
                    ra: parseFloat(response['ra']),
                    dec: parseFloat(response['dec']),
                    radius: parseFloat(response['radius']) ? parseFloat(response['radius']) : 0,
                }
                this.pushRecentSearch(data);
                this.lookUpDataSubject.next(data);
            },
            (error) => {
                if (error.status === 400) {
                    this.lookUpDataSubject.next(null);
                }
            }
        )
    }

    public pushRecentSearch(data: ClusterLookUpData): void {
        this.lookUpDataStack.push(data);
        this.lookUpDataArraySubject.next(this.lookUpDataStack.list());
        this.storageService.setRecentSearches(this.lookUpDataStack.list());
    }

    private processData(): void {
        const sortedData = this.rawData.filter(
            (entry) => {
                return entry.id !== undefined && entry.filter !== undefined && entry.calibrated_mag !== undefined && entry.mag_error !== undefined && entry.ra_hours !== undefined && entry.dec_degs !== undefined
            }
        ).sort((a, b) => {
            return a.id.localeCompare(b.id);
        });
        const processedData: Source[] = [];
        const filters: FILTER[] = [];
        let currentId = sortedData[0].id;
        let currentStar: Source = {
            id: currentId,
            astrometry: {
                ra: 0,
                dec: 0
            },
            photometries: [],
            fsr: null,
        }
        let raSum: number = 0;
        let decSum: number = 0;
        let entryCounter: number = 0;
        for (let i = 0; i < sortedData.length; i++) {
            if (sortedData[i].id !== currentId) {
                currentStar.astrometry.ra = raSum / entryCounter;
                currentStar.astrometry.dec = decSum / entryCounter;
                entryCounter = 1;
                processedData.push(currentStar);
                currentId = sortedData[i].id;
                raSum = parseFloat(sortedData[i].ra_hours) * 15;
                decSum = parseFloat(sortedData[i].dec_degs);
                currentStar = {
                    id: currentId,
                    astrometry: {
                        ra: 0,
                        dec: 0
                    },
                    photometries: [],
                    fsr: null,
                }
            } else {
                entryCounter++;
                raSum += parseFloat(sortedData[i].ra_hours) * 15;
                decSum += parseFloat(sortedData[i].dec_degs);
            }
            const filter = sortedData[i].filter;
            const mag = parseFloat(sortedData[i].calibrated_mag);
            const mag_error = parseFloat(sortedData[i].mag_error);
            if (Object.values(FILTER).includes(filter as any as FILTER) && !isNaN(mag) && !isNaN(mag_error)) {
                currentStar.photometries.push({
                    filter: filter as any as FILTER,
                    mag: mag,
                    mag_error: mag_error
                });
                if (!filters.includes(filter as any as FILTER)) {
                    filters.push(filter as any as FILTER);
                }
            }
        }
        currentStar.astrometry.ra = raSum / currentStar.photometries.length;
        currentStar.astrometry.dec = decSum / currentStar.photometries.length;
        processedData.push(currentStar);
        this.sources = processedData;
        this.filters = filters;
    }

    private setRawData(rawData: ClusterRawData[]): void {
        this.rawData = rawData.filter((entry) => entry.id !== undefined);
        this.processData();
        this.rawDataSubject.next(this.rawData);
    }
}
