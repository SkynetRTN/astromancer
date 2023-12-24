import {Injectable} from '@angular/core';
import {ClusterDataSourceService} from "./data-source/cluster-data-source.service";
import {Astrometry, Catalogs, FILTER, filterWavelength, FSR, Source} from "./cluster.util";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Job} from "../../shared/job/job";

import {environment} from "../../../environments/environment";
import {appendFSRResults, filterFSR, sourceSerialization} from "./cluster-data.service.util";
import {ClusterStorageService} from "./storage/cluster-storage.service";
import {FsrParameters} from "./FSR/fsr.util";

@Injectable()
export class ClusterDataService {
  private sources: Source[] = []; // always sorted in ascending order by id
  private userPhotometry: Source[] | null = null; // user uploaded photometry
  private sources_fsr: Source[] = [];
  private sources_not_fsr: Source[] = [];
  private filters: FILTER[] = [];
  private hasFSR: boolean = this.storageService.getHasFSR();
  private dataSubject = new Subject<Source[]>();
  public data$ = this.dataSubject.asObservable();
  private fsrFilteredSubject = new Subject<Source[]>();
  public fsrFiltered$ = this.fsrFilteredSubject.asObservable();

  constructor(
    private http: HttpClient,
    private dataSourceService: ClusterDataSourceService,
    private storageService: ClusterStorageService) {
    this.initValues();
    this.dataSourceService.rawData$.subscribe(
      () => {
        this.sources = this.dataSourceService.getSources();
        this.filters = this.dataSourceService.getFilters();
      }
    );
  }

  public reset() {
    this.storageService.resetDataSource();
    this.initValues();
  }

  public setHasFSR(hasFSR: boolean) {
    this.hasFSR = hasFSR;
    this.storageService.setHasFSR(hasFSR);
    this.dataSubject.next(this.sources);
  }

  public getHasFSR(): boolean {
    return this.hasFSR;
  }

  public getSources(isFSR: boolean = false): Source[] {
    if (!isFSR || !this.hasFSR)
      return this.sources;
    else
      return this.sources_fsr;
  }

  public setFSRCriteria(fsr: FsrParameters) {
    const result = filterFSR(this.hasFSR ? this.sources : null, fsr);
    this.sources_fsr = result.fsr;
    this.sources_not_fsr = result.not_fsr;
    this.fsrFilteredSubject.next(this.sources_fsr);
    this.storageService.setFsrParams(fsr);
  }

  public getFilters(): FILTER[] {
    return this.filters;
  }

  public setSources(sources: Source[]) {
    this.sources = sources.filter(
      (source) => {
        return (source.fsr !== null
          && source.fsr.distance !== null
          && source.fsr.pm_ra !== null
          && source.fsr.pm_dec !== null)
      }
    );
    this.filters = this.generateFilterList();
    this.dataSubject.next(this.sources);
    this.storageService.setSources(this.sources);
  }

  public syncUserPhotometry() {
    console.log('syncing user photometry');
    this.userPhotometry = this.sources;
    this.storageService.setUserPhotometry(this.userPhotometry);
  }

  public getUserPhotometry(): Source[] | null {
    return this.userPhotometry;
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
    if (this.userPhotometry !== null && this.userPhotometry.length > 0)
      payload['sources'] = this.userPhotometry
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
          this.syncUserPhotometry();
        }
      );
  }

  // in kparsec not parsec
  getDistance(full: boolean = false): (number)[] {
    const data = full ? this.sources : this.sources_fsr;
    return data.filter(
      (source) => {
        return source.fsr !== null && source.fsr.distance !== null;
      }
    ).map((source) => {
      return parseFloat((source.fsr!.distance / 1000).toFixed(2));
    }).sort((a, b) => {
      return a - b;
    });
  }

  getPmra(full: boolean = false): number[] {
    const data = full ? this.sources : this.sources_fsr;
    return data.filter(
      (source) => {
        return source.fsr !== null && source.fsr.pm_ra !== null;
      }
    ).map((source) => {
      return parseFloat((source.fsr!.pm_ra).toFixed(2));
    }).sort((a, b) => {
      return a - b;
    });
  }

  getPmdec(full: boolean = false): number[] {
    const data = full ? this.sources : this.sources_fsr;
    return data.filter(
      (source) => {
        return source.fsr !== null && source.fsr.pm_dec !== null;
      }
    ).map((source) => {
      return parseFloat((source.fsr!.pm_dec).toFixed(2));
    }).sort((a, b) => {
      return a - b;
    });
  }

  get2DpmChartData(): { cluster: number[][], field: number[][] } {
    const cluster = this.sources_fsr.filter(
      (source) => {
        return source.fsr !== null && source.fsr.pm_ra !== null && source.fsr.pm_dec !== null;
      }
    ).map((source) => {
      return [source.fsr!.pm_ra, source.fsr!.pm_dec];
    });
    const field = this.sources_not_fsr.filter((source) => {
      return source.fsr !== null && source.fsr.pm_ra !== null && source.fsr.pm_dec !== null;
    }).map((source) => {
      return [source.fsr!.pm_ra, source.fsr!.pm_dec];
    });
    return {cluster: cluster, field: field};
  }

  getRa(full: boolean = false): number[] {
    const data = full ? this.sources : this.sources_fsr;
    return data.filter(
      (source) => {
        return source.astrometry !== null && source.astrometry.ra !== null;
      }
    ).map((source) => {
      return parseFloat((source.astrometry!.ra).toFixed(2));
    }).sort((a, b) => {
      return a - b;
    });
  }

  getClusterRa(): number | null {
    const array = this.getRa();
    return array.length === 0 ? null : array[Math.floor(array.length / 2)];
  }

  getDec(full: boolean = false): number[] {
    const data = full ? this.sources : this.sources_fsr;
    return data.filter(
      (source) => {
        return source.astrometry !== null && source.astrometry.dec !== null;
      }
    ).map((source) => {
      return parseFloat((source.astrometry!.dec).toFixed(2));
    }).sort((a, b) => {
      return a - b;
    });
  }

  getClusterDec(): number | null {
    const array = this.getDec();
    return array.length === 0 ? null : array[Math.floor(array.length / 2)];
  }

  private initValues() {
    this.setSources(this.storageService.getSources());
    this.setHasFSR(this.storageService.getHasFSR());
    this.setFSRCriteria(this.storageService.getFsrParams());
    this.userPhotometry = this.storageService.getUserPhotometry();
  }

  private generateFilterList(): FILTER[] {
    let filters: FILTER[] = [];
    this.sources.forEach((source) => {
      source.photometries.forEach((photometry) => {
        if (!filters.includes(photometry.filter)) {
          filters.push(photometry.filter);
        }
      });
    });
    filters = filters.sort((a, b) => {
      return filterWavelength[a] - filterWavelength[b];
    })
    return filters;
  }

}
