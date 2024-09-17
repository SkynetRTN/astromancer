import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RcComponent} from './rc/rc.component';
import {RouterModule, Routes} from "@angular/router";


const routes: Routes = [
    {path: '', component: RcComponent, title: 'Radio Cartographer'}
];

@NgModule({
    declarations: [
        RcComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule
    ]
})
export class RcModule {
}
