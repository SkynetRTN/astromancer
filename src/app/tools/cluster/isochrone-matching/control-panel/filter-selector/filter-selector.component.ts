import {Component} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {ClusterDataService} from "../../../cluster-data.service";
import {ClusterIsochroneService} from "../../cluster-isochrone.service";
import {ClusterPlotType, PlotConfig, PlotFraming} from "../../../cluster.util";

@Component({
    selector: 'app-filter-selector',
    templateUrl: './filter-selector.component.html',
    styleUrls: ['./filter-selector.component.scss']
})
export class FilterSelectorComponent {
    filters: string[] = this.dataService.getFilters();
    plotConfigs: PlotConfig[] = this.isochroneService.getPlotConfigs();

    filterSelectionFormGroup: FormGroup = new FormGroup(
        {
            blue: new FormControl("", Validators.required),
            red: new FormControl("", Validators.required),
            lum: new FormControl("", Validators.required),
        },
        {validators: filterValidator});


    constructor(private dataService: ClusterDataService,
                private isochroneService: ClusterIsochroneService) {
        this.dataService.sources$.subscribe(
            () => {
                this.filters = this.dataService.getFilters();
            });
    }

    add() {
        if (this.filterSelectionFormGroup.valid && this.isochroneService.getPlotConfigs().length < 4) {
            this.isochroneService.addPlotConfigs({
                filters: this.filterSelectionFormGroup.value,
                plotType: ClusterPlotType.HR,
                plotFraming: PlotFraming.STANDARD,
            });
            this.plotConfigs = this.isochroneService.getPlotConfigs();
            this.filterSelectionFormGroup.reset();
        }
    }
}

export const filterValidator: ValidatorFn = (control: AbstractControl) => {
    return control.value.blue !== control.value.red ? null : {filter: true};
}
