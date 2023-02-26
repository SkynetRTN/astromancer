import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';

/** @title Sidenav with custom escape and backdrop click behavior */
@Component({
  selector: 'app-tools-navbar',
  templateUrl: 'tools-navbar.component.html',
  styleUrls: ['tools-navbar.component.css'],
})
export class ToolsNavbarComponent {
  @ViewChild('toolsnav') toolsnav!: MatSidenav;

  open(){
    this.toolsnav.open();
  }
  close() {
    this.toolsnav.close();
  }

}


/**  Copyright 2019 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license */
