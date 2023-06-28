import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {VenusService} from "../venus.service";
import {Subject, takeUntil} from "rxjs";
import {VenusDataDict} from "../venus.service.util";
import {MyTable} from "../../shared/tables/table-interface";
import {HotTableRegisterer} from "@handsontable/angular";
import Handsontable from "handsontable";

@Component({
  selector: 'app-venus-table',
  templateUrl: './venus-table.component.html',
  styleUrls: ['./venus-table.component.scss']
})
export class VenusTableComponent implements AfterViewInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  id: string = "moon-table";
  table: VenusTable = new VenusTable(this.id);
  colNames: string[] = ["Angular Diameter", "Phase of Venus"];
  dataSet: VenusDataDict[];


  constructor(private service: VenusService) {
    this.dataSet = this.service.getData();
  }

  ngAfterViewInit(): void {
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      () => {
        this.dataSet = this.service.getData();
        this.table.getTable().loadData(this.dataSet);
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
    // this.service.setData(this.table.getData());
  }

  public onInsert = (index: number, amount: number) => {
    // this.service.addRow(index, amount);
    this.service.setData(this.table.getData());
  }
}

class VenusTable implements MyTable {
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

