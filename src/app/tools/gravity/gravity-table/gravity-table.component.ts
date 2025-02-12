import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {MyTable} from "../../shared/tables/table-interface";
import { StrainDataDict } from '../gravity.service.util';
import {Subject, takeUntil} from "rxjs";
import {MyData} from "../../shared/data/data.interface";
import {HotTableRegisterer} from "@handsontable/angular";
import Handsontable from "handsontable";
import {beforePaste} from "../../shared/tables/util";
import { StrainService } from '../gravity-strain.service';

@Component({
  selector: 'app-gravity-table',
  templateUrl: './gravity-table.component.html',
  styleUrls: ['./gravity-table.component.scss']
})
export class GravityTableComponent implements AfterViewInit, OnDestroy {
  id: string = "gravity-table";
  table: MyTable = new GravityTable(this.id);
  colNames: string[] = ["Time","Strain"];
  dataSet: StrainDataDict[];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private service: StrainService) {
    this.dataSet = this.service.getData();
  }

  ngAfterViewInit(): void {
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((data: MyData) => {
      this.dataSet = this.service.getData();
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
    return beforePaste(data, coords, this.table);
  }

  private limitPrecision(data: StrainDataDict[]): StrainDataDict[] {
    return data.map(
      (row: StrainDataDict) => {
        return {
          Time: row.Time ? parseFloat(row.Time.toFixed(4)) : row.Time,
          Strain: row.Strain ? parseFloat(row.Strain.toFixed(2)) : row.Strain,
        }
      }
    );
  }
}

class GravityTable implements MyTable {
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
