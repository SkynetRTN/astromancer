import {AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Injector, OnInit} from '@angular/core';
import {SimpleTable, SimpleTableInitArgs} from "../simpleTable";
import Handsontable from "handsontable";
import {HotTableRegisterer} from "@handsontable/angular";

@Component({
  selector: 'app-simple-table-impl',
  templateUrl: './simple-table-impl.component.html',
  styleUrls: ['./simple-table-impl.component.css'],
})
export class SimpleTableImplComponent implements OnInit, AfterViewChecked, SimpleTable {
  id = "dataTable";
  dataSet!: any[];
  height!: number;
  colNames!: string []
  defaultArgs: SimpleTableInitArgs;
  tableColObserver$: EventEmitter<number>;
  private hotRegisterer = new HotTableRegisterer();

  constructor(args: Injector, private cdref: ChangeDetectorRef) {
    this.defaultArgs = args.get('tableArgs');
    this.tableColObserver$ = args.get('tableColObserver$');
    this.tableColObserver$.subscribe((value) => {
      console.log(value)
    });
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.loadDefault(this.defaultArgs);
    this.cdref.detectChanges();
  }

  loadDefault(args: SimpleTableInitArgs) {
    this.dataSet = args.data;
    this.height = args.height;
    this.hideCol(args.hiddenCols);
    this.colNames = this.initGetColNames();
  }

  addRow(): void {
    this.getTable().alter('insert_row');
  }

  getColNames(): (string | number)[] {
    return this.getTable().getColHeader();
  }

  hideCol(colIndex: number | number[]): void {
    let cols: number[] = [];
    if (typeof colIndex == 'number') {
      cols.push(colIndex);
    } else {
      cols = colIndex;
    }
    for (let col of cols) {
      const plugin = this.getTable().getPlugin('hiddenColumns');
      plugin.hideColumn(col);
    }
    this.getTable().render();
  }

  removeCol(colIndex: number): void {
    this.getTable().alter("remove_col", colIndex);
    this.getTable().render();
  }

  showCol(colIndex: number): void {
    const plugin = this.getTable().getPlugin('hiddenColumns');
    plugin.showColumn(colIndex);
    this.getTable().render();
  }

  private initGetColNames(): string[] {
    return Object.keys(this.dataSet[0]);
  }

  private getTable(): Handsontable {
    return this.hotRegisterer.getInstance(this.id);
  }

}
