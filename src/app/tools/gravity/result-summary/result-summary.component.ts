import {Component} from '@angular/core';
import { downloadCsv } from '../../cluster/result/result.utils';
import { getDateString } from '../../shared/charts/utils';
import {HonorCodeChartService} from "../../shared/honor-code-popup/honor-code-chart.service";
import {HonorCodePopupService} from "../../shared/honor-code-popup/honor-code-popup.service";
import {HttpClient} from "@angular/common/http";
import { InterfaceService } from '../gravity-form/gravity-interface.service';
import { calculateMassLoss } from '../gravity.service.util';
import { SpectogramService } from '../gravity-spectogram/gravity-spectogram.service';
import { StrainService } from '../gravity-strainchart/gravity-strain.service';

@Component({
    selector: 'app-result-summary',
    templateUrl: './result-summary.component.html',
    styleUrls: ['./result-summary.component.scss']
})
export class ResultSummaryComponent {
    mergerTime!: number;
    totalMass!: number;
    massRatio!: number;
    phaseShift!: number;
    distance!: number;
    inclination!: number;
    finalMass!: number;
    massLoss!: number;

    protected readonly Math = Math;
    plotDownloading = false;

    constructor(public service: InterfaceService,
                private strainService: StrainService,
                private spectoService: SpectogramService,
                private honorCodeService: HonorCodePopupService,
                private chartService: HonorCodeChartService) {
        
        //creating a seperate function in case init needs to be delayed
        this.fetchValues();

        service.serverParameters$.subscribe(() => {
            let total_mass = this.service.getTotalMass()
            this.massLoss = calculateMassLoss(total_mass, this.service.getMassRatio())
            this.finalMass = total_mass - this.massLoss
        })
    }

    fetchValues() {
        this.mergerTime  = this.service.getMergerTime()
        this.totalMass   = this.service.getTotalMass()
        this.massRatio   = this.service.getMassRatio()
        this.phaseShift  = this.service.getPhaseShift()
        this.distance    = this.service.getDistance()
        this.inclination = this.service.getInclination()
    }

    downloadSummary() {
        this.honorCodeService.honored().subscribe(() => {
            this.fetchValues()
            downloadCsv(
                ['merger_time', 'total_mass', 'mass_ratio', 'phase_shift', 'distance',
                    'inclination', 'final_mass', 'mass_loss'],
                [[
                    this.mergerTime, this.totalMass, this.massRatio, this.phaseShift, this.distance,
                    this.inclination, this.finalMass.toFixed(3), this.massLoss.toFixed(3)]],
                `${name}_summary_${getDateString()}`
            );
        });
    }

    // downloadData() {
    //     this.honorCodeService.honored().subscribe(() => {
    //         this.dataService.downloadSources();
    //     });
    // }

    downloadPlots() {
        // this.plotDownloading = true;
        this.honorCodeService.honored().subscribe((name: string) => {
            this.chartService.saveImageHighChartsOffline(
                [this.spectoService.getHighChart(), this.strainService.getHighChart(), ], 1, name, "gravity");
        });
    }
}
