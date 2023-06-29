import {Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {TableAction} from "../types/actions";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-simple-data-button',
  templateUrl: './simple-data-button.component.html',
  styleUrls: ['./simple-data-button.component.scss']
})
export class SimpleDataButtonComponent implements OnInit {
  @Input() modelResetVisible: boolean = false;
  @Input() isDataRandom: boolean = false;
  @Input() isUploadData: boolean = false;
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

  uploadData() {
    this.tableUserActionObs$.emit([{action: "uploadData"}]);
  }
}

@NgModule({
  imports: [MatButtonModule, NgIf],
  declarations: [SimpleDataButtonComponent],
  exports: [
    SimpleDataButtonComponent
  ]
})
export class SimpleDataButtonModule {
}
