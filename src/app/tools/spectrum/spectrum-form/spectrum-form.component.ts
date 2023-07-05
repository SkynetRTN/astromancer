import {Component} from '@angular/core';
import {SpectrumOptions} from "../spectrum.service.util";
import {FormControl} from "@angular/forms";
import {SpectrumService} from "../spectrum.service";

@Component({
  selector: 'app-spectrum-form',
  templateUrl: './spectrum-form.component.html',
  styleUrls: ['./spectrum-form.component.scss']
})
export class SpectrumFormComponent {
  form: FormControl = new FormControl({});
  protected channelOptions = [
    SpectrumOptions.ONE,
    SpectrumOptions.TWO,
  ]

  constructor(private service: SpectrumService) {
    this.form.setValue(this.service.getChannel());
  }

  onSelect() {
    this.service.setChannel(this.form.value);
  }
}
