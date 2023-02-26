import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {GraphInfoDirective} from "../directives/graph-info.directive";
import {DataControlDirective} from "../directives/data-control.directive";

@Component({
  selector: 'app-standard-layout',
  templateUrl: './standard-layout.component.html',
  styleUrls: ['./standard-layout.component.css']
})
export class StandardLayoutComponent implements OnInit {
  @Input() graphInfoType!: any
  @Input() dataControlType!: any
  @ViewChild(GraphInfoDirective, {static: true}) graphInfo!: GraphInfoDirective;
  @ViewChild(DataControlDirective, {static: true}) dataControl!: DataControlDirective

  constructor() {
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent(){
    this.graphInfo.viewContainerRef.createComponent(this.graphInfoType);
    this.dataControl.viewContainerRef.createComponent(this.dataControlType);
  }
}
