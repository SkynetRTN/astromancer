import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-simple-data-button',
  templateUrl: './simple-data-button.component.html',
  styleUrls: ['./simple-data-button.component.css']
})
export class SimpleDataButtonComponent implements OnInit {
  @Output() tableObs$: EventEmitter<any>;
  constructor() {
    this.tableObs$ = new EventEmitter<any>();
  }

  ngOnInit(): void {
  }

  tableAddRow(){
    this.tableObs$.emit("addRow");
  }

}
