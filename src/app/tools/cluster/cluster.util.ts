export interface ClusterDataDict {
  id: string;
  ra: number|undefined;
  dec: number|undefined;
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
