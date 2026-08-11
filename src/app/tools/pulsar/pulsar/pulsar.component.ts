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
    const data = this.service.getPeriodFoldingChartData();

    // getPeriodFoldingChartData() only includes `data2` when source2 is present.
    const source2Series = data['data2'];
    if (!source2Series || source2Series.length === 0) {
      this.lockToPeriodFolding();
      return;
    }

    const sum = source2Series.reduce((total, pair) => total + pair[1], 0);
    if (sum === 0) {
      this.lockToPeriodFolding();
    }
  }

  /**
   * A single-polarisation file can only be period-folded, so disable the other
   * tabs and move the user there.
   *
   * Writes through the service rather than assigning the two fields directly.
   * Assigning locally left the component and the persisted state disagreeing:
   * the visible tab was 2 while storage still held the old index, and the
   * light-curve flag read false here while `pulsarInterface` still said true -
   * so a refresh dropped you somewhere else with the tabs re-enabled. The
   * lightCurveOptionValid$ / tabIndex$ subscriptions in the constructor feed
   * both values back into this component.
   */
  private lockToPeriodFolding(): void {
    this.service.setLightCurveOptionValid(false);
    this.service.setTabIndex(2);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTabChange($event: number) {
    this.service.setTabIndex($event);
  }
}
