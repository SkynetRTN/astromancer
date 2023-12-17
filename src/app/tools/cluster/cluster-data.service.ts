import {Injectable} from '@angular/core';
import {ClusterDataSourceService} from "./data-source/cluster-data-source.service";
import {Astrometry, Catalogs, FILTER, FSR, Source} from "./cluster.util";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Job} from "../../shared/job/job";

import {environment} from "../../../environments/environment";
import {appendFSRResults, sourceSerialization} from "./cluster-data.service.util";
import {ClusterStorageService} from "./storage/cluster-storage.service";

@Injectable()
export class ClusterDataService {
  private sources: Source[] = []; // always sorted in ascending order by id
  private filters: FILTER[] = [];
  private dataSubject = new Subject<Source[]>();
  public data$ = this.dataSubject.asObservable();

  private hasFSR: boolean = false;

  constructor(
    private http: HttpClient,
    private dataSourceService: ClusterDataSourceService,
    private storageService: ClusterStorageService) {
    this.dataSourceService.rawData$.subscribe(
      () => {
        this.sources = this.dataSourceService.getSources();
        this.filters = this.dataSourceService.getFilters();
      }
    )
  }

  public init() {
    this.sources = [];
    this.filters = [];
    this.hasFSR = false;
    this.dataSourceService.init();
  }

  public setHasFSR(hasFSR: boolean) {
    this.hasFSR = hasFSR;
  }

  public getHasFSR(): boolean {
    return this.hasFSR;
  }

  public getSources(): Source[] {
    return this.sources;
  }

  public getAstrometry(): { id: string, astrometry: Astrometry }[] {
    return this.sources.map((source) => {
      return {id: source.id, astrometry: source.astrometry, photometry: []};
    })
  }

  public getFSRCount(): number {
    return this.sources.filter((source) => {
      return source.fsr
    }).length;
  }


  fetchCatalogFetch(ra: number, dec: number, radius: number, catalogs: Catalogs[]): Job {
    const catalogJob = new Job('/cluster/catalog', this.http, 200);
    let payload: any = {
      ra: ra,
      dec: dec,
      radius: radius,
      catalogs: catalogs,
    }
    if (this.sources.length > 0)
      payload['sources'] = this.sources
    catalogJob.createJob(payload);
    catalogJob.complete$.subscribe(
      (complete) => {
        if (complete)
          this.getCatalogResults(catalogJob.getJobId());
      });
    return catalogJob;
  }

  fetchFieldStarRemoval(): Job {
    const fsrJob = new Job('/cluster/fsr', this.http, 200);
    fsrJob.createJob({sources: this.getAstrometry()});
    fsrJob.complete$.subscribe(
      (complete) => {
        if (complete)
          this.getFSRResults(fsrJob.getJobId());
      });
    return fsrJob;
  }

  private getCatalogResults(id: number | null) {
    if (id !== null)
      this.http.get(`${environment.apiUrl}/cluster/catalog`,
        {params: {'id': id}}).subscribe(
        (resp: any) => {
          const {sources, filters} = sourceSerialization(resp['catalog']);
          this.sources = sources;
          this.filters = filters;
          this.setHasFSR(true);
          this.dataSubject.next(this.sources);
        }
      );
  }

  private getFSRResults(id: number | null) {
    if (id !== null)
      this.http.get(`${environment.apiUrl}/cluster/fsr`,
        {params: {'id': id}}).subscribe(
        (resp: any) => {
          this.sources = appendFSRResults(this.sources, resp['FSR']);
          this.dataSubject.next(this.sources);
          console.log(this.sources);
        }
      );
  }
}
