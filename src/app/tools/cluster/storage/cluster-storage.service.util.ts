import {ClusterLookUpData, ClusterRawData} from "../data-source/cluster-data-source.service.util";
import {Job} from "../../../shared/job/job";
import {Catalogs} from "../cluster.util";

export interface ClusterStorageObject {
  step: number;
  dataSource: DataSourceStorageObject;
}

interface FileUploadStorageObject {
  rawData: ClusterRawData[];
  FSRJob: Job | null;
}

interface LookUpStorageObject {
  ra: number;
  dec: number;
  radius: number;
  catalog: Catalogs;

}

export interface DataSourceStorageObject {
  name: string | null;
  recentSearches: ClusterLookUpData[];
  fileUpload: FileUploadStorageObject;
}
