import {Component, OnInit} from '@angular/core';
import {StandardGraphInfoComponent} from "../common/standard-graph-info/standard-graph-info.component";
import {LineFormComponent} from "./line-form/line-form.component";

@Component({
  selector: 'app-curve',
  templateUrl: './curve.component.html',
  styleUrls: ['./curve.component.css']
})
export class CurveComponent implements OnInit{
  graphInfoType: any;
  dataControlType: any;

  constructor() {
    this.graphInfoType = StandardGraphInfoComponent;
    this.dataControlType = LineFormComponent;
  }
  ngOnInit(): void {
  }
}
