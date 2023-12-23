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
  ra: number[];
  dec: number[];
  pmra!: range;
  pmdec!: range;
  distance!: range;
  filters!: string;
  catalogs = Object.values(Catalogs);
  maximumRadius: number = 0.5;
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
    this.ra = d2HMS(this.dataService.getClusterRa()!);
    this.dec = d2DMS(this.dataService.getClusterDec()!);
    this.pmra = this.service.getFsrParams().pmra!;
    this.pmdec = this.service.getFsrParams().pmdec!;
    this.distance = this.service.getFsrParams().distance!;
    this.filters = this.dataService.getFilters().join(', ');
    console.log(this.dataService.getClusterDec());
  }

  // TODO: cancel job on replacement
  close() {
  }

}
