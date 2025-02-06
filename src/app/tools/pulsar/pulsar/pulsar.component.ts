import {Component, OnDestroy} from '@angular/core';
import {PulsarService} from "../pulsar.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-pulsar',
  templateUrl: './pulsar.component.html',
  styleUrls: ['./pulsar.component.scss'],
})
export class PulsarComponent implements OnDestroy {
  lightCurveFormValid: boolean = false;
  pulsarTabindex: number = 0;
  // this.pulsarTabindex = this.service.getTabIndex();
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private service: PulsarService) {

    this.service.interface$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.lightCurveFormValid = this.service.getIsLightCurveOptionValid();
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
