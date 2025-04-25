import { AfterViewInit, Component, Input, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-loading-block',
  templateUrl: './loading-block.html',
  styleUrls: ['./loading-block.scss'],
  // encapsulation: ViewEncapsulation.ShadowDom
})
export class LoadingBlockComponent implements AfterViewInit {
  
  @Input() progress$!: Subject<number>;
  @Input() status$!: Subject<string>;
  public state = 0;

  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public loading$ = this.loadingSubject.asObservable()

  constructor(){}

  ngAfterViewInit() {
    // Need to do takeUntil
    this.progress$?.pipe(
    ).subscribe((progress: number) =>
    {
      // console.log(progress)
      console.log(progress)
      this.state = progress

      //Maybe do a lil animation at 100%
      // <=0 means hasn't started, >=100 means finished
      this.loadingSubject.next(progress < 100 && progress > 0)
    })
    
  }
}