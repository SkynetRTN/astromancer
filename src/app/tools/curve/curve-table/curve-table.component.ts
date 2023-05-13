import {Component} from '@angular/core';
import {CurveDataService} from "../../../service/curve-data.service";
import {CurveObservable} from "../../../model/curve.model";
import Handsontable from "handsontable";
import {HotTableRegisterer} from "@handsontable/angular";

@Component({
  selector: 'app-curve-table',
  templateUrl: './curve-table.component.html',
  styleUrls: ['./curve-table.component.scss']
})
export class CurveTableComponent implements CurveObservable {
  colNames: any;
  dataSet: any;
  id = "dataTable";
  private hotRegisterer = new HotTableRegisterer();

  constructor(private dataService: CurveDataService) {
    this.colNames = this.dataService.getDataKeys();
    this.dataSet = this.dataService.getData();
    this.dataService.addObserver(this);
  }

  public update(): void {
    this.colNames = this.dataService.getDataKeys();
    this.dataSet = this.dataService.getData();
    this.getTable().render();
  }

  private getTable(): Handsontable {
    return this.hotRegisterer.getInstance(this.id);
  }

  public onChange = (changes: any) => {
    changes?.forEach(([row, col, , newValue]: any[]) => {
      this.dataService.setDataByCell(newValue, row, col);
    });
  }

}
