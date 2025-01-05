/**
 *  This function takes an angle in degrees and returns it in radians.
 *  @param degree:  An angle in degrees
 *  @returns {number}
 */
export function rad(degree: number): number {
    return degree / 180 * Math.PI;
}

export function deg(degree: number): number {
    return degree / Math.PI * 180;
}


/**
 * This function computes the floating point modulo.
 * @param {number} a The dividend
 * @param {number} b The divisor
 */
export function floatMod(a: number, b: number) {
    while (a > b) {
        a -= b;
    }
    return a;
}


/**
 * This function computes the Error Considered Lomb Scargle periodogram for a given set of time/observation data.
 * @param {array(number)} ts The array of time values
 * @param {array{number}} ys They array of observation values. The length of ys and ts must match
 * @param {number}  start the starting period
 * @param {number} stop the stopin period
 * @param {number} steps number of steps between start and stop. Default is 1000.
 */
export function lombScargleWithError(ts: number[], ys: number[], error: number[], start: number, stop: number, steps: number = 1000, freqMode = false): any[] {

    if (ts.length != ys.length) {
        alert("Dimension mismatch between time array and value array.");
        return [];
    }

    let step = (stop - start) / steps;

    // Nyquist is not used here. But it became useful for default frequency ranges in
    // Fourier transform!! (In pulsar mode).
    // let nyquist = 1.0 / (2.0 * (ArrMath.max(ts) - ArrMath.min(ts)) / ts.length);
    let hResidue = ArrMath.sub(ys, ArrMath.errorMean(ys, error));
    let twoVarOfY = 2 * ArrMath.var(ys);

    // xVal is what we iterate through & push to result. It will either be frequency or
    // period, depending on the mode.
    let spectralPowerDensity = [];
    let i = 0
    for (let xVal = start; xVal < stop; xVal += step) {
        // Huge MISTAKE was here: I was plotting power vs. frequency, instead of power vs. period

        let logXVal = Math.exp(Math.log(start) + (Math.log(stop) - Math.log(start)) * i / (steps))

        // let frequency = freqMode ? xVal : 1 / xVal;
        let frequency = freqMode ? logXVal : 1 / logXVal;

        let omega = 2.0 * Math.PI * frequency;
        let twoOmegaT = ArrMath.mul(2 * omega, ts);
        let tau = Math.atan2(ArrMath.sum(ArrMath.sin(twoOmegaT)), ArrMath.sum(ArrMath.cos(twoOmegaT))) / (2.0 * omega);
        let omegaTMinusTau = ArrMath.mul(omega, ArrMath.sub(ts, tau));

        spectralPowerDensity.push(
            [logXVal,
                (Math.pow(ArrMath.errordot(hResidue, error, ArrMath.cos(omegaTMinusTau)), 2.0) /
                    ArrMath.dot(ArrMath.cos(omegaTMinusTau)) +
                    Math.pow(ArrMath.errordot(hResidue, error, ArrMath.sin(omegaTMinusTau)), 2.0) /
                    ArrMath.dot(ArrMath.sin(omegaTMinusTau))) / twoVarOfY,]);
        i++
    }

    return spectralPowerDensity;
}


export function lombScargle(ts: number[], ys: number[], start: number, stop: number, steps: number = 1000, freqMode = false): any[] {
    if (ts.length != ys.length) {
        alert("Dimension mismatch between time array and value array.");
        return [];
    }

    let step = (stop - start) / steps;

    // Nyquist is not used here. But it became useful for default frequency ranges in
    // Fourier transform!! (In pulsar mode).
    // let nyquist = 1.0 / (2.0 * (ArrMath.max(ts) - ArrMath.min(ts)) / ts.length);
    let hResidue = ArrMath.sub(ys, ArrMath.mean(ys));
    let twoVarOfY = 2 * ArrMath.var(ys);

    // xVal is what we iterate through & push to result. It will either be frequency or
    // period, depending on the mode.
    let spectralPowerDensity = [];
    let i = 0;
    for (let xVal = start; xVal < stop; xVal += step) {
        // Huge MISTAKE was here: I was plotting power vs. frequency, instead of power vs. period

        let logXVal = Math.exp(Math.log(start)+(Math.log(stop)-Math.log(start))*i/(steps))
        let frequency = freqMode ? logXVal : 1 / logXVal;
        if(freqMode === true){
            frequency = freqMode ? xVal : 1 / xVal;
            logXVal = xVal
        }

        let omega = 2.0 * Math.PI * frequency;
        let twoOmegaT = ArrMath.mul(2 * omega, ts);
        let tau = Math.atan2(ArrMath.sum(ArrMath.sin(twoOmegaT)), ArrMath.sum(ArrMath.cos(twoOmegaT))) / (2.0 * omega);
        let omegaTMinusTau = ArrMath.mul(omega, ArrMath.sub(ts, tau));

        spectralPowerDensity.push({
            x: logXVal,
            y: (Math.pow(ArrMath.dot(hResidue, ArrMath.cos(omegaTMinusTau)), 2.0) /
                ArrMath.dot(ArrMath.cos(omegaTMinusTau)) +
                Math.pow(ArrMath.dot(hResidue, ArrMath.sin(omegaTMinusTau)), 2.0) /
                ArrMath.dot(ArrMath.sin(omegaTMinusTau))) / twoVarOfY,
        });
        i++;
    }

    return spectralPowerDensity;
}


