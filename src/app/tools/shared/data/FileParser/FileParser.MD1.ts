import {Subject} from "rxjs";
import {HeaderRequirement, MyFileParserErrors, MyFileParserStrategy} from "./FileParser.util";

const MD1_FIELDS: {[key: string]: number} = {
  time: 0,
  declination: 1,
  power: 2,
};
const INPUT_SAMPLE_RATE_HZ = 99.8;
const LOW_PASS_CUTOFF_HZ = 5;
const DECIMATION_STRIDE = 10;
const BUTTERWORTH_Q = [0.541196100146197, 1.3065629648763766];

interface BiquadCoefficients {
  b0: number;
  b1: number;
  b2: number;
  a1: number;
  a2: number;
}

export class MyFileParserMD1 implements MyFileParserStrategy {
  getData(fileText: string,
          fields: string[],
          fieldsIndices: {[key: string]: number}): any[] | undefined {
    if (fields.length === 0 || fields.length !== Object.keys(fieldsIndices).length) {
      return undefined;
    }

    const segments: number[][] = [];
    let values: number[] = [];
    for (const rawLine of fileText.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (line === "*") {
        if (values.length > 0) {
          segments.push(values);
          values = [];
        }
        continue;
      }
      if (line === "" || line.includes(":")) {
        continue;
      }

      const value = Number(line);
      if (!Number.isFinite(value)) {
        return undefined;
      }
      values.push(value);
    }
    if (values.length > 0) {
      segments.push(values);
    }

    if (segments.length === 0 || segments.some(segment => segment.length % 3 !== 0)) {
      return undefined;
    }

    // Gain calibration sections surround the observation and are much shorter.
    const observation = segments.reduce((longest, segment) =>
      segment.length > longest.length ? segment : longest);
    const rows: number[][] = [];
    for (let index = 0; index < observation.length; index += 3) {
      rows.push(observation.slice(index, index + 3));
    }

    const positiveRows = rows.filter(row => row[MD1_FIELDS['power']] > 0);
    if (positiveRows.length === 0) {
      return undefined;
    }

    const smoothedPower = this.zeroPhaseLowPass(
      positiveRows.map(row => row[MD1_FIELDS['power']])
    );
    const startTime = positiveRows[0][MD1_FIELDS['time']];
    const decimatedRows: number[][] = [];
    for (let index = 0; index < positiveRows.length; index += DECIMATION_STRIDE) {
      if (smoothedPower[index] <= 0) {
        continue;
      }
      decimatedRows.push([
        startTime + index / INPUT_SAMPLE_RATE_HZ,
        positiveRows[index][MD1_FIELDS['declination']],
        smoothedPower[index],
      ]);
    }

    const data: any[] = [];
    for (const values of decimatedRows) {
      const row: {[key: string]: number} = {};
      fields.forEach((field: string) => {
        row[field] = values[fieldsIndices[field]];
      });
      data.push(row);
    }
    return data;
  }

  private zeroPhaseLowPass(samples: number[]): number[] {
    if (samples.length < 2) {
      return [...samples];
    }

    const padLength = Math.min(15, samples.length - 1);
    const first = samples[0];
    const last = samples[samples.length - 1];
    const padded = [
      ...samples.slice(1, padLength + 1).reverse().map(value => 2 * first - value),
      ...samples,
      ...samples.slice(samples.length - padLength - 1, samples.length - 1)
        .reverse().map(value => 2 * last - value),
    ];

    const forward = this.filterButterworth(padded);
    const backward = this.filterButterworth([...forward].reverse()).reverse();
    return backward.slice(padLength, padLength + samples.length);
  }

  private filterButterworth(samples: number[]): number[] {
    return BUTTERWORTH_Q.reduce(
      (filtered, q) => this.filterBiquad(filtered, this.lowPassCoefficients(q)),
      samples
    );
  }

  private lowPassCoefficients(q: number): BiquadCoefficients {
    const angularFrequency = 2 * Math.PI * LOW_PASS_CUTOFF_HZ / INPUT_SAMPLE_RATE_HZ;
    const cosine = Math.cos(angularFrequency);
    const alpha = Math.sin(angularFrequency) / (2 * q);
    const a0 = 1 + alpha;
    return {
      b0: (1 - cosine) / (2 * a0),
      b1: (1 - cosine) / a0,
      b2: (1 - cosine) / (2 * a0),
      a1: -2 * cosine / a0,
      a2: (1 - alpha) / a0,
    };
  }

  private filterBiquad(samples: number[], coefficients: BiquadCoefficients): number[] {
    const first = samples[0];
    let z1 = first * (1 - coefficients.b0);
    let z2 = first * (coefficients.b2 - coefficients.a2);
    return samples.map(sample => {
      const output = coefficients.b0 * sample + z1;
      z1 = coefficients.b1 * sample - coefficients.a1 * output + z2;
      z2 = coefficients.b2 * sample - coefficients.a2 * output;
      return output;
    });
  }

  getFieldsIndices(_fileText: string, dataKeys: string[]): {[key: string]: number} | undefined {
    const indices: {[key: string]: number} = {};
    for (const dataKey of dataKeys) {
      if (!(dataKey in MD1_FIELDS)) {
        return undefined;
      }
      indices[dataKey] = MD1_FIELDS[dataKey];
    }
    return indices;
  }

  getHeaders(fileText: string,
             headerRequirements: HeaderRequirement[]): {[key: string]: string} | undefined {
    const headers: {[key: string]: string} = {};
    fileText.split(/\r?\n/).forEach((rawLine: string) => {
      const line = rawLine.trim();
      const separatorIndex = line.indexOf(":");
      if (separatorIndex > 0) {
        headers[line.slice(0, separatorIndex).trim()] = line.slice(separatorIndex + 1).trim();
      }
    });

    const isValid = headerRequirements.every((requirement: HeaderRequirement) =>
      requirement.key in headers &&
      (requirement.value === undefined || headers[requirement.key] === requirement.value));
    return isValid ? headers : undefined;
  }

  readFile(file: File,
           headerRequirements: HeaderRequirement[],
           dataKeys: string[],
           errorSubject: Subject<MyFileParserErrors>,
           dataSubject: Subject<any> | undefined,
           headerSubject: Subject<any> | undefined): void {
    if (!this.validateFormat(file)) {
      errorSubject.next(MyFileParserErrors.FORMAT);
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      const fileText = fileReader.result as string;
      const headers = this.getHeaders(fileText, headerRequirements);
      if (headers === undefined) {
        errorSubject.next(MyFileParserErrors.HEADER);
        return;
      }
      headerSubject?.next(headers);

      const fieldsIndices = this.getFieldsIndices(fileText, dataKeys);
      if (fieldsIndices === undefined) {
        errorSubject.next(MyFileParserErrors.FIELD);
        return;
      }

      const data = this.getData(fileText, dataKeys, fieldsIndices);
      if (data === undefined) {
        errorSubject.next(MyFileParserErrors.DATA);
        return;
      }
      dataSubject?.next(data);
    };
    fileReader.readAsText(file);
  }

  validateFormat(file: File): boolean {
    return file.name.toLowerCase().endsWith(".md1");
  }
}
