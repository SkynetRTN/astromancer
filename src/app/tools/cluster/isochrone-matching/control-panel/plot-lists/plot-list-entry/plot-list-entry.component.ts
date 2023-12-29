import {Component, Input} from '@angular/core';
import {ClusterPlotType, PlotConfig} from "../../../../cluster.util";

@Component({
    selector: 'app-plot-list-entry',
    templateUrl: './plot-list-entry.component.html',
    styleUrls: ['./plot-list-entry.component.scss']
})
export class PlotListEntryComponent {
    @Input() plotConfig!: PlotConfig;

    plotTypes = Object.values(ClusterPlotType);
}
