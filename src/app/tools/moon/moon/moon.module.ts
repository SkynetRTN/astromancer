import {NgModule} from "@angular/core";
import {MoonComponent} from "./moon.component";
import {SimpleDataButtonModule} from "../../shared/simple-data-button/simple-data-button.component";
import {SimpleGraphButtonModule} from "../../shared/simple-graph-button/simple-graph-button.component";

@NgModule({
  declarations: [MoonComponent],
  imports: [
    SimpleDataButtonModule,
    SimpleGraphButtonModule
  ]
})
export class MoonModule {
}
