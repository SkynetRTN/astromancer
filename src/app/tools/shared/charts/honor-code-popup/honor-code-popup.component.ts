import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-honor-code-popup',
  templateUrl: './honor-code-popup.component.html',
  styleUrls: ['./honor-code-popup.component.css']
})
export class HonorCodePopupComponent implements OnInit {
  form!: FormGroup;

  constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      signature: ['', Validators.required]
    });
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  public submit(sign: string) {
    if (this.form.valid)
      this.activeModal.close(sign);
  }

}
