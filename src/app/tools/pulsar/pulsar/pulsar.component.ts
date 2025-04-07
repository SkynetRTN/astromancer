import {Component, OnDestroy} from '@angular/core';
import {PulsarService} from "../pulsar.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-pulsar',
  templateUrl: './pulsar.component.html',
  styleUrls: ['./pulsar.component.scss'],
})
export class PulsarComponent implements OnDestroy {
  lightCurveFormValid: boolean = true;
  pulsarTabindex: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private service: PulsarService) {
     this.service.lightCurveOptionValid$.pipe(
       takeUntil(this.destroy$)
     ).subscribe((lightCurveFormValid) => {
      this.lightCurveFormValid = lightCurveFormValid;
      if (!this.lightCurveFormValid){ 
        this.pulsarTabindex = 2;
      }
     });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  onTabChange($event: number) {
    this.service.setTabIndex($event);
  }
}
