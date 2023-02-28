import {Component, EventEmitter, Input, OnInit, Output, Type, ViewChild} from '@angular/core';
import {GraphInfoDirective} from "../directives/graph-info.directive";
import {DataControlDirective} from "../directives/data-control.directive";
import {DataTableDirective} from "../directives/data-table.directive";
import {SimpleTableInitArgs} from "../tables/simpleTable";

@Component({
  selector: 'app-standard-layout',
  templateUrl: './standard-layout.component.html',
  styleUrls: ['./standard-layout.component.css']
})
export class StandardLayoutComponent implements OnInit {
  @Input() graphInfoType!: Type<Component>
  @Input() dataControlType!: Type<Component>
  @Input() tableType!: Type<Component>
  @Input() tableColObserver$: EventEmitter<number>;
  @Input() defaultTableArgs!: SimpleTableInitArgs;
  @Output() tableObs$: EventEmitter<any>;
  @ViewChild(GraphInfoDirective, {static: true}) graphInfo!: GraphInfoDirective;
  @ViewChild(DataControlDirective, {static: true}) dataControl!: DataControlDirective;
  @ViewChild(DataTableDirective, {static: true}) dataTableDir!: DataTableDirective;

  constructor() {
    this.tableObs$ = new EventEmitter<any>();
    this.tableColObserver$ = new EventEmitter<number>();
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent() {
    this.graphInfo.viewContainerRef.createComponent(this.graphInfoType);
    // this.dataControl.viewContainerRef.createComponent(this.dataControlType);
    // const tableInjector: Injector = Injector.create({
    //   providers: [{
    //     provide: 'tableArgs',
    //     useValue: this.defaultTableArgs
    //   }]
    // });
    // this.dataTableDir.viewContainerRef.createComponent(this.tableType, {injector: tableInjector});
  }

  tableObs(event: Event) {
    this.tableObs$.emit(event);
  }
}
