import {Component, EventEmitter, Input, OnInit, Output, Type, ViewChild} from '@angular/core';
import {GraphInfoDirective} from "../directives/graph-info.directive";
import {DataControlDirective} from "../directives/data-control.directive";
import {DataTableDirective} from "../directives/data-table.directive";
import {SimpleTableInitArgs} from "../tables/simpleTable";
import {DataButtonDirective} from "../directives/data-button.directive";

@Component({
  selector: 'app-standard-layout',
  templateUrl: './standard-layout.component.html',
  styleUrls: ['./standard-layout.component.css']
})
export class StandardLayoutComponent implements OnInit {
  @Input() graphInfoType!: Type<Component>
  @Input() dataControlType!: Type<Component>
  @Input() dataButtonType!: Type<Component>
  @Input() tableType!: Type<Component>
  @Input() tableUpdateObserver$: EventEmitter<number>;
  @Input() defaultTableArgs!: SimpleTableInitArgs;
  @Output() tableUserActionObs$: EventEmitter<any>;
  @ViewChild(GraphInfoDirective, {static: true}) graphInfo!: GraphInfoDirective;
  @ViewChild(DataControlDirective, {static: true}) dataControl!: DataControlDirective;
  @ViewChild(DataTableDirective, {static: true}) dataTableDir!: DataTableDirective;
  @ViewChild(DataButtonDirective, {static: true}) dataButtonDir!: DataButtonDirective;

  constructor() {
    this.tableUserActionObs$ = new EventEmitter<any>();
    this.tableUpdateObserver$ = new EventEmitter<number>();
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent() {
    this.graphInfo.viewContainerRef.createComponent(this.graphInfoType);
  }

  tableObs(event: Event) {
    this.tableUserActionObs$.emit(event);
  }
}
