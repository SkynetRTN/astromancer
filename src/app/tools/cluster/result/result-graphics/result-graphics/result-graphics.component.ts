import {AfterViewInit, Component} from '@angular/core';
import {environment} from "../../../../../../environments/environment";
import {ClusterMWSC} from "../../../storage/cluster-storage.service.util";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-result-graphics',
    templateUrl: './result-graphics.component.html',
    styleUrls: ['./result-graphics.component.scss']
})
export class ResultGraphicsComponent implements AfterViewInit{
    allClusters: ClusterMWSC[] = [];

    constructor(private http: HttpClient) {
    }

    ngAfterViewInit(): void {
        this.http.get(`${environment.apiUrl}/cluster/allMWSC`).subscribe((data: any | ClusterMWSC[]) => {
            this.allClusters = data;
        });
    }

}
