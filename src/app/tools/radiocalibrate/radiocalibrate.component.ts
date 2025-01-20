import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
// import { FITSHeaderParser } from '../shared/data/FitsParser/FitsParser';
import {FormControl} from '@angular/forms';
import {MyFileParser} from "../shared/data/FileParser/FileParser";
import {FileType} from "../shared/data/FileParser/FileParser.util";


@Component({
    selector: 'app-radiocalibrate',
    templateUrl: './radiocalibrate.component.html',
    styleUrls: ['./radiocalibrate.component.scss', '../shared/interface/tools.scss'],
})

export class RadiocalibrateComponent implements AfterViewInit {
    ngAfterViewInit(): void {
        this.source = 'Cas A'
    }

    source: string = "w";
    form = new FormControl(); // Form control for the dropdown
    sources: string[] = ['Cas A', 'Cyg A', 'Tau A', 'Vir A']; // Example data for the dropdown


    fitsFileName: string | undefined;
    fitsLoaded: boolean = false;

    startFreq: number = 1355;
    stopFreq: number = 1435;
    Year: number = 2022.95;

    fluxDensity: string | undefined;
    effectiveFrequency: string | undefined;

    fileParser: MyFileParser = new MyFileParser(FileType.FITS, [], []);

    @ViewChild('fileInput', {static: false}) fileInput!: ElementRef<HTMLInputElement>;

    // Event handler for the source dropdown
    onSourceChange(event: any): void {
        this.source = event.value;
        // console.log('Selected source:', this.source);
    }

    // When the user clicks the "Upload" button, trigger the file upload process 
    fitsUpload(): void {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
            console.log("No file selected");
            return;
        }

        const file = input.files[0];
        // validate format
        if (!this.fileParser.validateFormat(file)) {
            console.log("Invalid file format");
            return;
        }

