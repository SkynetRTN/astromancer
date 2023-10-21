import {Injectable} from '@angular/core';
import {ClusterDataSourceService} from "./data-source/cluster-data-source.service";
import {Astrometry, FILTER, Source} from "./cluster.util";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {environment} from 'src/environments/environment';

@Injectable()
export class ClusterDataService {
  private sources: Source[] = [];
  private filters: FILTER[] = [];
  private dataSubject = new Subject<Source[]>();
  public data$ = this.dataSubject.asObservable();

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

  public getSources(): Source[] {
    return this.sources;
  }

  public getAstrometry(): Astrometry[] {
    return this.sources.map((source) => {
      return source.astrometry;
    })
  }


  fetchFieldStarRemoval() {
    console.log(this.getAstrometry());
    this.http.post(
      `${environment.apiUrl}/cluster/fsr`,
      JSON.stringify({'astrometry': this.getAstrometry()}),
      {headers: {'content-type': 'application/json'}}).subscribe(
      (data: any) => {
        // this.updateFSRJob(data['id']);
      }
    );
  }

  private updateFSRJob(id: number) {
    this.http.get(`${environment.apiUrl}/cluster/fsr`, {params: {'id': id.toString()}}).subscribe(
      (data: any) => {
        console.log(data);
      }
    );
  }
}
