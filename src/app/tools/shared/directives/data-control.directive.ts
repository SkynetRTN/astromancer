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
import {ChartAction, TableAction} from "../types/actions";

/**
 * Interface for components that can be created by {@link DataButtonDirective}.
 */
export interface DataControlComponent {
  /**
   * Observable that detects when user is inputing actions that is related to the data table
   */
  tableUserActionObs$: EventEmitter<TableAction[]>;
  /**
   * Observable that detects when user is inputing actions that is related to the chart
   */
  chartUserActionObs$: EventEmitter<ChartAction[]>;
}

/**
 * Directive for control forms of data table
 *
 * Decalred in {@link DataButtonDirectiveModule}
 */
@Directive({
  selector: '[data-control-directive]',
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

/**
 * Encapsulation for {@link DataControlDirective}
 */
@NgModule({
  declarations: [DataControlDirective],
  exports: [DataControlDirective]
})
export class DataControlDirectiveModule {
}
