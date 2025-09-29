import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {MyTable} from "../../shared/tables/table-interface";
import {GalaxyDataDict} from "../../galaxy/galaxy.service.util";
import {Subject, takeUntil} from "rxjs";
import {GalaxyService} from "../../galaxy/galaxy.service";
import {MyData} from "../../shared/data/data.interface";
import {HotTableRegisterer} from "@handsontable/angular";
import Handsontable from "handsontable";
import {beforePaste} from "../../shared/tables/util";

@Component({
  selector: 'app-galaxy-table',
  templateUrl: './galaxy-table.component.html',
  styleUrls: ['./galaxy-table.component.scss']
})
export class GalaxyTableComponent implements AfterViewInit, OnDestroy {
  id: string = "galaxy-table";
  table: MyTable = new GalaxyTable(this.id);
  colNames: string[] = ["Frequency", "Channel 1", "Channel 2"];
  dataSet: GalaxyDataDict[];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private service: GalaxyService) {
    this.dataSet = this.service.getData();
  }

  ngAfterViewInit(): void {
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((data: MyData) => {
      this.dataSet = this.limitPrecision(this.service.getData());
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

  private limitPrecision(data: GalaxyDataDict[]): GalaxyDataDict[] {
    return data.map(
      (row: GalaxyDataDict) => {
        return {
          frequency: row.frequency ? parseFloat(row.frequency.toFixed(4)) : row.frequency,
          channel1: row.channel1 ? parseFloat(row.channel1.toFixed(2)) : row.channel1,
          channel2: row.channel2 ? parseFloat(row.channel2.toFixed(2)) : row.channel2,
        }
      }
    );
  }
}

class GalaxyTable implements MyTable {
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
