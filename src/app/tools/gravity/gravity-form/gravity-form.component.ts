import {Component} from '@angular/core';
import {GravityOptions} from "../gravity.service.util";
import {FormControl} from "@angular/forms";
import {GravityService} from "../gravity.service";

@Component({
  selector: 'app-gravity-form',
  templateUrl: './gravity-form.component.html',
  styleUrls: ['./gravity-form.component.scss']
})
export class GravityFormComponent {
  form: FormControl = new FormControl({});
  protected channelOptions = [
    GravityOptions.ONE,
    GravityOptions.TWO,
  ]

  constructor(private service: GravityService) {
    this.form.setValue(this.service.getChannel());
  }

  onSelect() {
    this.service.setChannel(this.form.value);
  }
}
