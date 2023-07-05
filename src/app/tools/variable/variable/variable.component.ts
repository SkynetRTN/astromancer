import {Component, OnDestroy} from '@angular/core';
import {VariableService} from "../variable.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-variable',
  templateUrl: './variable.component.html',
  styleUrls: ['./variable.component.scss'],
})
export class VariableComponent implements OnDestroy {
  lightCurveFormValid: boolean = false;
  variableTabindex: number = this.service.getTabIndex();
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private service: VariableService) {

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
