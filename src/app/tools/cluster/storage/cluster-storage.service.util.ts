import {ClusterLookUpData} from "../data-source/cluster-data-source.service.util";
import {JobStorageObject} from "../../../shared/job/job";
import {Source} from "../cluster.util";
import {FsrParameters} from "../FSR/fsr.util";

export interface ClusterStorageObject {
  step: number;
  name: string;
  sources: Source[];
  userPhotometry: Source[] | null;
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
  pmra: number | null,
  pmdec: number | null,
}
