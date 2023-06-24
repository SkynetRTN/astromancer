import {NgModule} from "@angular/core";
import {MoonComponent} from "./moon.component";
import {SimpleDataButtonModule} from "../../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../../shared/simple-graph-button/simple-graph-button.component";
import {MoonTableComponent} from "../moon-table/moon-table.component";
import {HotTableModule} from "@handsontable/angular";
import {MoonService} from "../moon.service";

@NgModule({
  declarations: [
    MoonComponent,
    MoonTableComponent],
  imports: [
    SimpleDataButtonModule,
    SimpleGraphButtonModule,
    HotTableModule
  ],
  providers: [MoonService],
})
export class MoonModule {
}
