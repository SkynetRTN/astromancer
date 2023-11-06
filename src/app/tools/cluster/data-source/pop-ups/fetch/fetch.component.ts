import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ClusterLookUpData} from "../../cluster-data-source.service.util";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Catalogs} from "../../../cluster.util";

@Component({
  selector: 'app-fetch',
  templateUrl: './fetch.component.html',
  styleUrls: ['./fetch.component.scss', '../cluster-data-source-pop-ups.scss']
})
export class FetchComponent {
  public catalogs = Object.values(Catalogs);
  public formGroup: FormGroup = new FormGroup({
    ra: new FormControl(this.data.ra,
      [Validators.required, Validators.min(0), Validators.max(360)]),
    dec: new FormControl(this.data.dec,
      [Validators.required, Validators.min(-90), Validators.max(90)]),
    radius: new FormControl(this.data.radius,
      [Validators.required, Validators.min(0), Validators.max(1)]),
    catalog: new FormControl('', [Validators.required]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ClusterLookUpData) {
  }
}
