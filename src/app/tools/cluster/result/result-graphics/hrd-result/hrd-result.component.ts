import {Component} from '@angular/core';
import {ClusterPlotType, FILTER, PlotConfig, PlotFraming} from "../../../cluster.util";
import {ClusterDataService} from "../../../cluster-data.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {filterValidator} from "../../../isochrone-matching/control-panel/filter-selector/filter-selector.component";
import {ClusterService} from "../../../cluster.service";

@Component({
    selector: 'app-hrd-result',
    templateUrl: './hrd-result.component.html',
    styleUrls: ['./hrd-result.component.scss', '../result-graphics/result-graphics.component.scss']
})
export class HrdResultComponent {
    filters!: FILTER[];
    plotConfig: PlotConfig | null = null;
    filterFormGroup: FormGroup = new FormGroup({
        blue: new FormControl("", [Validators.required]),
        red: new FormControl("", [Validators.required]),
        lum: new FormControl("", [Validators.required]),
    }, {validators: filterValidator});

    constructor(private service: ClusterService, private dataService: ClusterDataService) {
        this.dataService.sources$.subscribe(() => {
            this.filters = this.dataService.getFilters();
        });
        this.service.reset$.subscribe(() => {
            this.filterFormGroup.reset();
            this.plotConfig = null;
        });
    }

    plot() {
        this.plotConfig = {
            filters: {
                blue: this.filterFormGroup.get("blue")?.value,
                red: this.filterFormGroup.get("red")?.value,
                lum: this.filterFormGroup.get("lum")?.value,
            },
            plotType: ClusterPlotType.HR,
            plotFraming: PlotFraming.DATA,
        }
    }
}
