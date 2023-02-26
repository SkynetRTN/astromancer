import {Component} from '@angular/core';
import {StandardGraphInfo} from "./standard-graphinfo";

@Component({
  selector: 'app-standard-graphinfo',
  templateUrl: './standard-graph-info.component.html',
  styleUrls: ['./standard-graph-info.component.css']
})
export class StandardGraphInfoComponent {
  info: StandardGraphInfo
  default(): void{
    this.info = {title: "Title",data: "data",xAxis: "x",yAxis: "y"};
  }
  onChange(): StandardGraphInfo { return this.info }

  constructor() {
    this.info = new StandardGraphInfo("Title", "data", "x", "y");
  }

}
