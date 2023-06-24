import { Component } from '@angular/core';
import {ChartAction} from "../../shared/types/actions";

@Component({
  selector: 'app-moon',
  templateUrl: './moon.component.html',
  styleUrls: ['./moon.component.scss']
})
export class MoonComponent {

  actionHandler($event: ChartAction[]) {
    console.log($event);
  }
}
