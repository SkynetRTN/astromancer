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
import {SimpleTableInitArgs} from "../tables/simpleTable";
import {TableAction} from "../types/actions";

export interface DataTableComponent {
  tableUserActionObs$: EventEmitter<TableAction[]>;
}

@Directive({
  selector: '[DataTable]'
})
export class DataTableDirective implements OnInit {
  @Input() tableType!: Type<Component>;
  @Input() tableArgs!: SimpleTableInitArgs;
  @Input() tableUpdateObs$: EventEmitter<TableAction[]>;
  @Output() tableUserActionObs$: EventEmitter<TableAction[]>;

  constructor(public container: ViewContainerRef) {
    this.tableUpdateObs$ = new EventEmitter<TableAction[]>();
    this.tableUserActionObs$ = new EventEmitter<TableAction[]>();
  }

  ngOnInit(): void {
    const tableInjector: Injector = Injector.create({
      providers: [{provide: 'tableArgs', useValue: this.tableArgs,},
        {provide: 'tableUpdateObs$', useValue: this.tableUpdateObs$}]
    });
    const component = this.container.createComponent(this.tableType, {injector: tableInjector});
    (component.instance as DataTableComponent).tableUserActionObs$.subscribe(this.tableUserActionObs$);
  }

}
