import {AfterViewInit, Component} from '@angular/core';
import {environment} from "../../../../../../environments/environment";
import {ClusterMWSC} from "../../../storage/cluster-storage.service.util";
import {HttpClient} from "@angular/common/http";
import {combineLatestWith, Subject} from "rxjs";
import {ClusterService} from "../../../cluster.service";
import {ClusterIsochroneService} from "../../../isochrone-matching/cluster-isochrone.service";
import {ClusterDataService} from "../../../cluster-data.service";

@Component({
    selector: 'app-result-graphics',
    templateUrl: './result-graphics.component.html',
    styleUrls: ['./result-graphics.component.scss']
})
export class ResultGraphicsComponent implements AfterViewInit {
    allClusters: ClusterMWSC[] = [];
    update$: Subject<void> = new Subject<void>();


    constructor(
        private service: ClusterService,
        private isochroneService: ClusterIsochroneService,
        private dataService: ClusterDataService,
        private http: HttpClient) {
        this.service.tabIndex$.subscribe((index: number) => {
            if (index === 4) {
                this.update$.next();
            }
        });
        this.dataService.sources$.pipe(
            combineLatestWith(this.isochroneService.plotParams$)
        ).subscribe(() => {
            if (this.service.getTabIndex() === 4) {
                this.update$.next();
            }
        });
    }

    ngAfterViewInit(): void {
        this.http.get(`${environment.apiUrl}/cluster/allMWSC`).subscribe((data: any | ClusterMWSC[]) => {
            this.allClusters = data;
        });
    }

}
