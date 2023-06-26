import {NgModule} from '@angular/core';
import {VenusComponent} from './venus/venus.component';
import {SimpleDataButtonModule} from "../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../shared/simple-graph-button/simple-graph-button.component";


@NgModule({
  declarations: [
    VenusComponent
  ],
  imports: [
    SimpleDataButtonModule,
    SimpleGraphButtonModule
  ]
})
export class VenusModule { }
