import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Warning dialog shown when an action needs a loaded FITS file and there isn't
 * one (see RadioSearchComponent.noUpload).
 *
 * Previously declared inline at the bottom of radiosearch.component.ts and
 * never listed in any NgModule, so opening it threw at runtime.
 */
@Component({
  selector: 'app-dialog-content',
  template: `
    <h1 mat-dialog-title class="warning-title">Warning!</h1>
    <div mat-dialog-content class="warning-content">{{ data.message }}</div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="closeDialog()"
        color="primary"
        style="border-radius: 3px"
        mat-raised-button>OK</button>
    </div>
  `,
  styles: [`
    .warning-title {
      text-align: center;
      color: rgb(143, 143, 143);
    }
    .warning-content {
      font-size: 16px;
      padding: 2px;
      justify-content: center;
      color: rgb(143, 143, 143);
    }
    .dialog-actions {
      display: flex;
      justify-content: center;
      padding: 7px;
    }
  `]
})
export class DialogContent {
  constructor(
    public dialogRef: MatDialogRef<DialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
