import {Component, Input} from '@angular/core';
import {ToolsNavbarComponent} from "../tools-navbar/tools-navbar.component";

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent {
  @Input() navbar!: ToolsNavbarComponent

  openToolNavbar(){
    this.navbar.open();
  }

}
