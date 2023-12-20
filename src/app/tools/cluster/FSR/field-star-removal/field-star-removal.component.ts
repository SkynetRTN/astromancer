import {Component} from '@angular/core';
import {range} from "../histogram-slider-input/histogram-slider-input.component";
import {ClusterDataService} from "../../cluster-data.service";
import {Subject} from "rxjs";
import {FsrComponents} from "../fsr.util";
import {ClusterService} from "../../cluster.service";

@Component({
  selector: 'app-field-star-removal',
  templateUrl: './field-star-removal.component.html',
  styleUrls: ['./field-star-removal.component.scss', '../../../shared/interface/tools.scss']
})
export class FieldStarRemovalComponent {
  distanceParams: FsrComponents = {
    bin: 0,
    range: {min: 0, max: 0},
    histogramRange: {min: 0, max: 0}
  }

  pmraParams: FsrComponents = {
    bin: 0,
    range: {min: 0, max: 0},
    histogramRange: {min: 0, max: 0}
  }

  pmdecParams: FsrComponents = {
    bin: 0,
    range: {min: 0, max: 0},
    histogramRange: {min: 0, max: 0}
  }

  $pmra: Subject<{ data: number[], isNew: boolean }> = new Subject<{ data: number[], isNew: boolean }>;
  pmraInitData: number[] = this.dataService.getPmra();
  $pmdec: Subject<{ data: number[], isNew: boolean }> = new Subject<{ data: number[], isNew: boolean }>;
  pmdecInitData: number[] = this.dataService.getPmdec();
  $distance: Subject<{ data: number[], isNew: boolean }> = new Subject<{ data: number[], isNew: boolean }>;
  distanceInitData: number[] = this.dataService.getDistance();

  constructor(private service: ClusterService,
              public dataService: ClusterDataService) {
    this.dataService.data$.subscribe(
      () => {
        this.dataService.setFSRCriteria({
          distance: null,
          pmra: null,
          pmdec: null
        });
        this.$distance.next({data: this.dataService.getDistance(), isNew: true});
        this.$pmra.next({data: this.dataService.getPmra(), isNew: true});
        this.$pmdec.next({data: this.dataService.getPmdec(), isNew: true});
      });
    this.dataService.fsrFiltered$.subscribe(
      (data) => {
        this.$pmra.next({data: this.dataService.getPmra(), isNew: false});
        this.$pmdec.next({data: this.dataService.getPmdec(), isNew: false});
        this.$distance.next({data: this.dataService.getDistance(), isNew: false});
      });
  }

  distanceRangeHandler($event: range) {
    this.distanceParams.range = $event;
    this.setFSRParams();
  }

  distanceBinsHandler($event: number) {
  }

  distanceHistogramRangeHandler($event: range) {
    this.distanceParams.histogramRange = $event;
    this.setFSRFraming();
  }

  pmraRangeHandler($event: range) {
    this.pmraParams.range = $event;
    this.setFSRParams();
  }

  pmraBinsHandler($event: number) {
    // this.setFSRParams()
  }

  pmraHistogramRangeHandler($event: range) {
    this.pmraParams.histogramRange = $event;
    this.setFSRFraming();
  }

  pmdecRangeHandler($event: range) {
    this.pmdecParams.range = $event;
    this.setFSRParams();
  }

  pmdecBinsHandler($event: number) {
    // this.setFSRParams()
  }

  pmdecHistogramRangeHandler($event: range) {
    this.pmdecParams.histogramRange = $event;
    this.setFSRFraming();
  }

  pmraInit() {
    this.$pmra.next({data: this.dataService.getPmra(), isNew: true});
  }

  pmdecInit() {
    this.$pmdec.next({data: this.dataService.getPmdec(), isNew: true});
  }

  distanceInit() {
    this.$distance.next({data: this.dataService.getDistance(), isNew: true});
  }

  private setFSRParams() {
    this.service.setFsrParams({
      distance: this.distanceParams.range,
      pmra: this.pmraParams.range,
      pmdec: this.pmdecParams.range,
    });
    this.dataService.setFSRCriteria({
      distance: this.distanceParams.range,
      pmra: this.pmraParams.range,
      pmdec: this.pmdecParams.range
    });
  }

  private setFSRFraming() {
    this.service.setFsrFraming({
      distance: this.distanceParams.histogramRange,
      pmra: this.pmraParams.histogramRange,
      pmdec: this.pmdecParams.histogramRange
    });
  }
}

