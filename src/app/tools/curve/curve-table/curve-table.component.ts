import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {CurveService} from "../curve.service";

import {CurveDataDict} from "../curve.service.util";
import {MyTable} from "../../shared/tables/table-interface";
import Handsontable from "handsontable";
import {HotTableRegisterer} from "@handsontable/angular";
import {Subject, takeUntil} from 'rxjs';
import {beforePaste} from "../../shared/tables/util";

@Component({
  selector: 'app-curve-table',
  templateUrl: './curve-table.component.html',
  styleUrls: ['./curve-table.component.scss']
})
export class CurveTableComponent implements AfterViewInit, OnDestroy {
  colNames: any;
  dataSet: any;
  id: string = "curve-table";
  table: CurveTable = new CurveTable(this.id);
  private destroy$: Subject<any> = new Subject<any>();

  constructor(private dataService: CurveService) {
    this.colNames = this.dataService.getDataLabelArray();
    this.dataSet = this.dataService.getData();
  }

  ngAfterViewInit(): void {
    this.dataService.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (data: CurveDataDict[]) => {
        this.dataSet = this.dataService.getData();
        this.table.renderTable();
      });
    this.dataService.dataKeys$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (keys: string[]) => {
        this.colNames = keys;
        this.table.renderTable();
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  public onChange = (changes: any, source: any) => {
    if (changes) {
      this.dataService.setData(this.table.getData());
    }
  }

  public onRemove = (index: number, amount: number) => {
    this.dataService.removeRow(index, amount);
  }

  public onInsert = (index: number, amount: number) => {
    this.dataService.addRow(index, amount);
  }

  public beforePaste = (data: any[], coords: any) => {
    return beforePaste(data, coords, this.table);
  }
}


class CurveTable implements MyTable {
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
