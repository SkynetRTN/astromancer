import {
  Component,
  Directive,
  EventEmitter,
  Input,
  NgModule,
  OnInit,
  Output,
  Type,
  ViewContainerRef
} from '@angular/core';
import { TableAction } from "../types/actions";

/**
 * Interface for components that can be created by {@link DataButtonDirective}.
 */
export interface DataButtonComponent {
  /**
   * Observable that detects when user is inputing actions that is related to the data table
   */
  tableUserActionObs$: EventEmitter<TableAction[]>;
}

/**
 * Directive for data button control areas
 * 
 * Declared in {@link DataButtonDirectiveModule }
 */
@Directive({
  selector: '[data-button-directive]',
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

/**
 * Module encapsulating {@link DataButtonDirective} 
 */
@NgModule({
  declarations: [DataButtonDirective],
  exports: [DataButtonDirective]
})
export class DataButtonDirectiveModule {
}
