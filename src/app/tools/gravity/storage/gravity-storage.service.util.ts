import {JobStorageObject} from "../../../shared/job/job";


export interface GravityStorageObject {
    name: string;
    dataJob: JobStorageObject | null;
    paramValues: GravityInterfaceStorageObject;
}

export interface GravityInterfaceStorageObject {
    merger_time: number;
    total_mass: number;
    mass_ratio: number;
    phase: number;
    distance: number;
    inclination: number;
}
