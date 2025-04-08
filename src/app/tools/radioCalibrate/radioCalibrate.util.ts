import {MyStorage} from "../shared/storage/storage.interface";

export enum RadioCalibrateSources {
    CAS_A = 'Cas A',
    CYG_A = 'Cyg A',
    TAU_A = 'Tau A',
    VIR_A = 'Vir A',
}

export interface RadioCalibrateInput {
    source: RadioCalibrateSources,
    startFreq: number,
    endFreq: number,
    date: Date,
}

export interface RadioCalibrateOutput {
    flux: number | null,
    fluxError: number | null,
    effectiveFrequency: number | null,
}

export interface RadioCalibrateStorageObject {
    input: RadioCalibrateInput,
}

export class RadioCalibrateData {
    private input: RadioCalibrateInput;
    private output: RadioCalibrateOutput;

    constructor() {
        this.input = RadioCalibrateData.getDefaultStorageObject().input;
        this.output = this.compute();
    }

    public getInput(): RadioCalibrateInput {
        return this.input;
    }

    public getOutput(): RadioCalibrateOutput {
        return this.output;
    }

    public setInput(input: RadioCalibrateInput): void {
        this.input = input;
        this.output = this.compute();
    }

    public getStorageObject(): RadioCalibrateStorageObject {
        return {
            input: this.input,
        };
    }

    public setStorageObject(storageObject: RadioCalibrateStorageObject): void {
        this.input= {
            source: storageObject.input.source,
            startFreq: storageObject.input.startFreq,
            endFreq: storageObject.input.endFreq,
            date: new Date(Date.parse(storageObject.input.date as unknown as string)),
        }
        this.output = this.compute();
    }

    static getDefaultStorageObject(): RadioCalibrateStorageObject {
        return {
            input: {
                source: RadioCalibrateSources.CAS_A,
                startFreq: 1355,
                endFreq: 1435,
                date: new Date(2002, 6, 19),
            }
        };
    }

