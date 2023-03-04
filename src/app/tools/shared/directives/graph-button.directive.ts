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
import { ChartAction } from "../types/actions";

/**
 * Interface for components that can be created by {@link GraphButtonDirective}
 */
export interface GraphButtonComponent {
  /**
   * Observable that detects when user is inputing actions that is related to the chart 
   */
  chartUserActionObs$: EventEmitter<ChartAction[]>;
}

/**
 * Directive that contains control area/form for charts.
 * 
 * Declared in {@link GraphButtonDirectiveModule}
 */
@Directive({
  selector: '[graph-button-directive]',
})
export class GraphButtonDirective implements OnInit {
  @Input() graphButtonType!: Type<Component>;
  @Output() chartUserActionObs$: EventEmitter<ChartAction[]>;

  constructor(private container: ViewContainerRef) {
    this.chartUserActionObs$ = new EventEmitter<ChartAction[]>();
  }

  ngOnInit(): void {
    const component = this.container.createComponent(this.graphButtonType);
    (component.instance as GraphButtonComponent).chartUserActionObs$.subscribe(this.chartUserActionObs$);
  }

}

/**
 * Encapsulation for {@link GraphButtonDirective}
 */
@NgModule({
  declarations: [GraphButtonDirective],
  exports: [GraphButtonDirective]
})
export class GraphButtonDirectiveModule {
}
