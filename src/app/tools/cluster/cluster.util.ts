import {rad} from "../shared/data/utils";

export interface Source {
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
  id: string;
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
  U_PRRIME = "u\'",
  G_PRIME = "g\'",
  R_PRIME = "r\'",
  I_PRIME = "i\'",
  Z_PRIME = "z\'",
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

export const filterWavelength: { [key: string]: number } = {
  "U": 0.364,
  "B": 0.442,
  "V": 0.54,
  "R": 0.647,
  "I": 0.7865,
  "u\'": 0.354,
  "g\'": 0.475,
  "r\'": 0.622,
  "i\'": 0.763,
  "z\'": 0.905,
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

export function haversine(dec1: number, dec2: number, ra1: number, ra2: number): number {
  let dec1_rad = rad(dec1)
  let dec2_rad = rad(dec2)
  let ra1_rad = rad(ra1)
  let ra2_rad = rad(ra2)
  let theta = 2 * Math.asin((Math.sin((dec1_rad - dec2_rad) / 2) ** 2 + Math.cos(dec1_rad) * Math.cos(dec2_rad) * (Math.sin((ra1_rad - ra2_rad) / 2)) ** 2) ** 0.5)
  return (theta / Math.PI) * 180
}
