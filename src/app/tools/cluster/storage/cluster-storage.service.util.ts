import {ClusterLookUpData} from "../data-source/cluster-data-source.service.util";
import {JobStorageObject} from "../../../shared/job/job";
import {FsrParameters} from "../FSR/fsr.util";


export interface ClusterStorageObject {
    step: number;
    name: string;
    dataSource: DataSourceStorageObject;
    fsrValues: fsrUserValues;
}

export interface DataSourceStorageObject {
    recentSearches: ClusterLookUpData[];
    dataJob: JobStorageObject | null;
    cluster: ClusterMWSC | null;
    starCounts: StarCounts | null;
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

export interface ClusterMWSC {
    id: number;
    galactic_longitude: number;
    galactic_latitude: number;
    radius: number;
    num_clusters_stars: number;
    num_total_stars: number;
    num_APASS_stars: number;
    num_TWO_MASS_stars: number;
    num_WISE_stars: number;
    pm_ra: number;
    pm_dec: number;
    ra: number;
    dec: number;
    type: string;
}

export interface StarCounts {
    "user": StarCount;
    "GAIA": StarCount;
    "APASS": StarCount;
    "TWO_MASS": StarCount;
    "WISE": StarCount;

}

export interface StarCount {
    cluster_stars: number;
    field_stars: number;
    unused_stars: number;
}
