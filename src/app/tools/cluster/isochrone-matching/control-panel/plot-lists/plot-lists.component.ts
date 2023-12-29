import {Component} from '@angular/core';
import {ClusterPlotType, FILTER, PlotConfig} from "../../../cluster.util";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
    selector: 'app-plot-lists',
    templateUrl: './plot-lists.component.html',
    styleUrls: ['./plot-lists.component.scss'],
})
export class PlotListsComponent {
    plotTypes = Object.values(ClusterPlotType);
    plotConfigs: PlotConfig[] = [
        {
            filters: {
                blue: FILTER.B,
                red: FILTER.V,
                lum: FILTER.V,
            },
            plotType: ClusterPlotType.CM,
        },
        {
            filters: {
                blue: FILTER.W1,
                red: FILTER.W2,
                lum: FILTER.W1,
            },
            plotType: ClusterPlotType.HR,
        },
    ]

    constructor() {
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.plotConfigs, event.previousIndex, event.currentIndex);
    }


}
