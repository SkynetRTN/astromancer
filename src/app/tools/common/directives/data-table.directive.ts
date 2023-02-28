import {Component, Directive, EventEmitter, Injector, Input, OnInit, Type, ViewContainerRef} from '@angular/core';
import {SimpleTableInitArgs} from "../tables/simpleTable";

@Directive({
  selector: '[DataTable]'
})
export class DataTableDirective implements OnInit {
  @Input() tableType!: Type<Component>;
  @Input() tableArgs!: SimpleTableInitArgs;
  @Input() tableColObserver$: EventEmitter<any>;

  constructor(public container: ViewContainerRef) {
    this.tableColObserver$ = new EventEmitter<any>();
  }

  ngOnInit(): void {
    const tableInjector: Injector = Injector.create({
      providers: [{provide: 'tableArgs', useValue: this.tableArgs,},
        {provide: 'tableColObserver$', useValue: this.tableColObserver$}]
    });
    this.container.createComponent(this.tableType, {injector: tableInjector});
  }

}
