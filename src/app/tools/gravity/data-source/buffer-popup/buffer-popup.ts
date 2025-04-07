import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './buffer-popup.html',
  styleUrls: ['./buffer-popup.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class BufferComponent {

  public state = 50;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {progress: Observable<number>}, private dialogRef: MatDialogRef<BufferComponent>) {
    // Need to do takeUntil
    this.data.progress.subscribe((progress: number) =>
    {
        // console.log(progress)
        this.state = progress
        //Maybe do a lil animation at 100%
        if(progress >= 100)
        {
            this.dialogRef.close("Complete")
        }

    })
   }
}