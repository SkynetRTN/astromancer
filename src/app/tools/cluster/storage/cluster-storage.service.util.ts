import {ClusterLookUpData} from "../data-source/cluster-data-source.service.util";
import {JobStorageObject} from "../../../shared/job/job";
import {FsrParameters} from "../FSR/fsr.util";

export interface ClusterStorageObject {
  step: number;
  name: string;
  fetchJobId: number | null;
  fsrJobId: number | null;
  hasFSR: boolean;
  dataSource: DataSourceStorageObject;
  fsrValues: fsrUserValues;
}

export interface DataSourceStorageObject {
  recentSearches: ClusterLookUpData[];
  FSRJob: JobStorageObject | null;
  lookUpJob: JobStorageObject | null;
}

export interface fsrUserValues {
  parameters: FsrParameters,
  framing: FsrParameters,
  bin: fsrHistogramBin,
}

export interface fsrHistogramBin {
  distance: number | null,
  pm_ra: number | null,
  pm_dec: number | null,
}
