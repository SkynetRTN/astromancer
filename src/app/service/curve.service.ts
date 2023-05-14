import {Injectable} from "@angular/core";
import {HotTableRegisterer} from "@handsontable/angular";
import Handsontable from "handsontable";

@Injectable()
export class CurveService {
  id = "dataTable";
  private hotRegisterer = new HotTableRegisterer();

  public getTable(): Handsontable {
    return this.hotRegisterer.getInstance(this.id);
  }
}
