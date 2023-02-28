import { Component, OnInit } from '@angular/core';
import {SimpleChart} from "./simpleChart";

@Component({
  selector: 'app-simple-chart-impl',
  templateUrl: './simple-chart-impl.component.html',
  styleUrls: ['./simple-chart-impl.component.css']
})
export class SimpleChartImplComponent implements OnInit, SimpleChart {

  constructor() { }

  ngOnInit(): void {
  }

}
