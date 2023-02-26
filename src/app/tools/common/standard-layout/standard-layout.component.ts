import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {GraphInfoDirective} from "../directives/graph-info.directive";

@Component({
  selector: 'app-standard-layout',
  templateUrl: './standard-layout.component.html',
  styleUrls: ['./standard-layout.component.css']
})
export class StandardLayoutComponent implements OnInit {
  @Input() graphInfoType!: any
  @ViewChild(GraphInfoDirective, {static: true}) graphInfo!: GraphInfoDirective;

  constructor() {
  }

  ngOnInit(): void {
    this.loadComponent();
  }

  loadComponent(){
    this.graphInfo.viewContainerRef.createComponent(this.graphInfoType);
  }
}
