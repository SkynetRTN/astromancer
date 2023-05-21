import {
  Component,
  Directive,
  EventEmitter,
  Injector,
  Input,
  NgModule,
  OnInit,
  Output,
  Type,
  ViewContainerRef
} from '@angular/core';
import {ChartAction} from "../types/actions";
import {DataControlComponent} from "./data-control.directive";
import {StandardGraphInfo} from "../standard-graph-info/standard-graphinfo";

/**
 * Interface for components that can be created by {@link GraphInfoDirective}
 */
export interface GraphInfoComponent {
  /**
   * Observable that detects when user is inputing actions that is related to the chart
   */
  chartUserActionObs$: EventEmitter<ChartAction[]>;
}

/**
 * Directive contains a form for graph information.
 *
 * Declared in {@link GraphInfoDirectiveModule}
 */
@Directive({
  selector: '[graph-info-directive]',
})
export class GraphInfoDirective implements OnInit {
  @Input() graphInfoType!: Type<Component>;
  @Input() defaultChartInfo!: StandardGraphInfo;
  @Output() chartUserActionObs$: EventEmitter<ChartAction[]>;

  constructor(public container: ViewContainerRef) {
    this.chartUserActionObs$ = new EventEmitter<ChartAction[]>();
  }

  ngOnInit(): void {
    const graphInfoInjector: Injector = Injector.create({
      providers: [{ provide: 'defaultChartInfo', useValue: this.defaultChartInfo }]
    });
    const component = this.container.createComponent(this.graphInfoType, { injector: graphInfoInjector });
    (component.instance as DataControlComponent).chartUserActionObs$.subscribe(this.chartUserActionObs$);
  }
}

/**
 * Encapsulation for {@link GraphInfoDirective}
 */
@NgModule({
  declarations: [GraphInfoDirective],
  exports: [GraphInfoDirective],
})
export class GraphInfoDirectiveModule {
}
