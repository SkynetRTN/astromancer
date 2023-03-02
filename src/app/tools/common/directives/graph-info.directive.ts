import {
  Component,
  Directive,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  Type,
  ViewContainerRef
} from '@angular/core';
import {ChartAction} from "../types/actions";
import {DataControlComponent} from "./data-control.directive";
import {StandardGraphInfo} from "../standard-graph-info/standard-graphinfo";

export interface GraphInfoComponent {
  chartUserActionObs$: EventEmitter<ChartAction[]>;
}

@Directive({
  selector: '[GraphInfo]',
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
      providers: [{provide: 'defaultChartInfo', useValue: this.defaultChartInfo}]
    });
    const component = this.container.createComponent(this.graphInfoType, {injector: graphInfoInjector});
    (component.instance as DataControlComponent).chartUserActionObs$.subscribe(this.chartUserActionObs$);
  }
}
