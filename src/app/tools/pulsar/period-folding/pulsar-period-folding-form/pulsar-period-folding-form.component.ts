import {Component, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {BehaviorSubject, debounceTime, Subject, takeUntil, skip} from "rxjs";
import {PulsarService} from "../../pulsar.service";
import {HonorCodePopupService} from "../../../shared/honor-code-popup/honor-code-popup.service";
import {HonorCodeChartService} from "../../../shared/honor-code-popup/honor-code-chart.service";
import {FormControl, FormGroup} from "@angular/forms";
import {PulsarDisplayPeriod} from "../../pulsar.service.util";
import {InputSliderValue} from "../../../shared/interface/input-slider/input-slider.component";
import {UpdateSource} from "../../../shared/data/utils";


@Component({
  selector: 'app-pulsar-period-folding-form',
  templateUrl: './pulsar-period-folding-form.component.html',
  styleUrls: ['./pulsar-period-folding-form.component.scss', '../../pulsar/pulsar.component.scss']
})
export class PulsarPeriodFoldingFormComponent implements OnDestroy {
  formGroup: any;
  displayPeriods = Object.values(PulsarDisplayPeriod);
  periodSubject: BehaviorSubject<number>
    = new BehaviorSubject<number>(this.service.getPeriodFoldingPeriod());
  phaseSubject: BehaviorSubject<number>
    = new BehaviorSubject<number>(this.service.getPeriodFoldingPhase());
  calSubject: BehaviorSubject<number>
    = new BehaviorSubject<number>(this.service.getPeriodFoldingCal());
  speedSubject: BehaviorSubject<number>
    = new BehaviorSubject<number>(this.service.getPeriodFoldingSpeed());
  binsSubject: BehaviorSubject<number>
    = new BehaviorSubject<number>(this.service.getPeriodFoldingBins());
  // The input-slider only re-reads its [minValue]/[maxValue] @Inputs at
  // construction. range$ is its supported escape hatch for live bound
  // updates — emitted whenever the periodogram Compute or a fresh file
  // upload changes the period-folding range.
  periodRangeSubject: Subject<{ min: number, max: number }> = new Subject();

  calFile: boolean = true;
  periodMin: number = this.service.getPeriodFoldingPeriodMin();
  periodMax: number = this.service.getPeriodFoldingPeriodMax();
  periodStep: number = 0.1;
  showSlider = true;
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.service.lightCurveOptionValid$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.calFile = value;

        setTimeout(() => {
          this.periodSubject.next(this.service.getPeriodFoldingPeriod());
        });
      });

    // Period-folding bounds are now set by the upload handler directly
    // (Nyquist … 10s), so the form no longer needs its own computation.
    // We still want the local periodMin/periodMax to reflect whatever the
    // service holds — that sync is wired into the periodFoldingForm$
    // subscriber below.
  }

  constructor(private service: PulsarService,
              private honorCodeService: HonorCodePopupService,
              private chartService: HonorCodeChartService,
              private cdr: ChangeDetectorRef) {
    this.formGroup = new FormGroup({
      chartTitle: new FormControl(this.service.getPeriodFoldingTitle()),
      dataLabel: new FormControl(this.service.getPeriodFoldingDataLabel()),
      xAxisLabel: new FormControl(this.service.getPeriodFoldingXAxisLabel()),
      yAxisLabel: new FormControl(this.service.getPeriodFoldingYAxisLabel()),
      displayPeriod: new FormControl(this.service.getPeriodFoldingDisplayPeriod()),
      period: new FormControl(this.service.getPeriodFoldingPeriodMin()),
      phase: new FormControl(0),
      cal: new FormControl(1),
      speed: new FormControl(1),
      bins: new FormControl(100)
    });
    this.formGroup.controls['chartTitle'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((title: string) => {
      this.service.setPeriodFoldingTitle(title);
    });
    this.formGroup.controls['dataLabel'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((label: string) => {
      this.service.setPeriodFoldingDataLabel(label);
    });
    this.formGroup.controls['xAxisLabel'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((label: string) => {
      this.service.setPeriodFoldingXAxisLabel(label);
    });
    this.formGroup.controls['yAxisLabel'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((label: string) => {
      this.service.setPeriodFoldingYAxisLabel(label);
    });
    this.formGroup.controls['cal'].valueChanges.pipe(
      debounceTime(700),
    ).subscribe((label: number) => {  
      this.service.setPeriodFoldingCal(label);
    });
    this.formGroup.controls['speed'].valueChanges.pipe(
      debounceTime(700),
    ).subscribe((label: number) => {
      this.service.setPeriodFoldingSpeed(label);
    });
    this.formGroup.controls['bins'].valueChanges.pipe(
      debounceTime(700),
    ).subscribe((label: number) => {
      this.service.setPeriodFoldingBins(label);
    });
    this.formGroup.controls['displayPeriod'].valueChanges.pipe(
      debounceTime(200),
    ).subscribe((period: PulsarDisplayPeriod) => {
      this.service.setPeriodFoldingDisplayPeriod(period);
      this.periodStep = this.getPeriodStep();
    });
    this.service.periodFoldingForm$.pipe(
      takeUntil(this.destroy$),
    ).subscribe((source: UpdateSource) => {
      this.formGroup.controls['chartTitle'].setValue(this.service.getPeriodFoldingTitle(), {emitEvent: false});
      this.formGroup.controls['dataLabel'].setValue(this.service.getPeriodFoldingDataLabel(), {emitEvent: false});
      this.formGroup.controls['xAxisLabel'].setValue(this.service.getPeriodFoldingXAxisLabel(), {emitEvent: false});
      this.formGroup.controls['yAxisLabel'].setValue(this.service.getPeriodFoldingYAxisLabel(), {emitEvent: false});
      this.formGroup.controls['cal'].setValue(this.service.getPeriodFoldingCal(), {emitEvent: false});
      this.formGroup.controls['speed'].setValue(this.service.getPeriodFoldingSpeed(), {emitEvent: false});
      this.formGroup.controls['bins'].setValue(this.service.getPeriodFoldingBins(), {emitEvent: false});
      this.formGroup.controls['displayPeriod'].setValue(this.service.getPeriodFoldingDisplayPeriod(), {emitEvent: false});

      // Mirror the slider bounds the service holds — the upload handler
      // sets these to (Nyquist, 10s) and Reset Tool restores defaults.
      // Without this, the visible slider would lag behind the persisted
      // range until the user touched a periodogram Compute.
      this.periodMin = this.service.getPeriodFoldingPeriodMin();
      this.periodMax = this.service.getPeriodFoldingPeriodMax();
      this.periodStep = this.getPeriodStep();
      // Push the new bounds into the live slider — the static [minValue]/
      // [maxValue] Inputs are only read once at construction.
      this.periodRangeSubject.next({ min: this.periodMin, max: this.periodMax });

      // Force a clean CD cycle after the synchronous slider/state mutations
      // above. Without this, when this subscriber fires from inside an
      // existing CD-driven chain (upload, compute), Angular's dev-mode
      // verification pass sees [minValue] / [maxValue] bindings change
      // mid-cycle and throws NG0100. The Promise.resolve() defers the
      // detectChanges() to a microtask so it runs after the current CD
      // pass completes, flushing the new state in a fresh cycle. The
      // isComputing$ subscriber below uses the same pattern.
      Promise.resolve().then(() => this.cdr.detectChanges());

      if (source !== UpdateSource.INTERFACE) {
        this.periodSubject.next(this.service.getPeriodFoldingPeriod());
        this.phaseSubject.next(this.service.getPeriodFoldingPhase());
        this.calSubject.next(this.service.getPeriodFoldingCal());
      };
    });
    this.service.isComputing$.pipe(
      takeUntil(this.destroy$),
      skip(1)
    ).subscribe(() => {
      // Compute the new bounds into LOCAL variables — not this.periodMin /
      // this.periodMax — because the periodFoldingForm$ subscriber above
      // fires synchronously inside each service.setPeriodFoldingPeriodMin/
      // Max call below and would re-read the (still stale) Max from the
      // service back into this.periodMax before the second set runs. That
      // would feed the OLD value back into setPeriodFoldingPeriodMax and
      // the new End Period would never land.
      let newMin: number, newMax: number;
      if (this.service.getPeriodogramMethod() === false) {
        newMin = this.service.getPeriodogramStartPeriod();
        newMax = this.service.getPeriodogramEndPeriod();
      } else {
        newMax = 1 / this.service.getPeriodogramStartPeriod();
        newMin = 1 / this.service.getPeriodogramEndPeriod();
      }
      this.service.setPeriodFoldingPeriodMin(newMin);
      this.service.setPeriodFoldingPeriodMax(newMax);
      // After both service calls have committed, the periodFoldingForm$
      // subscriber has synced this.periodMin / this.periodMax for us.
      // Push the final range to the live slider.
      this.periodRangeSubject.next({ min: newMin, max: newMax });
      Promise.resolve().then(() => this.cdr.detectChanges());
    });
    this.service.data$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => {
      this.periodStep = this.getPeriodStep();
    });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveGraph() {
    this.honorCodeService.honored().subscribe((name: string) => {
      this.chartService.saveImageHighChartOffline(this.service.getHighChartPeriodFolding(), "Pulsar Period Folding", name);
    })
  }

  resetSliderWithValue(newValue: number) {
    this.showSlider = false; // destroy the component
    setTimeout(() => {
      this.periodSubject = new BehaviorSubject<number>(newValue);
      this.showSlider = true; // recreate the component
    });
  }  

  resetForm() {
    this.service.resetPeriodFoldingForm();
  }

  resetPulsar() {
    this.service.resetPeriodFoldingForm();
    this.service.resetChartInfo();
    this.service.resetPeriodogram();
    // Clear the persisted periodogram trace so the chart comes back empty
    // instead of redrawing the last Lomb-Scargle result on the next load.
    // The periodogram chart's setData guard skips rendering for this
    // placeholder shape, so the chart shows nothing until the user computes.
    this.service.setChartComputedPeriodogramDataArray([[0], [0]]);
    // Restore the background-scale slider to its default. Previous file
    // tuning shouldn't carry over to the next upload.
    this.service.setbackScale(3);
    // Send the user back to the light curve tab so they can upload the next
    // file. Pre-persistence the tab implicitly defaulted to 0 on reload;
    // now that tab index survives refresh, we have to set it explicitly.
    this.service.setTabIndex(0);
    this.service.resetData();
    window.location.reload();
  }

  sonification() {
    if (this.calFile) {
        const data = this.service.getPeriodFoldingChartData();
        let binnedData = this.service.binData(data['data'], this.service.getPeriodFoldingBins());
        const xValues = binnedData.map(point => point[0]);
        const yValues = binnedData.map(point => point[1]);

        let binnedData2 = this.service.binData(data['data2'], this.service.getPeriodFoldingBins());
        const yValues2 = binnedData2.map(point => point[1]);
        
        this.service.sonification(xValues, yValues, yValues2, this.service.getPeriodFoldingPeriod(), this.service.getPeriodFoldingTitle()); 
      } else {
        const rawData = this.service.getData()
        .filter(item => item.jd !== null && item.source1 !== null);
      
        const xValues = rawData.map(item => Number(item.jd));
        const yValues = rawData.map(item => Number(item.source1));
        
        this.service.sonification(xValues, yValues, null, this.service.getPeriodFoldingPeriod(), this.service.getPeriodFoldingTitle());
      }
  }

  get isPlaying(): boolean {
    return this.service.isPlaying;
  }  

  sonificationBrowser() {
    if (this.calFile) {
        const data = this.service.getPeriodFoldingChartData();
        let binnedData = this.service.binData(data['data'], this.service.getPeriodFoldingBins());
        const xValues = binnedData.map(point => point[0]);
        const yValues = binnedData.map(point => point[1]);

        let binnedData2 = this.service.binData(data['data2'], this.service.getPeriodFoldingBins());
        const yValues2 = binnedData2.map(point => point[1]);
        
        this.service.sonificationBrowser(xValues, yValues, yValues2, this.service.getPeriodFoldingPeriod()); 
      } else {
        const rawData = this.service.getData()
        .filter(item => item.jd !== null && item.source1 !== null);
      
        const xValues = rawData.map(item => Number(item.jd));
        const yValues = rawData.map(item => Number(item.source1));
        
        this.service.sonificationBrowser(xValues, yValues, null, this.service.getPeriodFoldingPeriod());
      }
  }

  onChange($event: InputSliderValue) {
    if ($event.key === 'period') {
      if ($event.value > 0) {
        if (this.calFile) {
          this.service.setPeriodFoldingPeriod($event.value);
        };
        this.periodStep = this.getPeriodStep();
      }
    } else if ($event.key === 'phase') {
      this.service.setPeriodFoldingPhase($event.value);
    } else if ($event.key === 'calibration') {
      this.service.setPeriodFoldingCal($event.value);
    } else if ($event.key === 'speed') {
      this.service.setPeriodFoldingSpeed($event.value);
    }
  }

  getPeriodStep() {
    const someVal = Math.pow(this.service.getPeriodFoldingPeriod(), 2) * 0.01 / this.service.getJdRange();
    if (someVal > 10e-6) {
      return parseFloat(someVal.toFixed(4));
    } else {
      return 10e-6;
    }
  }
}
