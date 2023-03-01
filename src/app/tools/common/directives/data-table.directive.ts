import {Component, Directive, EventEmitter, Injector, Input, OnInit, Type, ViewContainerRef} from '@angular/core';
import {SimpleTableInitArgs} from "../tables/simpleTable";
import {TableAction} from "../types/actions";

@Directive({
  selector: '[DataTable]'
})
export class DataTableDirective implements OnInit {
  @Input() tableType!: Type<Component>;
  @Input() tableArgs!: SimpleTableInitArgs;
  @Input() tableUpdateObs$: EventEmitter<TableAction[]>;

  constructor(public container: ViewContainerRef) {
    this.tableUpdateObs$ = new EventEmitter<TableAction[]>();
  }

  ngOnInit(): void {
    const tableInjector: Injector = Injector.create({
      providers: [{provide: 'tableArgs', useValue: this.tableArgs,},
        {provide: 'tableUpdateObs$', useValue: this.tableUpdateObs$}]
    });
    this.container.createComponent(this.tableType, {injector: tableInjector});
  }

}
