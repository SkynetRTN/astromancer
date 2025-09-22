import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PulsarService } from '../../pulsar.service';
import { PulsarDataDict } from '../../pulsar.service.util';
import { MyTable } from '../../../shared/tables/table-interface';
import { HotTableRegisterer } from '@handsontable/angular';
import Handsontable from 'handsontable';
import { beforePaste } from '../../../shared/tables/util';

@Component({
  selector: 'app-pulsar-table',
  templateUrl: './pulsar-table.component.html',
  styleUrls: ['./pulsar-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush   // ✅ OnPush for performance
})
export class PulsarTableComponent implements AfterViewInit, OnDestroy {
  id = 'pulsar-table';
  table: MyTable = new PulsarTable(this.id);
  colNames = ['Time (sec)', 'XX', 'YY'];
  dataSet: PulsarTableDict[] = [];
  rawData = true;

  private destroy$ = new Subject<void>();

  constructor(
    private service: PulsarService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSet = this.limitPrecision(this.service.getRawData());
  }

  ngAfterViewInit(): void {
    // 🔹 only update the Handsontable instance, do not recreate arrays
    this.service.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const src = this.rawData
          ? this.service.getRawData()
          : this.service.getData();
        this.updateTable(src);
      });

    this.service.tableType$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const type = this.service.getTableType();
        this.rawData = type === 'raw';
        const src = this.rawData
          ? this.service.getRawData()
          : this.service.getData();
        this.updateTable(src);
      });

    const hot = this.table.getTable();

    hot.addHook('afterDocumentKeyDown', (event: KeyboardEvent) => {
      if (event.key !== 'Backspace' && event.key !== 'Delete') return;

      const selections = hot.getSelected();
      if (!selections) return;

      const rowsToDelete: number[] = [];
      for (const [startRow,, endRow] of selections) {
        for (let r = startRow; r <= endRow; r++) rowsToDelete.push(r);
      }
      const uniqueRows = [...new Set(rowsToDelete)].sort((a, b) => a - b);
      if (!uniqueRows.length) return;

      event.preventDefault();
      this.removeFromAllServices(uniqueRows);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Context menu remove */
  public onRemove = (args: any) => {
    const [index, amount] = args;
    const rows = Array.from({ length: amount }, (_, i) => index + i);
    this.removeFromAllServices(rows);
  };

  /** Insert rows */
  public onInsert = (args: any) => {
    const [index, amount] = args;
    this.service.addRow(index, amount);
  };

  /** Cell change */
  public onChange = (args: any) => {
    const [changes] = args;
    if (!changes) return;
    const tableData = this.table.getData();
    this.rawData
      ? this.service.setRawData(tableData)
      : this.service.setData(tableData);
  };

  public beforePaste = (args: any) => {
    const [data, coords] = args;
    return beforePaste(data, coords, this.table);
  };

  private removeFromAllServices(rows: number[]) {
    const filterRows = (arr: PulsarDataDict[]) =>
      arr.filter((_, i) => !rows.includes(i));

    const newRaw = filterRows(this.service.getRawData());
    const newSub = filterRows(this.service.getData());

    this.service.setRawData(newRaw);
    this.service.setData(newSub);

    const current = this.rawData ? newRaw : newSub;
    this.updateTable(current);
  }

  private updateTable(src: PulsarDataDict[]) {
    const hot = this.table.getTable();
    const limited = this.limitPrecision(src);
    hot.loadData(limited);            
    this.dataSet = limited;
    this.cdr.markForCheck();
  }

  private limitPrecision(data: PulsarDataDict[]): PulsarTableDict[] {
    return data.map(row => ({
      jd: row.jd != null ? +row.jd.toFixed(2) : row.jd,
      source1: row.source1 != null ? +row.source1.toFixed(2) : row.source1,
      source2: row.source2 != null ? +row.source2.toFixed(2) : row.source2,
    }));
  }
}

class PulsarTable implements MyTable {
  private hotRegisterer = new HotTableRegisterer();
  constructor(private id: string) {}
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

interface PulsarTableDict {
  jd: number | null;
  source1: number | null;
  source2: number | null;
}
