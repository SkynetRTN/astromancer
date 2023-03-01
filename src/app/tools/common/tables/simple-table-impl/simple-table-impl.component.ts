import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  OnInit
} from '@angular/core';
import {SimpleTable, SimpleTableInitArgs} from "../simpleTable";
import Handsontable from "handsontable";
import {HotTableRegisterer} from "@handsontable/angular";
import {TableAction} from "../../types/actions";

@Component({
  selector: 'app-simple-table-impl',
  templateUrl: './simple-table-impl.component.html',
  styleUrls: ['./simple-table-impl.component.css'],
})
export class SimpleTableImplComponent implements OnInit, AfterViewInit, SimpleTable {
  id = "dataTable";
  dataSet!: any[];
  colNames!: string []
  defaultArgs: SimpleTableInitArgs;
  tableUpdateObs$: EventEmitter<any>;
  private hotRegisterer = new HotTableRegisterer();
  constructor(args: Injector, private cdref: ChangeDetectorRef) {
    this.defaultArgs = args.get('tableArgs');
    this.tableUpdateObs$ = args.get('tableUpdateObs$');
    this.tableUpdateObs$.subscribe((actions: TableAction[]) => {
      for (let action of actions){
        if (action.action == "showCols"){
          this.showCol(action.payload);
        } else if (action.action == "hideCols"){
          this.hideCol(action.payload);
        } else if (action.action == "addRow"){
          this.addRow();
        }
      }
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadDefault(this.defaultArgs);
    this.cdref.detectChanges();
  }

  loadDefault(args: SimpleTableInitArgs) {
    this.dataSet = args.data;
    this.hideCol(args.hiddenCols);
    this.colNames = this.initGetColNames();
    this.getTable().render();
  }

  addRow(): void {
    this.getTable().alter('insert_row_below');
  }

  getColNames(): (string | number)[] {
    return this.getTable().getColHeader();
  }

  hideCol(colIndex: number | number[]): void {
    const plugin = this.getTable().getPlugin('hiddenColumns');
    if (typeof colIndex == 'number') {
      plugin.hideColumn(colIndex);
    } else {
      plugin.hideColumns(colIndex);
    }
    this.getTable().render();
  }

  removeCol(colIndex: number): void {
    this.getTable().alter("remove_col", colIndex);
    this.getTable().render();
  }

  showCol(colIndex: number | number[]): void {
    const plugin = this.getTable().getPlugin('hiddenColumns');
    if (typeof colIndex == 'number') {
      plugin.showColumn(colIndex);
    } else {
      plugin.showColumns(colIndex);
    }
    this.getTable().render();
  }

  private initGetColNames(): string[] {
    return Object.keys(this.dataSet[0]);
  }

  private getTable(): Handsontable {
    return this.hotRegisterer.getInstance(this.id);
  }

}
