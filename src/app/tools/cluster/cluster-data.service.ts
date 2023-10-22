import {Injectable} from '@angular/core';
import {ClusterDataSourceService} from "./data-source/cluster-data-source.service";
import {Astrometry, FILTER, FSR, Source} from "./cluster.util";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Job} from "../../shared/job/job";

import {environment} from "../../../environments/environment";

@Injectable()
export class ClusterDataService {
  private sources: Source[] = []; // always sorted in ascending order by id
  private filters: FILTER[] = [];
  private dataSubject = new Subject<Source[]>();
  public data$ = this.dataSubject.asObservable();

  private hasFSR: boolean = false;

  constructor(
    private http: HttpClient,
    private dataSourceService: ClusterDataSourceService) {
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

  public getAstrometry(): Astrometry[] {
    return this.sources.map((source) => {
      return source.astrometry;
    })
  }

  public getFSRCount(): number {
    return this.sources.filter((source) => {
      return source.fsr
    }).length;
  }

  fetchFieldStarRemoval(): Job {
    const fsrJob = new Job('/cluster/fsr', this.http, 200);
    fsrJob.createJob(this.getAstrometry());
    fsrJob.complete$.subscribe(
      (complete) => {
        if (complete)
          this.getFSRResults(fsrJob.getJobId());
      });
    return fsrJob;
  }

  private getFSRResults(id: number | null) {
    if (id !== null)
      this.http.get(`${environment.apiUrl}/cluster/fsr`,
        {params: {'id': id}}).subscribe(
        (resp: any) => {
          this.appendFSRResults(resp['FSR']);
        }
      );
  }

  private appendFSRResults(fsr: any[]) {
    fsr = fsr.sort((a, b) => {
      return a.id - b.id;
    });
    let i = 0, j = 0;
    while (i < this.sources.length && j < fsr.length) {
      const compare = this.sources[i].astrometry.id.localeCompare(fsr[j].id);
      if (compare === 0) {
        this.sources[i].fsr = {
          pm_ra: fsr[j].pm_ra,
          pm_dec: fsr[j].pm_dec,
          distance: fsr[j].distance,
        }
        i++;
        j++;
      } else if (compare < 0) {
        i++;
      } else {
        j++;
      }
    }
    this.dataSubject.next(this.sources);
  }
}
