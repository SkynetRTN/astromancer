import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {ScatterService} from "../scatter.service";
import {Subject, takeUntil} from "rxjs";
import {MyTable} from "../../shared/tables/table-interface";
import {HotTableRegisterer} from "@handsontable/angular";
import Handsontable from "handsontable";
import {ScatterDataDict} from "../scatter.service.util";
import {MyData} from "../../shared/data/data.interface";
import {beforePaste} from "../../shared/tables/util";

@Component({
  selector: 'app-scatter-table',
  templateUrl: './scatter-table.component.html',
  styleUrls: ['./scatter-table.component.scss']
})
export class ScatterTableComponent implements AfterViewInit, OnDestroy {
  static FLOAT_PRECISION: number = 2;
  id: string = "scatter-table";
  table: MyTable = new ScatterTable(this.id);
  colNames: string[] = ["Longitude", "Latitude", "Distance"];
  dataSet: ScatterDataDict[];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private service: ScatterService) {
    this.dataSet = this.service.getData();
  }

  ngAfterViewInit(): void {
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((data: MyData) => {
      this.dataSet = this.limitPrecision(this.service.getData(), ScatterTableComponent.FLOAT_PRECISION);
      this.table.renderTable();
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onChange = (changes: any, source: any) => {
    if (changes) {
      this.service.setData(this.table.getData());
    }
  }

  public onRemove = (index: number, amount: number) => {
    this.service.removeRow(index, amount);
  }

  public onInsert = (index: number, amount: number) => {
    this.service.addRow(index, amount);
  }

  public beforePaste = (data: any[], coords: any) => {
    beforePaste(data, coords, this.table);
  }

  private limitPrecision(data: ScatterDataDict[], precision: number): ScatterDataDict[] {
    return data.map(
      (row: ScatterDataDict) => {
        return {
          longitude: row.longitude ? parseFloat(row.longitude.toFixed(precision)) : row.longitude,
          latitude: row.latitude ? parseFloat(row.latitude.toFixed(precision)) : row.latitude,
          distance: row.distance ? parseFloat(row.distance.toFixed(precision)) : row.distance,
        }
      }
    );
  }
}

class ScatterTable implements MyTable {
  private readonly id: string;
  private hotRegisterer = new HotTableRegisterer();

  constructor(id: string) {
    this.id = id;
  }

  getTable(): Handsontable {
    return this.hotRegisterer.getInstance(this.id);
  }

  renderTable(): void {
    this.getTable().render();
  }

  getData(): any[] {
    return this.getTable().getSourceData();
  }

}
