import {ClusterLookUpData} from "../data-source/cluster-data-source.service.util";
import {Job} from "../../../shared/job/job";
import {FILTER, Source} from "../cluster.util";

export interface ClusterStorageObject {
  step: number;
  name: string | null;
  sources: Source[] | null;
  filters: FILTER[] | null;
  dataSource: DataSourceStorageObject;
}

export interface DataSourceStorageObject {
  recentSearches: ClusterLookUpData[];
  FSRJob: Job | null;
  lookUpJob: Job | null;
}
