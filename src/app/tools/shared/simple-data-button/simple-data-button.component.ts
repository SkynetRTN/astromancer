import {Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {TableAction} from "../types/actions";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";

@Component({
  selector: 'app-simple-data-button',
  templateUrl: './simple-data-button.component.html',
  styleUrls: ['./simple-data-button.component.scss']
})
export class SimpleDataButtonComponent implements OnInit {
  @Input() modelResetVisible: boolean = false;
  @Output() tableUserActionObs$: EventEmitter<TableAction[]>;

  constructor() {
    this.tableUserActionObs$ = new EventEmitter<TableAction[]>();
  }

  ngOnInit(): void {
  }

  tableAddRow() {
    this.tableUserActionObs$.emit([{action: "addRow"}]);
  }

  dataReset() {
    this.tableUserActionObs$.emit([{action: "resetData"}]);
  }

  modelReset() {
    this.tableUserActionObs$.emit([{action: "resetModel"}]);
  }
}

@NgModule({
  imports: [MatButtonModule],
  declarations: [SimpleDataButtonComponent],
  exports: [
    SimpleDataButtonComponent
  ]
})
export class SimpleDataButtonModule {
}
