import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ClusterLookUpData} from "../../cluster-data-source.service.util";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Catalogs, FILTER, Source} from "../../../cluster.util";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../../environments/environment";
import {ClusterDataService} from "../../../cluster-data.service";
import {ClusterDataSourceService} from "../../cluster-data-source.service";
import {ClusterStorageService} from "../../../storage/cluster-storage.service";
import {Job} from "../../../../../shared/job/job";
import {ClusterService} from "../../../cluster.service";

@Component({
  selector: 'app-fetch',
  templateUrl: './fetch.component.html',
  styleUrls: ['./fetch.component.scss', '../cluster-data-source-pop-ups.scss']
})
export class FetchComponent {
  public catalogs = Object.values(Catalogs);
  public formGroup: FormGroup = new FormGroup({
    name: new FormControl(this.data.name, [Validators.required]),
    ra: new FormControl(this.data.ra,
      [Validators.required, Validators.min(0), Validators.max(360)]),
    dec: new FormControl(this.data.dec,
      [Validators.required, Validators.min(-90), Validators.max(90)]),
    radius: new FormControl(this.data.radius,
      [Validators.required, Validators.min(0), Validators.max(3)]),
    catalog: new FormControl(Catalogs.GAIA, [Validators.required]),
  });
  job: Job | null = null;
  loading: boolean = false;
  readyForNext: boolean = false;
  fetchData: Source[] = [];
  filters: FILTER[] = [];
  error: number | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ClusterLookUpData,
              private http: HttpClient,
              private dialog: MatDialog,
              private service: ClusterService,
              private dataSourceService: ClusterDataSourceService,
              private dataService: ClusterDataService,
              private clusterStorageService: ClusterStorageService) {
    this.formGroup.valueChanges.subscribe(() => {
      this.readyForNext = false;
    });
  }

  testRadius() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.readyForNext = false;
    this.error = null;
    this.dataSourceService.pushRecentSearch({
      name: this.formGroup.controls['name'].value,
      ra: parseFloat(this.formGroup.controls['ra'].value),
      dec: parseFloat(this.formGroup.controls['dec'].value),
      radius: parseFloat(this.formGroup.controls['radius'].value),
    });
    this.http.post(`${environment.apiUrl}/cluster/catalog/test-radius`, {
      ra: this.formGroup.controls['ra'].value,
      dec: this.formGroup.controls['dec'].value,
      radius: this.formGroup.controls['radius'].value,
      catalogs: [this.formGroup.controls['catalog'].value],
      constraints: null,
    }).subscribe((res: any) => {
      this.loading = false;
      if (res) {
        this.readyForNext = true;
      }
    }, error => {
      this.loading = false;
      this.error = error.status;
    })
  }

  fetchCatalog() {
    if (this.dataService.getSources().length > 0) {
      this.service.setTabIndex(1);
      this.dialog.closeAll();
    } else {
      this.loading = true;
      this.service.setClusterName(this.formGroup.controls['name'].value);
      this.job = this.dataService.fetchCatalog(
        this.formGroup.controls['ra'].value,
        this.formGroup.controls['dec'].value,
        this.formGroup.controls['radius'].value,
        [this.formGroup.controls['catalog'].value]
      );
      this.job.complete$.subscribe((complete) => {
        this.loading = false;
      });
      this.dataService.sources$.subscribe((data) => {
        this.fetchData = data;
        this.filters = this.dataService.getFilters();
      });
    }
  }

  cancel() {
    this.job?.cancelJob();
    this.service.reset();
    this.dataService.reset();
  }
}
