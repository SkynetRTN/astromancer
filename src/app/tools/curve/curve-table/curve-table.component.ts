import {AfterViewInit, Component} from '@angular/core';
import {CurveService} from "../curve.service";
import {CurveDataDict} from "../../../model/curve.model";

@Component({
  selector: 'app-curve-table',
  templateUrl: './curve-table.component.html',
  styleUrls: ['./curve-table.component.scss']
})
export class CurveTableComponent implements AfterViewInit {
  colNames: any;
  dataSet: any;
  id = "dataTable";

  constructor(private dataService: CurveService, private service: CurveService) {
    this.colNames = this.dataService.getDataKeys();
    this.dataSet = this.dataService.getData();

  }

  ngAfterViewInit(): void {
    this.dataService.data$.subscribe(
      (data: CurveDataDict[]) => {
        this.dataSet = data;
        this.service.getTable().render();
      })
    this.dataService.dataKeys$.subscribe(
      (keys: string[]) => {
        this.colNames = keys;
        this.service.getTable().render();
      }
    )
  }

  public onChange = (changes: any) => {
    this.dataService.setDataByCellOnTableChange(changes);
  }

}