    // Compute the output and modify the fields of the output object
    private compute(): RadioCalibrateOutput {
        if (this.input.startFreq >= this.input.endFreq || this.input.date.getUTCFullYear() < 2000 || this.input.startFreq < 0 || this.input.endFreq < 0) {
            return {
                flux: null,
                fluxError: null,
                effectiveFrequency: null,
            }
        }

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
        let t = this.input.date.getUTCFullYear() + this.input.date.getUTCMonth() / 12 + this.input.date.getUTCDate()/30;

        if (this.input.source == RadioCalibrateSources.CAS_A) {
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
        } else if (this.input.source == RadioCalibrateSources.CYG_A) {
            t_ref = 0
            t_0 = 0
            logF_0 = 3.1861
            a_1 = -1.038
            nu_ref = 1416
            a_2 = -0.1457
            a_3 = 0.0170
            mnu_0 = 0
            mdeltlog = 0
            nu_0 = 1 //should be null, just need to avoid dividing by zero -- Math.log10(nu / nu_0) will never be zero because nu is never negative or zero
            varianceLogF_0 = 0.0046 ** 2
            variancea_1 = 0.011 ** 2
            variencea_2 = 0.0075 ** 2
            variencea_3 = 0.0075 ** 2
            variencemnu_0 = 0
            variencemdeltlog = 0
        } else if (this.input.source == RadioCalibrateSources.TAU_A) {
            t_ref = 2009.05
            t_0 = 2009.05
            logF_0 = 2.9083
            a_1 = -0.226
            nu_ref = 1569
            a_2 = -0.0113
            a_3 = -0.0275
            mnu_0 = -0.00044
            mdeltlog = 0
            nu_0 = 1 //should be null, just need to avoid dividing by zero -- Math.log10(nu / nu_0) will never be zero because nu is never negative or zero
            varianceLogF_0 = 0.0044 ** 2
            variancea_1 = 0.014 ** 2
            variencea_2 = 0.0081 ** 2
            variencea_3 = 0.0077 ** 2
            variencemnu_0 = 0.00019 ** 2
            variencemdeltlog = 0
        } else if (this.input.source == RadioCalibrateSources.VIR_A) {
            t_ref = 0
            t_0 = 0
            logF_0 = 2.3070
            a_1 = -0.876
            nu_ref = 1482
            a_2 = -0.047
            a_3 = -0.073
            mnu_0 = 0
            mdeltlog = 0
            nu_0 = 1 //should be null, just need to avoid dividing by zero -- Math.log10(nu / nu_0) will never be zero because nu is never negative or zero
            varianceLogF_0 = 0.0045 ** 2
            variancea_1 = 0.017 ** 2
            variencea_2 = 0.0031 ** 2
            variencea_3 = 0.0030 ** 2
            variencemnu_0 = 0
            variencemdeltlog = 0
        }

        // use the trapezoidal rule to aproximate eq 14 -- stepsize 0.001
        let deltax = (this.input.endFreq - this.input.startFreq) / 100000
        for (let nu = this.input.startFreq; nu < this.input.endFreq + deltax; nu = nu + deltax) {
            if (nu == this.input.startFreq || nu == this.input.endFreq) {
                let equation14 = logF_0 + a_1 * Math.log10(nu / nu_ref) + a_2 * (Math.log10(nu / nu_ref)) ** 2 + a_3 * (Math.log10(nu / nu_ref)) ** 3
                    + (mnu_0 * (t - t_ref) + mdeltlog * (t - t_0) * Math.log10(nu / nu_0))
                // Keeping the temporal component in the equation, since they will drop anyway for all unecessary sources
                let equation15 = Math.sqrt(varianceLogF_0 + variancea_1 * (Math.log10(nu / nu_ref)) ** 2 + variencea_2 * (Math.log10(nu / nu_ref)) ** 4
                    + variencea_3 * (Math.log10(nu / nu_ref)) ** 6 + variencemnu_0 * (t - t_ref) ** 2 + variencemdeltlog * (Math.log10(nu / nu_0)) ** 2 * (t - t_0) ** 2)
                let effectiveFreq = nu * 10 ** (logF_0 + a_1 * Math.log10(nu / nu_ref) + a_2 * (Math.log10(nu / nu_ref)) ** 2 + a_3 * (Math.log10(nu / nu_ref)) ** 3
                    + (mnu_0 * (t - t_ref) + mdeltlog * (t - t_0) * Math.log10(nu / nu_0)))
                fluxSum += 10 ** (equation14)
                sigmaFluxSum += 10 ** (equation14 + equation15)
                effectiveFreqSum += effectiveFreq
            }
            if (this.input.startFreq < nu && nu < this.input.endFreq) {
                let equation14 = logF_0 + a_1 * Math.log10(nu / nu_ref) + a_2 * (Math.log10(nu / nu_ref)) ** 2 + a_3 * (Math.log10(nu / nu_ref)) ** 3
                    + (mnu_0 * (t - t_ref) + mdeltlog * (t - t_0) * Math.log10(nu / nu_0))
                let equation15 = Math.sqrt(varianceLogF_0 + variancea_1 * (Math.log10(nu / nu_ref)) ** 2 + variencea_2 * (Math.log10(nu / nu_ref)) ** 4
                    + variencea_3 * (Math.log10(nu / nu_ref)) ** 6 + variencemnu_0 * (t - t_ref) ** 2 + variencemdeltlog * (Math.log10(nu / nu_0)) ** 2 * (t - t_0) ** 2)
                let effectiveFreq = nu * 10 ** (logF_0 + a_1 * Math.log10(nu / nu_ref) + a_2 * (Math.log10(nu / nu_ref)) ** 2 + a_3 * (Math.log10(nu / nu_ref)) ** 3
                    + (mnu_0 * (t - t_ref) + mdeltlog * (t - t_0) * Math.log10(nu / nu_0)))
                fluxSum += 10 ** (equation14) * 2
                // adding equation 14 to 15 gives us the value of the flux one sigma above the average -- our method of getting uncertainty
                sigmaFluxSum += 10 ** (equation14 + equation15) * 2
                effectiveFreqSum += effectiveFreq * 2
            }
        }
        let finalAvgFlux = (fluxSum * deltax / 2) / (this.input.endFreq - this.input.startFreq)
        let finalSigmaAvgFlux = (sigmaFluxSum * deltax / 2) / (this.input.endFreq - this.input.startFreq)
        let uncertainty = finalSigmaAvgFlux - finalAvgFlux
        let finalEffectiveFreq = (effectiveFreqSum * deltax / 2) / (finalAvgFlux * (this.input.endFreq - this.input.startFreq))
        return {
            flux: finalAvgFlux,
            fluxError: uncertainty,
            effectiveFrequency: finalEffectiveFreq,
        }
    }
}

export class RadioCalibrateStorage implements MyStorage {
    private readonly interfaceKey: string = "radio-calibrate-interface";
    private readonly defaultInterface: RadioCalibrateStorageObject;

    constructor(defaultObject: RadioCalibrateStorageObject) {
        this.defaultInterface = defaultObject;
    }

    getData(): any[] {
        throw new Error("Method not implemented.");
    }

    saveData(data: any[]): void {
        throw new Error("Method not implemented.");
    }

    getChartInfo() {
        throw new Error("Method not implemented.");
    }

    saveChartInfo(chartInfo: any): void {
        throw new Error("Method not implemented.");
    }

    getInterface(): RadioCalibrateStorageObject {
        if (localStorage.getItem(this.interfaceKey)) {
            return JSON.parse(localStorage.getItem(this.interfaceKey)!);
        } else
            return this.defaultInterface;
    }

    saveInterface(interfaceObject: RadioCalibrateStorageObject): void {
        localStorage.setItem(this.interfaceKey, JSON.stringify(interfaceObject));
    }

    resetData(): void {
        throw new Error("Method not implemented.");
    }

    resetInterface(): void {
        localStorage.setItem(this.interfaceKey, JSON.stringify(this.defaultInterface));
    }

    resetChartInfo(): void {
        throw new Error("Method not implemented.");
    }

}

