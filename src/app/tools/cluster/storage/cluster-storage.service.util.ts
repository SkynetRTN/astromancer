import {ClusterLookUpData} from "../data-source/cluster-data-source.service.util";
import {JobStorageObject} from "../../../shared/job/job";
import {Source} from "../cluster.util";

export interface ClusterStorageObject {
  step: number;
  name: string;
  sources: Source[];
  hasFSR: boolean;
  dataSource: DataSourceStorageObject;
}

export interface DataSourceStorageObject {
  recentSearches: ClusterLookUpData[];
  FSRJob: JobStorageObject | null;
  lookUpJob: JobStorageObject | null;
}
