import {Component} from '@angular/core';
import {ClusterIsochroneService} from "../../cluster-isochrone.service";

@Component({
    selector: 'app-cluster-plot-grid',
    templateUrl: './cluster-plot-grid.component.html',
    styleUrls: ['./cluster-plot-grid.component.scss']
})
export class ClusterPlotGridComponent {
    gridNumber = this.isochroneService.getPlotConfigs().length;
    plotConfigs = this.isochroneService.getPlotConfigs();

    constructor(private isochroneService: ClusterIsochroneService) {
        this.isochroneService.plotConfig$.subscribe(() => {
            this.plotConfigs = this.isochroneService.getPlotConfigs();
            this.gridNumber = this.isochroneService.getPlotConfigs().length;
            console.log(this.gridNumber);
        })
    }
}
