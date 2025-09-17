import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {MyTable} from "../../../shared/tables/table-interface";
import {PulsarData, PulsarDataDict} from "../../pulsar.service.util";
import {Subject, takeUntil} from "rxjs";
import {PulsarService} from "../../pulsar.service";
import {MyData} from "../../../shared/data/data.interface";
import {HotTableRegisterer} from "@handsontable/angular";
import Handsontable from "handsontable";
import {beforePaste} from "../../../shared/tables/util";
@Component({
    selector: 'app-pulsar-table',
    templateUrl: './pulsar-table.component.html',
    styleUrls: ['./pulsar-table.component.scss']
})
export class PulsarTableComponent implements AfterViewInit, OnDestroy {
    id: string = "pulsar-table";
    table: MyTable = new PulsarTable(this.id);
    colNames: string[] = ["jd", "source1", "source2"];
    dataSet: PulsarTableDict[];
    private destroy$: Subject<void> = new Subject<void>();
    constructor(private service: PulsarService) {
        this.dataSet = this.limitPrecision(this.service.getData());
    }
    ngAfterViewInit(): void {
        this.service.combinedData$.pipe(
            takeUntil(this.destroy$)
        ).subscribe((data: PulsarDataDict[]) => {
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
            this.service.setCombinedData(this.table.getData());
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
    
    private limitPrecision(data: PulsarDataDict[]): PulsarTableDict[] {
        return data.map(
            (row: PulsarDataDict) => {
                return {
                    jd: row.jd? parseFloat(row.jd.toFixed(2)) : row.jd,
                    source1: row.source1 ? parseFloat(row.source1.toFixed(2)) : row.source1,
                    source2: row.source2 ? parseFloat(row.source2.toFixed(2)) : row.source2,
                }
            }
        );
    }
}
class PulsarTable implements MyTable {
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
interface PulsarTableDict {
    jd: number | null,
    source1: number | null,
    source2: number | null,
}

