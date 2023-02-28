import {Component, Directive, EventEmitter, Input, OnInit, Output, Type, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[DataButton]',
})
export class DataButtonDirective implements OnInit {
  @Input() buttonType!: Type<Component>;
  @Output() tableObs$: EventEmitter<any>;

  constructor(private container: ViewContainerRef) {
    this.tableObs$ = new EventEmitter<any>();
  }

  ngOnInit(): void {
    const component = this.container.createComponent(this.buttonType);
    (component.instance as any).tableObs$.subscribe(this.tableObs$);
  }

}
