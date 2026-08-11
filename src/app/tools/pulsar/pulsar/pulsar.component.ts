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
     this.pulsarTabindex = this.service.getTabIndex();

     this.service.lightCurveOptionValid$.pipe(
       takeUntil(this.destroy$)
     ).subscribe((lightCurveFormValid) => {
      this.lightCurveFormValid = lightCurveFormValid;
      if (!this.lightCurveFormValid){
        this.pulsarTabindex = 2;
      }
     });

     // Also react to programmatic setTabIndex calls (e.g. the standard-file
     // upload path and Reset Tool). Without this subscription, setTabIndex
     // only persists to storage but doesn't drive the visible tab — the
     // lightCurveOptionValid$ subscription above is the only thing that
     // moves the user. The !== guard prevents a feedback loop with mat-tab-
     // group's (selectedIndexChange) → onTabChange → setTabIndex.
     this.service.tabIndex$.pipe(
       takeUntil(this.destroy$)
     ).subscribe(index => {
       if (this.pulsarTabindex !== index) {
         this.pulsarTabindex = index;
       }
     });
  }

  ngOnInit(): void {
    this.lightCurveFormValid = this.service.getIsLightCurveOptionValid();
  }  

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTabChange($event: number) {
    this.service.setTabIndex($event);
  }
}
