import {Injectable} from "@angular/core";
import {HotTableRegisterer} from "@handsontable/angular";
import Handsontable from "handsontable";
import {CurveDataService} from "./curve-data.service";

@Injectable()
export class CurveService {
  id = "dataTable";
  private hotRegisterer = new HotTableRegisterer();

  constructor(private dataService: CurveDataService) {
  }

  public getTable(): Handsontable {
    return this.hotRegisterer.getInstance(this.id);
  }

}
