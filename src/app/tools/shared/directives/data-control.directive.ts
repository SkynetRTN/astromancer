import {Component, Directive, EventEmitter, Input, OnInit, Output, Type, ViewContainerRef} from '@angular/core';
import {ChartAction, TableAction} from "../types/actions";

export interface DataControlComponent {
  tableUserActionObs$: EventEmitter<TableAction[]>;
  chartUserActionObs$: EventEmitter<ChartAction[]>;
}

@Directive({
  selector: '[DataControl]',
})
export class DataControlDirective implements OnInit {
  @Input() controlType!: Type<Component>;
  @Output() tableUserActionObs$: EventEmitter<TableAction[]>;
  @Output() chartUserActionObs$: EventEmitter<ChartAction[]>;

  constructor(private container: ViewContainerRef) {
    this.tableUserActionObs$ = new EventEmitter<TableAction[]>();
    this.chartUserActionObs$ = new EventEmitter<ChartAction[]>();
  }

  ngOnInit(): void {
    const component = this.container.createComponent(this.controlType);
    (component.instance as DataControlComponent).tableUserActionObs$.subscribe(this.tableUserActionObs$);
    (component.instance as DataControlComponent).chartUserActionObs$.subscribe(this.chartUserActionObs$);
  }

}
