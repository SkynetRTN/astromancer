import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";

/**
 * Popup window to collect signature before initiating graph downloading.
 *
 * Declared in {@link HonorCodePopupModule}
 */
@Component({
  selector: 'app-honor-code-popup',
  templateUrl: './honor-code-popup.component.html',
  styleUrls: ['./honor-code-popup.component.scss']
})
export class HonorCodePopupComponent implements OnInit {
  form!: FormGroup;

  constructor(private matDialogRef: MatDialogRef<any>, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      signature: ['', Validators.required]
    });
  }

  public dismiss() {
    this.matDialogRef.close();
  }

  public submit() {
    if (this.form.valid) {
      this.matDialogRef.close();
    }
  }

}
