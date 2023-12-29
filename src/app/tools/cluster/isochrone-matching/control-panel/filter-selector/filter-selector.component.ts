import {Component} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {ClusterDataService} from "../../../cluster-data.service";

@Component({
    selector: 'app-filter-selector',
    templateUrl: './filter-selector.component.html',
    styleUrls: ['./filter-selector.component.scss']
})
export class FilterSelectorComponent {
    filters: string[] = this.dataService.getFilters();

    filterSelectionFormGroup: FormGroup = new FormGroup(
        {
            blue: new FormControl("", Validators.required),
            red: new FormControl("", Validators.required),
            lum: new FormControl("", Validators.required),
        },
        {validators: filterValidator});


    constructor(private dataService: ClusterDataService) {
        this.dataService.sources$.subscribe(
            (sources) => {
                this.filters = this.dataService.getFilters();
            });
    }
}

const filterValidator: ValidatorFn = (control: AbstractControl) => {
    return control.value.blue !== control.value.red ? null : {filter: true};
}
