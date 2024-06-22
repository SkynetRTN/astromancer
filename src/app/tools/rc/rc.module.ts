import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from "@angular/material/form-field";
import {RcComponent} from './rc/rc.component';
import {RcService} from "./rc.service";
import {RouterModule, Routes} from "@angular/router";
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
const routes: Routes = [
    {path: '', component: RcComponent, title: 'Radio Cartographer'}
];

@NgModule({
    declarations: [
        RcComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
    ],
    exports: [RcComponent, RouterModule],
    providers: [RcService]
})
export class RcModule {
}
