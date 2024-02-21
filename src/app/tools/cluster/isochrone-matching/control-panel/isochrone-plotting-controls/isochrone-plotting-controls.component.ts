import {Component} from '@angular/core';
import {ClusterService} from "../../../cluster.service";
import {ClusterIsochroneService} from "../../cluster-isochrone.service";
import {InputSliderValue} from "../../../../shared/interface/input-slider/input-slider.component";
import {skip, Subject, take} from "rxjs";
import {range} from "../../../FSR/histogram-slider-input/histogram-slider-input.component";
import {ClusterDataService} from "../../../cluster-data.service";
import {FsrParameters} from "../../../FSR/fsr.util";


@Component({
  selector: 'app-isochrone-plotting-controls',
  templateUrl: './isochrone-plotting-controls.component.html',
  styleUrls: ['./isochrone-plotting-controls.component.scss']
})
export class IsochronePlottingControlsComponent {
  distance!: number;
  defaultDistance: number = 0.1;
  fsrDistance: number = 0.1;
  distanceRange$: Subject<range> = new Subject<range>();
  distance$: Subject<number> = new Subject<number>();
  age!: number;
  metallicity!: number;
  reddening!: number;
  maxMagError!: number;

  constructor(private service: ClusterService,
              private dataService: ClusterDataService,
              private isochroneService: ClusterIsochroneService) {
    this.init();
    this.service.tabIndex$.subscribe(
      (index) => {
        if (index === 3) {
          this.init();
          this.assignDistance(this.service.getFsrParams());
        }
      });
    this.service.fsrParams$.pipe(
      skip(2),
      take(1)
    ).subscribe(
      (params) => {
        this.assignDistance(params);
      }
    );
  }

  init() {
    // this.isochroneService.resetDistance();
    const isochroneParams = this.isochroneService.getIsochroneParams();
    this.age = isochroneParams.age ?? 6.60;
    this.metallicity = isochroneParams.metallicity ?? -2.2;
    const plotParams = this.isochroneService.getPlotParams();
    this.reddening = plotParams.reddening ?? 0;
    this.defaultDistance = plotParams.distance ?? 0.1;
    this.maxMagError = this.isochroneService.getMaxMagError() ?? 0;
    this.updatePlotParams();
    this.updateIsochroneParams();
  }

  onDistanceChange($event: InputSliderValue) {
    this.distance = $event.value;
    this.updatePlotParams();
  }

  onAgeChange($event: InputSliderValue) {
    this.age = $event.value;
    this.updateIsochroneParams();
  }

  onMetallicityChange($event: InputSliderValue) {
    this.metallicity = $event.value;
    this.updateIsochroneParams();
  }

  onReddeningChange($event: InputSliderValue) {
    this.reddening = $event.value;
    this.updatePlotParams();
  }

  onMaxMagErrorChange($event: InputSliderValue) {
    this.maxMagError = $event.value;
    this.isochroneService.setMaxMagError(this.maxMagError);
  }

  private updatePlotParams() {
    this.isochroneService.setPlotParams({
      distance: this.distance,
      reddening: this.reddening,
    });
  }

  private updateIsochroneParams() {
    this.isochroneService.setIsochroneParams({
      age: this.age,
      metallicity: this.metallicity,
    });
  }

  private assignDistance(fsrParameters: FsrParameters) {
    const range = {min: 0.1, max: 100};
    if (fsrParameters.distance && fsrParameters.distance.min < fsrParameters.distance.max) {
      if (fsrParameters.distance.min > 0.1) {
        range.min = fsrParameters.distance.min;
      }
      range.max = fsrParameters.distance.max;
    }
    this.distanceRange$.next(fsrParameters.distance!);
    const distances = this.dataService.getDistance();
    this.fsrDistance = distances[Math.floor((distances.length - 1) / 2)];
    this.updatePlotParams();
  }
}
