import {Injectable} from '@angular/core';
import {ClusterDataSourceService} from "./data-source/cluster-data-source.service";
import {Astrometry, Catalogs, FILTER, filterWavelength, FSR, Source} from "./cluster.util";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Job} from "../../shared/job/job";

import {environment} from "../../../environments/environment";
import {appendFSRResults, sourceSerialization} from "./cluster-data.service.util";
import {ClusterStorageService} from "./storage/cluster-storage.service";
import {FsrParameters} from "./FSR/fsr.util";

@Injectable()
export class ClusterDataService {
  private sources: Source[] = []; // always sorted in ascending order by id
  private sources_fsr: Source[] = [];
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

  public getSources(isFSR: boolean = false): Source[] {
    if (!isFSR || !this.hasFSR)
      return this.sources;
    else
      return this.sources_fsr;
  }

  public setFSRCriteria(fsr: FsrParameters) {
    this.sources_fsr = [];
    if (this.hasFSR) {
      const pmBoolGlobal = fsr.pmra === null || fsr.pmdec === null;
      let pmra = 0;
      let pmdec = 0;
      let pmCriteria = 0;
      if (!pmBoolGlobal) {
        const pmra_err = (fsr.pmra!.max - fsr.pmra!.min) / 2
        const pmdec_err = (fsr.pmdec!.max - fsr.pmdec!.min) / 2
        pmra = (fsr.pmra!.max + fsr.pmra!.min) / 2
        pmdec = (fsr.pmdec!.max + fsr.pmdec!.min) / 2
        pmCriteria = Math.pow(pmra_err, 2) + Math.pow(pmdec_err, 2);
      }
      for (const data of this.sources) {
        const distanceBool
          = fsr.distance === null ||
          (data.fsr && data.fsr.distance && data.fsr.distance >= fsr.distance.min * 1000 && data.fsr.distance <= fsr.distance.max * 1000);
        let pmBool: boolean = pmBoolGlobal;
        if (!pmBool && data.fsr && data.fsr.pm_ra && data.fsr.pm_dec) {
          const pmDistance = Math.pow(data.fsr.pm_ra - pmra, 2)
            + Math.pow(data.fsr.pm_dec - pmdec, 2);
          pmBool = pmDistance <= pmCriteria;
        }
        if (distanceBool && pmBool) {
          this.sources_fsr.push(data);
        }
      }
    }
    this.fsrFilteredSubject.next(this.sources_fsr);
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

  // in kparsec not parsec
  getDistance(): (number)[] {
    return this.sources.filter(
      (source) => {
        return source.fsr && source.fsr.distance && source.fsr.distance > 0;
      }
    ).map((source) => {
      return parseFloat((source.fsr!.distance / 1000).toFixed(2));
    }).sort((a, b) => {
      return a - b;
    });
  }

  getPmra(): number[] {
    return this.sources.filter(
      (source) => {
        return source.fsr && source.fsr.pm_ra;
      }
    ).map((source) => {
      return parseFloat((source.fsr!.pm_ra).toFixed(2));
    }).sort((a, b) => {
      return a - b;
    });
  }

  getPmdec(): number[] {
    return this.sources.filter(
      (source) => {
        return source.fsr && source.fsr.pm_dec;
      }
    ).map((source) => {
      return parseFloat((source.fsr!.pm_dec).toFixed(2));
    }).sort((a, b) => {
      return a - b;
    });
  }

  get2DpmChartData(): number[][] {
    return this.getSources(true).map((source) => {
      return [source.fsr!.pm_ra, source.fsr!.pm_dec];
    });
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
