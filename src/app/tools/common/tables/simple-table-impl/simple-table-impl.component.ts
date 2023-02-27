import {Component, Injector, Input, OnInit} from '@angular/core';
import {SimpleTable} from "../simpleTable";
import Handsontable from "handsontable";
import {HotTableRegisterer} from "@handsontable/angular";

export interface SimpleTableImplArgs {
  data: any[];
  height: number;
}

@Component({
  selector: 'app-simple-table-impl',
  templateUrl: './simple-table-impl.component.html',
  styleUrls: ['./simple-table-impl.component.css'],
})
export class SimpleTableImplComponent implements OnInit, SimpleTable {
  id = "dataTable";
  dataSet!: any[];
  height!: number;
  dataTable: any;
  @Input() sussy!: string;
  private hotRegisterer = new HotTableRegisterer();

  constructor(args: Injector) {
    this.loadDefault(args.get('tableArgs'))
  }

  ngOnInit() {
  }

  loadDefault(args: SimpleTableImplArgs) {
    this.dataSet = args.data;
    this.height = args.height;
  }

  addRow(): void {
    this.getTable().alter('insert_row');
  }

  getCols(): (string | number)[] {
    return this.getTable().getColHeader();
  }

  hideCol(colIndex: number): void {
    const plugin = this.getTable().getPlugin('hiddenColumns');
    plugin.hideColumn(colIndex);
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

  getTable(): Handsontable {
    return this.hotRegisterer.getInstance(this.id);
  }

}
