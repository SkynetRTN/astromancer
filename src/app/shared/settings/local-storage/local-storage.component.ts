import {Component} from '@angular/core';

@Component({
  selector: 'app-local-storage',
  templateUrl: './local-storage.component.html',
  styleUrls: ['./local-storage.component.scss']
})
export class LocalStorageComponent {

  clearAllStorage() {
    localStorage.clear();
    location.reload();
  }
}
