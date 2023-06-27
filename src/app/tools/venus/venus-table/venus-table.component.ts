import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {VenusService} from "../venus.service";
import {Subject, takeUntil} from "rxjs";
import {VenusDataDict} from "../venus.service.util";
import {MyTable} from "../../shared/tables/table-interface";
import {HotTableRegisterer} from "@handsontable/angular";
import Handsontable from "handsontable";

//TODO: Table Inconsistency with add-row
@Component({
  selector: 'app-venus-table',
  templateUrl: './venus-table.component.html',
  styleUrls: ['./venus-table.component.scss']
})
export class VenusTableComponent implements AfterViewInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  protected id: string = "moon-table";
  private table: VenusTable = new VenusTable(this.id);
  protected colNames: string[] = ["Angular Diameter", "Phase of Venus"];
  protected data: VenusDataDict[];


  constructor(private service: VenusService) {
    this.data = this.service.getData();
  }

  ngAfterViewInit(): void {
    this.service.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      () => {
        this.data = this.service.getData();
        this.table.getTable().loadData(this.data);
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
    // this.service.addRow(index, amount);
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

