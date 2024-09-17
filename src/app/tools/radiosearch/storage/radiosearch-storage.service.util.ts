import {JobStorageObject} from "../../../shared/job/job";

export interface Source {
    name: string;  // Name of the source
    ra: number;    // Right Ascension (in degrees)
    dec: number;   // Declination (in degrees)
  }
  
export interface RadioSearchStorageObject {
    dataSource: DataSourceStorageObject
}

export interface DataSourceStorageObject {
    dataJob: JobStorageObject | null;
    sources: Source[];  // This is where the sources array should be defined
  }

