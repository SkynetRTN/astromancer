import {AfterViewInit, Component} from '@angular/core';
import {environment} from "../../../../../../environments/environment";
import {ClusterMWSC} from "../../../storage/cluster-storage.service.util";
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {ClusterService} from "../../../cluster.service";

@Component({
    selector: 'app-result-graphics',
    templateUrl: './result-graphics.component.html',
    styleUrls: ['./result-graphics.component.scss']
})
export class ResultGraphicsComponent implements AfterViewInit {
    allClusters: ClusterMWSC[] = [];
    update$: Subject<void> = new Subject<void>();


    constructor(private service: ClusterService, private http: HttpClient) {
        this.service.tabIndex$.subscribe((index: number) => {
            if (index === 4) {
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
