import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ClusterLookUpData} from "../../cluster-data-source.service.util";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Catalogs} from "../../../cluster.util";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../../environments/environment";
import {ClusterDataService} from "../../../cluster-data.service";

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
      [Validators.required, Validators.min(0), Validators.max(5)]),
    catalog: new FormControl('', [Validators.required]),
  });
  loading: boolean = false;
  readyForNext: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ClusterLookUpData,
              private http: HttpClient,
              private dataService: ClusterDataService) {
  }

  testRadius() {
    if (this.formGroup.invalid) {
      return;
    }
    this.loading = true;
    this.readyForNext = false;
    this.http.post(`${environment.apiUrl}/cluster/catalog/test-radius`, {
      ra: this.formGroup.controls['ra'].value,
      dec: this.formGroup.controls['dec'].value,
      radius: this.formGroup.controls['radius'].value,
      catalogs: [this.formGroup.controls['catalog'].value],
    }).subscribe((res: any) => {
      this.loading = false;
      if (res) {
        this.readyForNext = true;
      }
    }, error => {
      this.loading = false;
    })
  }

  fetchCatalog() {
    this.loading = true;
    let job = this.dataService.fetchCatalogFetch(
      this.formGroup.controls['ra'].value,
      this.formGroup.controls['dec'].value,
      this.formGroup.controls['radius'].value,
      [this.formGroup.controls['catalog'].value]
    );
    job.complete$.subscribe((complete) => {
      this.loading = false;
    });
  }
}
