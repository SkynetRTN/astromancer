export interface ClusterDataDict {
  id: string;
  ra: number | undefined;
  dec: number | undefined;
  photometries: photometry[];
  distance?: number;
  distance_error?: number;
  pmra?: number;
  pmdec?: number;
}

export interface photometry {
  filter: FILTER;
  ra: number;
  dec: number;
  mag: number;
  mag_error: number;
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