const ArrMath = {
    max: function (arr: number[]): number {
        return Math.max.apply(null, arr);
    },
    min: function (arr: number[]): number {
        return Math.min.apply(null, arr);
    },
    sum: function (arr: number[]): number {
        return arr.reduce((acc, cur) => acc + cur, 0);
    },
    weightedSum: function (arr: number[], weight: number[]): number {
        let summed = 0;
        for (let i = 0; i < arr.length; i++) {
            summed = summed + arr[i] * weight[i];
        }

        return summed
    },
    mean: function (arr: number[]): number {
        return this.sum(arr) / arr.length;
    },
    errorMean: function (arr: number[], error: number[]) {
        let weight = [];
        for (let i = 0; i < arr.length; i++) {
            weight[i] = 1 / (error[i] * error[i])
        }

        return this.weightedSum(arr, weight) / this.sum(weight)

    },
    mul: function (arr1: number[] | number, arr2: number[] | number): number[] {
        if (Array.isArray(arr1) && Array.isArray(arr2)) {
            console.assert(arr1.length === arr2.length,
                "Error: Dimension mismatch when multiplying two arrays.");
            return arr1.map((x, i) => x * arr2[i]);
        } else if (Array.isArray(arr1)) {
            return arr1.map(x => x * (arr2 as number));
        } else if (Array.isArray(arr2)) {
            return arr2.map(x => x * (arr1 as number));
        } else {
            throw new TypeError("Error: Do not use ArrMath for scalar multiplications");
        }
    },
    div: function (arr1: number[] | number, arr2: number[] | number): number[] {
        if (Array.isArray(arr1) && Array.isArray(arr2)) {
            console.assert(arr1.length === arr2.length,
                "Error: Dimension mismatch when dividing two arrays.");
            return arr1.map((x, i) => x / arr2[i]);
        } else if (Array.isArray(arr1)) {
            return arr1.map(x => x / (arr2 as number));
        } else if (Array.isArray(arr2)) {
            return arr2.map(x => x / (arr1 as number));
        } else {
            throw new TypeError("Error: Do not use ArrMath for scalar divisions");
        }
    },
    add: function (arr1: number[] | number, arr2: number[] | number): number[] {
        if (Array.isArray(arr1) && Array.isArray(arr2)) {
            console.assert(arr1.length === arr2.length,
                "Error: Dimension mismatch when adding two arrays.");
            return arr1.map((x, i) => x + arr2[i]);
        } else if (Array.isArray(arr1)) {
            return arr1.map(x => x + (arr2 as number));
        } else if (Array.isArray(arr2)) {
            return arr2.map(x => x + (arr1 as number));
        } else {
            throw new TypeError("Error: Do not use ArrMath for scalar additions");
        }
    },
    sub: function (arr1: number[] | number, arr2: number[] | number): number[] {
        if (Array.isArray(arr1) && Array.isArray(arr2)) {
            console.assert(arr1.length === arr2.length,
                "Error: Dimension mismatch when subtracting two arrays.");
            return arr1.map((x, i) => x - arr2[i]);
        } else if (Array.isArray(arr1)) {
            return arr1.map(x => x - (arr2 as number));
        } else if (Array.isArray(arr2)) {
            return arr2.map(x => x - (arr1 as number));
        } else {
            throw new TypeError("Error: Do not use ArrMath for scalar subtractions");
        }
    },
    dot: function (arr1: number[] | number, arr2?: number[] | number): number {
        if (arr2 === undefined) {
            return this.dot(arr1, arr1);
        }
        if (Array.isArray(arr1) && Array.isArray(arr2)) {
            console.assert(arr1.length === arr2.length,
                "Error: Dimension mismatch when dot multiplying two arrays.");
            return arr1.reduce((acc, cur, i) => (acc + cur * arr2[i]), 0);
        } else if (!Array.isArray(arr1) && !Array.isArray(arr2)) {
            return arr1 * arr2;
        } else {
            throw new TypeError("Error: Can't take dot product of a vector and a number");
        }
    },
    errordot: function (arr1: number[] | number, error: number[] | number, arr2?: number[] | number,): number {
        if (arr2 === undefined) {
            return this.errordot(arr1, error, arr1);
        }
        if (Array.isArray(arr1) && Array.isArray(arr2) && Array.isArray(error)) {
            console.assert(arr1.length === arr2.length,
                "Error: Dimension mismatch when dot multiplying two arrays.");
            let weight = [];
            let dotlist = []
            for (let i = 0; i < arr1.length; i++) {
                weight[i] = 1 / (error[i] * error[i])
                dotlist.push(arr1[i] * arr2[i])
            }

            return this.weightedSum(dotlist, weight) / this.sum(weight);
        } else if (!Array.isArray(arr1) && !Array.isArray(arr2) && !Array.isArray(error)) {
            return arr1 * arr2;
        } else {
            throw new TypeError("Error: Can't take dot product of a vector and a number");
        }
    },
    cos: function (arr: number[]): number[] {
        return arr.map(x => Math.cos(x));
    },
    sin: function (arr: number[]): number[] {
        return arr.map(x => Math.sin(x));
    },
    var: function (arr: number[]): number {
        // Variance
        let mean = this.mean(arr);
        return this.sum(arr.map(x => Math.pow(x - mean, 2))) / arr.length;
    }
}

export enum UpdateSource {
    INIT = "init",
    RESET = "reset",
    INTERFACE = "interface",
}

export function d2HMS(d: number): number[] {
    const hours = Math.floor(d / 15);
    const minutes = Math.floor((d - hours * 15) * 4);
    const seconds = ((d - hours * 15) * 4 - minutes) * 60;
    return [hours, minutes, seconds];
}

export function d2DMS(d: number): number[] {
    const sign = d < 0 ? '-' : '+';
    d = Math.abs(d);
    const degrees = Math.floor(d);
    const minutes = Math.floor((d - degrees) * 60);
    const seconds = ((d - degrees) * 60 - minutes) * 60;
    return [degrees, minutes, seconds];
}
