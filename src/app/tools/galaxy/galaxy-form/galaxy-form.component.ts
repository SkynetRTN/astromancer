import {Component} from '@angular/core';
import {GalaxyOptions} from "../galaxy.service.util";
import {FormControl} from "@angular/forms";
import {GalaxyService} from "../galaxy.service";

@Component({
  selector: 'app-galaxy-form',
  templateUrl: './galaxy-form.component.html',
  styleUrls: ['./galaxy-form.component.scss']
})
export class GalaxyFormComponent {
  form: FormControl = new FormControl({});
  protected channelOptions = [
    GalaxyOptions.ONE,
    GalaxyOptions.TWO,
  ]

  constructor(private service: GalaxyService) {
    this.form.setValue(this.service.getChannel());
  }

  onSelect() {
    this.service.setChannel(this.form.value);
  }
}
