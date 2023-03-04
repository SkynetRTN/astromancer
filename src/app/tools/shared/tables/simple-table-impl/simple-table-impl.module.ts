import {NgModule} from "@angular/core";
import {HotTableModule} from "@handsontable/angular";
import {SimpleTableImplComponent} from "./simple-table-impl.component";

@NgModule({
  imports: [HotTableModule],
  declarations: [SimpleTableImplComponent]
})
export class SimpleTableImplModule {
}
