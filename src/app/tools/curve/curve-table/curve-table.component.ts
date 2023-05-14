import {Component} from '@angular/core';
import {CurveDataService} from "../../../service/curve-data.service";
import {CurveObservable} from "../../../model/curve.model";
import {CurveService} from "../../../service/curve.service";

@Component({
  selector: 'app-curve-table',
  templateUrl: './curve-table.component.html',
  styleUrls: ['./curve-table.component.scss']
})
export class CurveTableComponent implements CurveObservable {
  colNames: any;
  dataSet: any;
  id = "dataTable";

  constructor(private dataService: CurveDataService, private service: CurveService) {
    this.colNames = this.dataService.getDataKeys();
    this.dataSet = this.dataService.getData();
    this.dataService.addObserver(this);
  }

  public update(): void {
    this.colNames = this.dataService.getDataKeys();
    this.dataSet = this.dataService.getData();
    this.service.getTable().render();
  }

  public onChange = (changes: any) => {
    changes?.forEach(([row, col, , newValue]: any[]) => {
      this.dataService.setDataByCell(newValue, row, col);
    });
  }

}
