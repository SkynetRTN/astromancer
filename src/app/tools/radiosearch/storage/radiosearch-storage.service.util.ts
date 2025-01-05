import {JobStorageObject} from "../../../shared/job/job";

export interface Source {
    name: string;  // Name of the source
    ra: number;    // Right Ascension (in degrees)
    dec: number;   // Declination (in degrees)
  }

export interface FittingResult {
  slope: number;
  intercept: number;
}

export interface HiddenResults {
  name: string;
  MHz38: number | 'Unknown';
  MHz159: number | 'Unknown';
  MHz178: number | 'Unknown';
  MHz750: number | 'Unknown';
  L1400: number | 'Unknown';
  S2695: number | 'Unknown';
  C5000: number | 'Unknown';
  X8400: number | 'Unknown';
}
  
export interface RadioSearchStorageObject {
    dataSource: DataSourceStorageObject
}

export interface DataSourceStorageObject {
    dataJob: JobStorageObject | null;
    sources: Source[];  // This is where the sources array should be defined
  }

