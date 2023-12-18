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

  private hasFSR: boolean = this.storageService.getHasFSR();

  constructor(
    private http: HttpClient,
    private dataSourceService: ClusterDataSourceService,
    private storageService: ClusterStorageService) {
    this.setSources(this.storageService.getSources());
    this.setHasFSR(this.storageService.getHasFSR());
    this.dataSourceService.rawData$.subscribe(
      () => {
        this.sources = this.dataSourceService.getSources();
        this.filters = this.dataSourceService.getFilters();
      }
    );
  }

  public reset() {
    this.setSources([]);
    this.filters = this.generateFilterList();
    this.setHasFSR(false);
  }

  public setHasFSR(hasFSR: boolean) {
    this.hasFSR = hasFSR;
    this.storageService.setHasFSR(hasFSR);
    this.dataSubject.next(this.sources);
  }

  public getHasFSR(): boolean {
    return this.hasFSR;
  }

  public getSources(): Source[] {
    return this.sources;
  }

  public getFilters(): FILTER[] {
    return this.filters;
  }

  public setSources(sources: Source[]) {
    this.sources = sources;
    this.filters = this.generateFilterList();
    this.dataSubject.next(this.sources);
    this.storageService.setSources(this.sources);
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
        if (complete) {
          this.getCatalogResults(catalogJob.getJobId());
        }
      });
    return catalogJob;
  }

  fetchFieldStarRemoval(): Job {
    const fsrJob = new Job('/cluster/fsr', this.http, 200);
    fsrJob.createJob({sources: this.getAstrometry()});
    fsrJob.complete$.subscribe(
      (complete) => {
        if (complete) {
          this.getFSRResults(fsrJob.getJobId());
          this.setHasFSR(true);
        }
      });
    return fsrJob;
  }

  public getCatalogResults(id: number | null) {
    if (id !== null)
      this.http.get(`${environment.apiUrl}/cluster/catalog`,
        {params: {'id': id}}).subscribe(
        (resp: any) => {
          const {sources, filters} = sourceSerialization(resp['output_sources']);
          this.setSources(sources);
          this.setHasFSR(true);
        }
      );
  }

  public getFSRResults(id: number | null) {
    if (id !== null)
      this.http.get(`${environment.apiUrl}/cluster/fsr`,
        {params: {'id': id}}).subscribe(
        (resp: any) => {
          this.setSources(appendFSRResults(this.sources, resp['FSR']));
        }
      );
  }

  private generateFilterList(): FILTER[] {
    const filters: FILTER[] = [];
    this.sources.forEach((source) => {
      source.photometries.forEach((photometry) => {
        if (!filters.includes(photometry.filter)) {
          filters.push(photometry.filter);
        }
      });
    });
    return filters;
  }
}
