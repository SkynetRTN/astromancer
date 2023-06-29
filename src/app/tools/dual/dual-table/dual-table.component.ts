import {Component} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {DualDataDict} from "../dual.service.util";
import {DualService} from "../dual.service";
import {MyTable} from "../../shared/tables/table-interface";
import {HotTableRegisterer} from "@handsontable/angular";
import Handsontable from "handsontable";

@Component({
  selector: 'app-dual-table',
  templateUrl: './dual-table.component.html',
  styleUrls: ['./dual-table.component.scss']
})
export class DualTableComponent {
  id: string = "moon-table";
  table: DualTable = new DualTable(this.id);
  colNames: string[] = ["x1", "y1", "x2", "y2"];
  dataSet: DualDataDict[];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private service: DualService) {
    this.dataSet = this.service.getData();
  }

  ngAfterViewInit(): void {
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      () => {
        this.dataSet = this.limitPrecision(this.service.getData(), 2);
        this.table.renderTable();
      }
    )
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

  private limitPrecision(data: DualDataDict[], precision: number): DualDataDict[] {
    return data.map(
      (row: DualDataDict) => {
        return {
          x1: row.x1 ? parseFloat(row.x1.toFixed(precision)) : row.x1,
          y1: row.y1 ? parseFloat(row.y1.toFixed(precision)) : row.y1,
          x2: row.x2 ? parseFloat(row.x2.toFixed(precision)) : row.x2,
          y2: row.y2 ? parseFloat(row.y2.toFixed(precision)) : row.y2,

        }
      }
    );
  }
}

class DualTable implements MyTable {
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
