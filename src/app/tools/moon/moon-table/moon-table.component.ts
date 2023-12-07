import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {MoonService} from "../moon.service";
import {MoonDataDict} from "../moon.service.util";
import {MyTable} from "../../shared/tables/table-interface";
import {HotTableRegisterer} from "@handsontable/angular";
import Handsontable from "handsontable";
import {Subject, takeUntil} from "rxjs";
import {beforePaste} from "../../shared/tables/util";

@Component({
  selector: 'app-moon-table',
  templateUrl: './moon-table.component.html',
  styleUrls: ['./moon-table.component.scss']
})
export class MoonTableComponent implements AfterViewInit, OnDestroy {
  static FLOAT_PRECISION: number = 2;
  id: string = "moon-table";
  table: MoonTable = new MoonTable(this.id);
  colNames: string[] = ["Julian Date", "Angular Separation"];
  dataSet: any;
  private destroy$: Subject<any> = new Subject<any>();

  constructor(private service: MoonService) {
    this.dataSet = this.limitPrecision(this.service.getData(), MoonTableComponent.FLOAT_PRECISION);

  }

  ngAfterViewInit(): void {
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((data: MoonDataDict[]) => {
      this.dataSet = this.limitPrecision(this.service.getData(), MoonTableComponent.FLOAT_PRECISION);
      this.table.renderTable();
    })
  }

  ngOnDestroy() {
    this.destroy$.next(null);
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
    return beforePaste(data, coords, this.table);
  }

  private limitPrecision(data: MoonDataDict[], precision: number): MoonDataDict[] {
    return data.map(
      (row: MoonDataDict) => {
        return {
          julianDate: row.julianDate ? parseFloat(row.julianDate.toFixed(precision)) : row.julianDate,
          angularSeparation: row.angularSeparation ? parseFloat(row.angularSeparation.toFixed(precision)) : row.angularSeparation
        }
      }
    );
  }

}

class MoonTable implements MyTable {
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
