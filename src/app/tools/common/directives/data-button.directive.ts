import {Component, Directive, EventEmitter, Input, OnInit, Output, Type, ViewContainerRef} from '@angular/core';
import {TableAction} from "../types/actions";

export interface DataButtonComponent {
  tableUserActionObs$: EventEmitter<TableAction[]>;
}

@Directive({
  selector: '[DataButton]',
})
export class DataButtonDirective implements OnInit {
  @Input() tableButtonType!: Type<Component>;
  @Output() tableUserActionObs$: EventEmitter<TableAction[]>;

  constructor(private container: ViewContainerRef) {
    this.tableUserActionObs$ = new EventEmitter<TableAction[]>();
  }

  ngOnInit(): void {
    const component = this.container.createComponent(this.tableButtonType);
    (component.instance as DataButtonComponent).tableUserActionObs$.subscribe(this.tableUserActionObs$);
  }

}
