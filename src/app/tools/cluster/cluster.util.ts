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
  // U_PRRIME = "uprime",
  G_PRIME = "gprime",
  R_PRIME = "rprime",
  I_PRIME = "iprime",
  Z_PRIME = "zprime",
  J = "J",
  H = "H",
  K = "K",
  // Ks = "Ks",
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
  // "Ks": 2.15,
  "W1": 3.4,
  "W2": 4.6,
  "W3": 12,
  "W4": 22,
  "BP": 0.532,
  "G": 0.673,
  "RP": 0.797,
};

export const filterFramingValue: {
  [key: string]: {
    blue: number;
    red: number;
    faint: number;
    bright: number;
  }
} = {
  "U": {"red": 11.72, "faint": 11.72, "blue": -4.49, "bright": -10.57},
  "B": {"red": 10.72, "faint": 10.72, "blue": -3.34, "bright": -10.6},
  "V": {"red": 9.38, "faint": 9.38, "blue": -3.04, "bright": -10.67},
  "R": {"red": 8.45, "faint": 8.45, "blue": -2.92, "bright": -10.88},
  "I": {"red": 7.69, "faint": 7.69, "blue": -2.75, "bright": -11.25},
  "uprime": {"red": 12.55, "faint": 12.55, "blue": -3.78, "bright": -9.66},
  "gprime": {"red": 10.13, "faint": 10.13, "blue": -3.36, "bright": -10.74},
  "rprime": {"red": 8.8, "faint": 8.8, "blue": -2.84, "bright": -10.68},
  "iprime": {"red": 8.26, "faint": 8.26, "blue": -2.47, "bright": -10.79},
  "zprime": {"red": 7.93, "faint": 7.93, "blue": -2.13, "bright": -10.87},
  "J": {"red": 6.67, "faint": 6.67, "blue": -2.42, "bright": -11.82},
  "H": {"red": 6.1, "faint": 6.1, "blue": -2.28, "bright": -12.18},
  "K": {"red": 5.92, "faint": 5.92, "blue": -2.19, "bright": -12.24},
  "W1": {"red": 5.7, "faint": 5.7, "blue": -2.11, "bright": -12.3},
  "W2": {"red": 5.58, "faint": 5.58, "blue": -2.07, "bright": -12.33},
  "W3": {"red": 5.52, "faint": 5.52, "blue": -3.31, "bright": -12.31},
  "W4": {"red": 5.19, "faint": 5.19, "blue": -3.13, "bright": -12.62},
  "BP": {"red": 9.57, "faint": 9.57, "blue": -3.3, "bright": -10.67},
  "G": {"red": 8.73, "faint": 8.73, "blue": -3.13, "bright": -10.76},
  "RP": {"red": 7.83, "faint": 7.83, "blue": -2.82, "bright": -11.18},
}

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

export enum StellarClassification {
  O = "O",
  B = "B",
  A = "A",
  F = "F",
  G = "G",
  K = "K",
  M = "M",
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
  plotFraming: PlotFraming;
}

export enum PlotFraming {
  STANDARD = "Standard View",
  DATA = "Frame on Data",
}

export interface PlotParams {
  distance: number;
  reddening: number;
}

export interface IsochroneParams {
  age: number;
  metallicity: number;
}

export function getExtinction(filter: FILTER, reddening: number, rv: number = 3.1): number {
  const waveLength = filterWavelength[filter];
  const x = (waveLength / 1) ** -1;
  const y = x - 1.82;
  let a = 0;
  let b = 0;
  if (x > 0.3 && x < 1.1) {
    a = 0.574 * x ** 1.61;
  } else if (x > 1.1 && x < 3.3) {
    a =
      1 +
      0.17699 * y -
      0.50447 * y ** 2 -
      0.02427 * y ** 3 +
      0.72085 * y ** 4 +
      0.01979 * y ** 5 -
      0.7753 * y ** 6 +
      0.32999 * y ** 7;
  }

  if (x > 0.3 && x < 1.1) {
    b = -0.527 * x ** 1.61;
  } else if (x > 1.1 && x < 3.3) {
    b =
      1.41338 * y +
      2.28305 * y ** 2 +
      1.07233 * y ** 3 -
      5.38434 * y ** 4 -
      0.62251 * y ** 5 +
      5.3026 * y ** 6 -
      2.09002 * y ** 7;
  }

  return 3.1 * reddening * (a + b / rv);
}
