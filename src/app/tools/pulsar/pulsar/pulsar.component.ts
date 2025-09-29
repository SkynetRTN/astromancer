import {Component, OnDestroy, OnInit} from '@angular/core';
import {PulsarService} from "../pulsar.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-pulsar',
  templateUrl: './pulsar.component.html',
  styleUrls: ['./pulsar.component.scss'],
})
export class PulsarComponent implements OnInit, OnDestroy {
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

  ngOnInit(): void {
    const data = this.service.getPeriodFoldingChartData();
    
    const sum = data['data2'].reduce((total, pair) => total + pair[1], 0);
    if (sum === 0) {
      this.lightCurveFormValid = false;
      this.pulsarTabindex = 2;
    }
  }  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTabChange($event: number) {
    this.service.setTabIndex($event);
  }
}