        this.fileParser.getHeaders(file, false, (headers, errorSubject) => {
            if (headers) {
                const startFQ = parseFloat(headers["RCMINFQ"]);
                const stopFQ = parseFloat(headers["RCMAXFQ"]);
                const dateUTC = this.stringToUTC(headers["OBSTIME"]);

                this.startFreq = startFQ;
                this.stopFreq = stopFQ;
                this.Year = dateUTC.getUTCFullYear() + dateUTC.getUTCMonth() / 12 + dateUTC.getUTCDate() / 30;
                this.updateResult();
            }
        });
    }

    computeClicked(): void {
        this.updateResult();
    }

    updateResult(): void {
        let [fluxAvg, uncertainty, finalEffectiveFreq] = this.fluxCalc(
            this.Year, this.startFreq, this.stopFreq, this.source
        );
        this.fluxDensity = this.round(fluxAvg, 1).toString() + " +/- " + this.round(uncertainty, 1).toString();
        this.effectiveFrequency = this.round(finalEffectiveFreq, 1).toString();
    }

    // OBSTIME = '2023-01-12 21:44:34'
    stringToUTC(input: string): Date {
        // remove any single quotes maybe a bug from the fits parser strategy?
        input = input.replace("'", "");
        const [date, time] = input.split(" ");
        const [year, month, day] = date.split("-");
        const [hour, min, sec] = time.split(":");
        const utc: number = Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(min), parseInt(sec));
        return new Date(utc);
    }

    fluxCalc(year: number, startFreq: number, stopFreq: number, source: string) {
        let fluxSum = 0
        let sigmaFluxSum = 0
        let effectiveFreqSum = 0
        let t_ref = 0
        let t_0 = 0
        let logF_0 = 0
        let a_1 = 0
        let nu_ref = 0
        let a_2 = 0
        let a_3 = 0
        let mnu_0 = 0
        let mdeltlog = 0
        let nu_0 = 0
        let varianceLogF_0 = 0
        let variancea_1 = 0
        let variencea_2 = 0
        let variencea_3 = 0
        let variencemnu_0 = 0
        let variencemdeltlog = 0
        let t = year

        if (source == 'Cas A') {
            t_ref = 2006.9
            t_0 = 2005.64
            logF_0 = 3.2530
            a_1 = -0.732
            nu_ref = 1477
            a_2 = -0.0094
            a_3 = 0.0053
            mnu_0 = -0.00350
            mdeltlog = 0.00124
            nu_0 = 1315
            varianceLogF_0 = 0.0051 ** 2
            variancea_1 = 0.011 ** 2
            variencea_2 = 0.0058 ** 2
            variencea_3 = 0.0058 ** 2
            variencemnu_0 = 0.00022 ** 2
            variencemdeltlog = 0.00018 ** 2
        } else if (source == 'Cyg A') {
            t_ref = 0
            t_0 = 0
            logF_0 = 3.1861
            a_1 = -1.038
            nu_ref = 1416
            a_2 = -0.1457
            a_3 = 0.0170
            mnu_0 = 0
            mdeltlog = 0
            nu_0 = 1 //should be null, just need to avoid dividing by zero -- Math.log(nu / nu_0) will never be zero because nu is never negative or zero
            varianceLogF_0 = 0.0046 ** 2
            variancea_1 = 0.011 ** 2
            variencea_2 = 0.0075 ** 2
            variencea_3 = 0.0075 ** 2
            variencemnu_0 = 0
            variencemdeltlog = 0
        } else if (source == 'Tau A') {
            t_ref = 2009.05
            t_0 = 2009.05
            logF_0 = 2.9083
            a_1 = -0.226
            nu_ref = 1569
            a_2 = -0.0113
            a_3 = -0.0275
            mnu_0 = -0.00044
            mdeltlog = 0
            nu_0 = 1 //should be null, just need to avoid dividing by zero -- Math.log(nu / nu_0) will never be zero because nu is never negative or zero
            varianceLogF_0 = 0.0044 ** 2
            variancea_1 = 0.014 ** 2
            variencea_2 = 0.0081 ** 2
            variencea_3 = 0.0077 ** 2
            variencemnu_0 = 0.00019 ** 2
            variencemdeltlog = 0
        } else if (source == 'Vir A') {
            t_ref = 0
            t_0 = 0
            logF_0 = 2.3070
            a_1 = -0.876
            nu_ref = 1482
            a_2 = -0.047
            a_3 = -0.073
            mnu_0 = 0
            mdeltlog = 0
            nu_0 = 1 //should be null, just need to avoid dividing by zero -- Math.log(nu / nu_0) will never be zero because nu is never negative or zero
            varianceLogF_0 = 0.0045 ** 2
            variancea_1 = 0.017 ** 2
            variencea_2 = 0.0031 ** 2
            variencea_3 = 0.0030 ** 2
            variencemnu_0 = 0
            variencemdeltlog = 0
        }

        //make sure the values are within the acceptable range
        if (this.Year < 2000 || this.Year == null) {
            this.Year = 2000
        }
        if (this.startFreq < 10 || this.startFreq == null) {
            this.startFreq = 10
        }
        if (this.stopFreq > 100000 || this.stopFreq == null) {
            this.stopFreq = 100000
        }
        if (this.stopFreq < 10 || this.stopFreq == null) {
            this.stopFreq = 10
        }
        if (this.startFreq > 100000 || this.startFreq == null) {
            this.startFreq = 100000
        }
        if (this.stopFreq < this.startFreq) {
            this.stopFreq = this.startFreq
        }

        // use the trapezoidal rule to aproximate eq 14 -- stepsize 0.001
        let deltax = (stopFreq - startFreq) / 100000
        for (let nu = startFreq; nu < stopFreq + deltax; nu = nu + deltax) {
            if (nu == startFreq || nu == stopFreq) {
                let equation14 = logF_0 + a_1 * Math.log(nu / nu_ref) + a_2 * (Math.log(nu / nu_ref)) ** 2 + a_3 * (Math.log(nu / nu_ref)) ** 3
                    + (mnu_0 * (t - t_ref) + mdeltlog * (t - t_0) * Math.log(nu / nu_0))
                // Keeping the temporal component in the equation, since they will drop anyway for all unecessary sources
                let equation15 = Math.sqrt(varianceLogF_0 + variancea_1 * (Math.log(nu / nu_ref)) ** 2 + variencea_2 * (Math.log(nu / nu_ref)) ** 4
                    + variencea_3 * (Math.log(nu / nu_ref)) ** 6 + variencemnu_0 * (t - t_ref) ** 2 + variencemdeltlog * (Math.log(nu / nu_0)) ** 2 * (t - t_0) ** 2)
                let effectiveFreq = nu * 10 ** (logF_0 + a_1 * Math.log(nu / nu_ref) + a_2 * (Math.log(nu / nu_ref)) ** 2 + a_3 * (Math.log(nu / nu_ref)) ** 3
                    + (mnu_0 * (t - t_ref) + mdeltlog * (t - t_0) * Math.log(nu / nu_0)))
                fluxSum += 10 ** (equation14)
                sigmaFluxSum += 10 ** (equation14 + equation15)
                effectiveFreqSum += effectiveFreq
            }
            if (startFreq < nu && nu < stopFreq) {
                let equation14 = logF_0 + a_1 * Math.log(nu / nu_ref) + a_2 * (Math.log(nu / nu_ref)) ** 2 + a_3 * (Math.log(nu / nu_ref)) ** 3
                    + (mnu_0 * (t - t_ref) + mdeltlog * (t - t_0) * Math.log(nu / nu_0))
                let equation15 = Math.sqrt(varianceLogF_0 + variancea_1 * (Math.log(nu / nu_ref)) ** 2 + variencea_2 * (Math.log(nu / nu_ref)) ** 4
                    + variencea_3 * (Math.log(nu / nu_ref)) ** 6 + variencemnu_0 * (t - t_ref) ** 2 + variencemdeltlog * (Math.log(nu / nu_0)) ** 2 * (t - t_0) ** 2)
                let effectiveFreq = nu * 10 ** (logF_0 + a_1 * Math.log(nu / nu_ref) + a_2 * (Math.log(nu / nu_ref)) ** 2 + a_3 * (Math.log(nu / nu_ref)) ** 3
                    + (mnu_0 * (t - t_ref) + mdeltlog * (t - t_0) * Math.log(nu / nu_0)))
                fluxSum += 10 ** (equation14) * 2
                // adding equation 14 to 15 gives us the value of the flux one sigma above the average -- our method of getting uncertainty
                sigmaFluxSum += 10 ** (equation14 + equation15) * 2
                effectiveFreqSum += effectiveFreq * 2
            }
        }
        let finalAvgFlux = (fluxSum * deltax / 2) / (stopFreq - startFreq)
        let finalSigmaAvgFlux = (sigmaFluxSum * deltax / 2) / (stopFreq - startFreq)
        let uncertainty = finalSigmaAvgFlux - finalAvgFlux
        let finalEffectiveFreq = (effectiveFreqSum * deltax / 2) / (finalAvgFlux * (stopFreq - startFreq))
        //console.log('avg flux: ', finalAvgFlux, 'uncertainty: ', uncertainty)
        return [finalAvgFlux, uncertainty, finalEffectiveFreq]
    }

    round(value: number, digits: number): number {
        return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
    }
}
  