import {Component} from '@angular/core';
import {ClusterService} from "../../cluster.service";
import {range} from "../../FSR/histogram-slider-input/histogram-slider-input.component";
import {ClusterDataService} from "../../cluster-data.service";
import {d2DMS, d2HMS} from "../../../shared/data/utils";
import {Catalogs} from "../../cluster.util";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {JobStatus} from "../../../../shared/job/job";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-fetch-popup',
    templateUrl: './fetch-popup.component.html',
    styleUrls: ['./fetch-popup.component.scss']
})
export class FetchPopupComponent {
    name!: string;
    ra: number;
    display_ra: number[];
    dec: number;
    display_dec: number[];
    pmra!: range;
    pmdec!: range;
    distance!: range;
    filters!: string;
    catalogs = Object.values(Catalogs);
    maximumRadius: number = this.dataService.getCluster() ?
        this.dataService.getCluster()!.radius * 2 : 1;
    formGroup: FormGroup = new FormGroup({
        radius: new FormControl(this.maximumRadius,
            [Validators.min(0),
                Validators.max(this.maximumRadius), Validators.required]),
        catalogs: new FormControl('', Validators.required),
    });
    isRadiusValid: boolean = false;

    hideProgressBar: boolean = true;
    progressBar: number = -1;

    error: number | null = null;

    constructor(private http: HttpClient,
                private dialog: MatDialog,
                private service: ClusterService,
                private dataService: ClusterDataService) {
        this.name = this.service.getClusterName();
        this.ra = this.dataService.getClusterRa()!;
        this.display_ra = d2HMS(this.ra);
        this.dec = this.dataService.getClusterDec()!;
        this.display_dec = d2DMS(this.dec);
        this.pmra = this.service.getFsrParams().pm_ra!;
        this.pmdec = this.service.getFsrParams().pm_dec!;
        this.distance = this.service.getFsrParams().distance!;
        //@ts-ignore
        this.filters = this.dataService.getFilters().join(', ').replaceAll("prime", "\'");
    }

    // TODO: cancel job on replacement
    close() {
    }

    testRadius() {
        this.error = null;
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }
        this.hideProgressBar = false;
        this.http.post(`${environment.apiUrl}/cluster/catalog/test-radius`, {
            ra: this.ra,
            dec: this.dec,
            radius: this.formGroup.controls['radius'].value,
            constraints: this.service.getFsrParams(),
        }).subscribe(() => {
            this.isRadiusValid = true;
            this.hideProgressBar = true;
        }, error => {
            this.error = error.status;
            this.hideProgressBar = true;
        });
    }

    fetchData() {
        const job = this.dataService.fetchCatalog(
            this.ra,
            this.dec,
            this.formGroup.controls['radius'].value,
            this.formGroup.controls['catalogs'].value
        )
        this.hideProgressBar = false;
        job.statusUpdate$.subscribe((status) => {
            if (status === JobStatus.PENDING) {
                this.progressBar = -1;
            } else if (status === JobStatus.COMPLETED) {
                this.hideProgressBar = true;
                this.dialog.closeAll();
            } else if (status === JobStatus.FAILED) {
                this.hideProgressBar = true;
                this.error = 500;
            }
        });
        job.progressUpdate$.subscribe((progress) => {
            if (progress !== null)
                this.progressBar = progress;
        });
    }
}
