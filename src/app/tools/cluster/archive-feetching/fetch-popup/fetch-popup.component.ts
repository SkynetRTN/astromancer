import {Component} from '@angular/core';
import {ClusterService} from "../../cluster.service";
import {range} from "../../FSR/histogram-slider-input/histogram-slider-input.component";
import {ClusterDataService} from "../../cluster-data.service";
import {d2DMS, d2HMS} from "../../../shared/data/utils";
import {Catalogs} from "../../cluster.util";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Job, JobStatus, JobStorageObject} from "../../../../shared/job/job";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {MatDialog} from "@angular/material/dialog";
import {ClusterStorageService} from "../../storage/cluster-storage.service";
import {delay} from "rxjs";
import {hide} from "@popperjs/core";

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

  status: number | null = null;
  testStarCount: number = 0;
  testLimit: number = 100;
  job: Job | null = null;
  previousJob: JobStorageObject | null = null;
  protected readonly Catalogs = Catalogs;
  protected readonly hide = hide;

  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private service: ClusterService,
              private dataService: ClusterDataService,
              private storageService: ClusterStorageService) {
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

    this.formGroup.valueChanges.subscribe(() => {
      this.isRadiusValid = false;
    });
  }

  close() {
    if (this.job !== null) {
      this.job.cancelJob();
      if (this.previousJob !== null) {
        this.storageService.setJob(this.previousJob);
      }
      this.http.delete(`${environment.apiUrl}/job/`,
        {params: {'id': this.job!.getJobId()!.toString()}});
    }
  }

  testRadius() {
    this.status = null;
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
    }).subscribe((res: any) => {
      this.isRadiusValid = true;
      this.hideProgressBar = true;
      this.status = 200;
      this.testStarCount = res['counts'];
      this.testLimit = res['limit'];
    }, error => {
      this.status = error.status;
      this.hideProgressBar = true;
    });
  }

  fetchData() {
    this.previousJob = this.storageService.getJob();
    this.job = this.dataService.fetchCatalog(
      this.ra,
      this.dec,
      this.formGroup.controls['radius'].value,
      this.formGroup.controls['catalogs'].value
    )
    this.hideProgressBar = false;
    this.status = null;
    this.job.statusUpdate$.pipe(delay(500)).subscribe((status) => {
      if (status === JobStatus.PENDING) {
        this.progressBar = -1;
      } else if (status === JobStatus.COMPLETED) {
        this.hideProgressBar = true;
        this.status = null;
        this.dialog.closeAll();
      } else if (status === JobStatus.FAILED) {
        this.hideProgressBar = true;
        this.status = 500;
      }
    });
    this.job.progressUpdate$.subscribe((progress) => {
      if (progress !== null)
        this.progressBar = progress;
    });
  }
}
