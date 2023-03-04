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
import {ChartAction} from "../types/actions";

export interface GraphButtonComponent {
  chartUserActionObs$: EventEmitter<ChartAction[]>;
}

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

@NgModule({
  declarations: [GraphButtonDirective],
  exports: [GraphButtonDirective]
})
export class GraphButtonDirectiveModule {
}
