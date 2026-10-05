import {Injectable} from '@angular/core';
import {MyFileParser} from "../../shared/data/FileParser/FileParser";
import {FileType} from "../../shared/data/FileParser/FileParser.util";
import {Subject} from "rxjs";
import {
    CLUSTER_CSV_DATA_KEYS,
    CLUSTER_CSV_OPTIONAL_DATA_KEYS,
    ClusterLookUpData,
    ClusterLookUpStack,
    ClusterLookUpStackImpl,
    ClusterRawData,
    toClusterRawData,
    toClusterSources
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
        CLUSTER_CSV_DATA_KEYS, [], CLUSTER_CSV_OPTIONAL_DATA_KEYS)
    private lookUpDataArraySubject: Subject<ClusterLookUpData[]> = new Subject<ClusterLookUpData[]>();
    public lookUpDataArray$ = this.lookUpDataArraySubject.asObservable();

    private rawData: ClusterRawData[] = [];
    private sources: Source[] = [];
    private filters: FILTER[] = [];

    constructor(private http: HttpClient,
                private storageService: ClusterStorageService,) {
        this.lookUpDataStack.load(this.storageService.getRecentSearches());
        this.lookUpDataArraySubject.next(this.lookUpDataStack.list());
        this.fileParser.data$.subscribe(
            data => {
                this.setRawData(data);
            });
        this.fileParser.error$.subscribe(
            error => {
                alert("File Upload Error: " + error);
            });
    }

    init() {
        this.rawData = [];
        this.sources = [];
        this.filters = [];
    }

    onFileUpload(file: File): void {
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
        const {sources, filters} = toClusterSources(this.rawData);
        this.sources = sources;
        this.filters = filters;
    }

    private setRawData(rows: { [key: string]: string | undefined }[]): void {
        this.rawData = rows.map(toClusterRawData)
            .filter((entry): entry is ClusterRawData => entry !== null);
        this.processData();
        this.rawDataSubject.next(this.rawData);
    }
}
