import {Component} from '@angular/core';
import {ClusterService} from "../../cluster.service";
import {range} from "../../FSR/histogram-slider-input/histogram-slider-input.component";
import {ClusterDataService} from "../../cluster-data.service";
import {d2DMS, d2HMS} from "../../../shared/data/utils";
import {Catalogs} from "../../cluster.util";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
  maximumRadius: number = 5;
  formGroup: FormGroup = new FormGroup({
    radius: new FormControl(this.maximumRadius,
      [Validators.min(0),
        Validators.max(this.maximumRadius), Validators.required]),
    catalogs: new FormControl('', Validators.required),
  });
  isRadiusValid: boolean = false;

  constructor(private service: ClusterService,
              private dataService: ClusterDataService) {
    this.name = this.service.getClusterName();
    this.ra = this.dataService.getClusterRa()!;
    this.display_ra = d2HMS(this.ra);
    this.dec = this.dataService.getClusterDec()!;
    this.display_dec = d2DMS(this.dec);
    this.pmra = this.service.getFsrParams().pm_ra!;
    this.pmdec = this.service.getFsrParams().pm_dec!;
    this.distance = this.service.getFsrParams().distance!;
    this.filters = this.dataService.getFilters().join(', ');
    console.log(this.dataService.getClusterDec());
  }

  // TODO: cancel job on replacement
  close() {
  }

  testRadius() {
    this.isRadiusValid = true;
  }

  fetchData() {
    this.dataService.fetchCatalogFetch(
      this.ra,
      this.dec,
      this.formGroup.controls['radius'].value,
      this.formGroup.controls['catalogs'].value
    )
  }
}
