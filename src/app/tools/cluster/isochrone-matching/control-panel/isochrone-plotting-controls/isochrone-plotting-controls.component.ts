import {Component} from '@angular/core';
import {ClusterService} from "../../../cluster.service";

@Component({
    selector: 'app-isochrone-plotting-controls',
    templateUrl: './isochrone-plotting-controls.component.html',
    styleUrls: ['./isochrone-plotting-controls.component.scss']
})
export class IsochronePlottingControlsComponent {
    defaultDistance: number = 0.1;

    constructor(private service: ClusterService) {
        this.updateDistance();
        this.service.fsrParams$.subscribe(() => {
            this.updateDistance();
        });

    }

    private updateDistance() {
        const distance = this.service.getFsrParams().distance
        if (distance) {
            this.defaultDistance = parseFloat(((distance.max + distance.min) / 2).toFixed(1));
        } else {
            this.defaultDistance = 0.1;
        }
    }

}
