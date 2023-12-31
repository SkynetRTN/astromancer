import {rad} from "../shared/data/utils";

export enum ClusterStep {
    DataSource = 0,
    FSR = 1,
    ArchiveFetching = 2,
    IsochroneFitting = 3,
    Result = 4,
}


export interface Source {
    id: string;
    astrometry: Astrometry;
    photometries: Photometry[];
    fsr: FSR | null;
}

export interface Photometry {
    filter: FILTER;
    mag: number;
    mag_error: number;
}

export interface Astrometry {
    ra: number;
    dec: number;
}

export interface FSR {
    pm_ra: number;
    pm_dec: number;
    distance: number;
}

export enum FILTER {
    U = "U",
    B = "B",
    V = "V",
    R = "R",
    I = "I",
    U_PRRIME = "uprime",
    G_PRIME = "gprime",
    R_PRIME = "rprime",
    I_PRIME = "iprime",
    Z_PRIME = "zprime",
    J = "J",
    H = "H",
    K = "K",
    Ks = "Ks",
    W1 = "W1",
    W2 = "W2",
    W3 = "W3",
    W4 = "W4",
    BP = "BP",
    G = "G",
    RP = "RP",
}

export const APASS_FILTERS: FILTER[] = [FILTER.G_PRIME, FILTER.R_PRIME, FILTER.I_PRIME, FILTER.Z_PRIME];
export const TWO_MASS_FILTERS: FILTER[] = [FILTER.J, FILTER.H, FILTER.K];
export const WISE_FILTERS: FILTER[] = [FILTER.W1, FILTER.W2, FILTER.W3, FILTER.W4];
export const GAIA_FILTERS: FILTER[] = [FILTER.G, FILTER.BP, FILTER.RP];

export const filterWavelength: { [key: string]: number } = {
    "U": 0.364,
    "B": 0.442,
    "V": 0.54,
    "R": 0.647,
    "I": 0.7865,
    "uprime": 0.354,
    "gprime": 0.475,
    "rprime": 0.622,
    "iprime": 0.763,
    "zprime": 0.905,
    "J": 1.25,
    "H": 1.65,
    "K": 2.15,
    "Ks": 2.15,
    "W1": 3.4,
    "W2": 4.6,
    "W3": 12,
    "W4": 22,
    "BP": 0.532,
    "G": 0.673,
    "RP": 0.797,
};

export interface gaiaMatchQueryRange {
    ra: number;
    dec: number;
    r: number;
    wrap: boolean;
}

export interface gaiaMatchQueryDataDict {
    id: string;
    ra: number | undefined;
    dec: number | undefined;
}

export enum Catalogs {
    GAIA = "GAIA",
    APASS = "APASS",
    TWOMASS = "TWO_MASS",
    WISE = "WISE",
}

export function haversine(dec1: number, dec2: number, ra1: number, ra2: number): number {
    let dec1_rad = rad(dec1)
    let dec2_rad = rad(dec2)
    let ra1_rad = rad(ra1)
    let ra2_rad = rad(ra2)
    let theta = 2 * Math.asin((Math.sin((dec1_rad - dec2_rad) / 2) ** 2 + Math.cos(dec1_rad) * Math.cos(dec2_rad) * (Math.sin((ra1_rad - ra2_rad) / 2)) ** 2) ** 0.5)
    return (theta / Math.PI) * 180
}

export interface CMDFilterSet {
    blue: FILTER;
    red: FILTER;
}

export enum ClusterPlotType {
    CM = "CM",
    HR = "HR",
}

export interface PlotConfig {
    filters: {
        blue: FILTER;
        red: FILTER;
        lum: FILTER;
    },
    plotType: ClusterPlotType;
}

export interface PlotParams {
    distance: number;
    reddening: number;
}

export interface IsochroneParams {
    age: number;
    metallicity: number;
}
