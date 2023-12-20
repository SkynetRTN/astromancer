import {range} from "./histogram-slider-input/histogram-slider-input.component";

export interface FsrParameters {
  distance: range | null,
  pmra: range | null,
  pmdec: range | null,
}

export interface FsrComponents {
  bin: number,
  range: range,
  histogramRange: range
}
