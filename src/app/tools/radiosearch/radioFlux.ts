import { FittingResult, RadioSearchDataDict, SourceFluxes } from './radiosearch.service.util';

/**
 * Catalogue flux handling: pulling the eight survey fluxes off a source,
 * fitting a spectral index, and building the chart series.
 *
 * The flux-extraction block used to be duplicated verbatim between
 * performFitting and getScatterData, with the frequency table written out
 * twice alongside it.
 */

/** Survey frequencies in MHz, index-aligned with {@link extractFluxes}. */
export const FREQUENCIES: readonly number[] = [38, 159, 178, 750, 1400, 2695, 5000, 8400];

/**
 * The eight survey fluxes in {@link FREQUENCIES} order, with the backend's
 * `'Unknown'` sentinel mapped to null.
 *
 * The single-letter response keys L/S/C/X are the 1400/2695/5000/8400 MHz
 * bands - part of the backend contract, do not rename.
 */
export function extractFluxes(source: SourceFluxes): (number | null)[] {
  const cells = [
    source.MHz38,
    source.MHz159,
    source.MHz178,
    source.MHz750,
    source.L1400,
    source.S2695,
    source.C5000,
    source.X8400,
  ];

  return cells.map((flux) => (flux !== 'Unknown' && flux !== undefined ? (flux as number) : null));
}

/**
 * Ordinary least squares in log10(frequency) vs log10(flux) - i.e. the radio
 * spectral index. Returns null when fewer than two bands have measurements.
 */
export function fitSpectralIndex(fluxes: (number | null)[]): FittingResult | null {
  const logFrequencies: number[] = [];
  const logFluxes: number[] = [];

  fluxes.forEach((flux, index) => {
    if (flux !== null) {
      logFrequencies.push(Math.log10(FREQUENCIES[index]));
      logFluxes.push(Math.log10(flux));
    }
  });

  if (logFrequencies.length <= 1) {
    return null;
  }

  const n = logFrequencies.length;
  const sumX = logFrequencies.reduce((a, b) => a + b, 0);
  const sumY = logFluxes.reduce((a, b) => a + b, 0);
  const sumXY = logFrequencies.reduce((sum, x, i) => sum + x * logFluxes[i], 0);
  const sumX2 = logFrequencies.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

export interface ScatterSeries {
  points: RadioSearchDataDict[];
  /** Flux interpolated to the target frequency, or null when it can't be bracketed. */
  averageFlux: number | null;
}

/**
 * Build the frequency/flux series for one source, plus the linearly
 * interpolated flux at `targetFreq` (added as the highlighted point).
 *
 * Interpolation is linear in frequency and flux - not in log space - matching
 * the original behaviour.
 */
export function buildScatterSeries(fluxes: (number | null)[], targetFreq: number): ScatterSeries {
  const points: RadioSearchDataDict[] = [];

  fluxes.forEach((flux, index) => {
    if (flux !== null) {
      points.push({
        frequency: Number(FREQUENCIES[index].toFixed(3)),
        flux: Number(flux.toFixed(3)),
        flux_fit: Number(flux.toFixed(3)),
      });
    }
  });

  // Bracket targetFreq with the nearest measured bands either side.
  let lowerIndex = -1;
  let upperIndex = -1;

  for (let i = 0; i < FREQUENCIES.length; i++) {
    if (fluxes[i] !== null) {
      if (FREQUENCIES[i] < targetFreq) {
        lowerIndex = i;
      } else {
        upperIndex = i;
        break;
      }
    }
  }

  if (lowerIndex === -1 || upperIndex === -1) {
    return { points, averageFlux: null };
  }

  const fluxLower = fluxes[lowerIndex]!;
  const fluxUpper = fluxes[upperIndex]!;
  const freqLower = FREQUENCIES[lowerIndex];
  const freqUpper = FREQUENCIES[upperIndex];

  const weightUpper = (targetFreq - freqLower) / (freqUpper - freqLower);
  const averageFlux = fluxLower * (1 - weightUpper) + fluxUpper * weightUpper;

  points.push({
    frequency: Number(targetFreq.toFixed(3)),
    flux: Number(averageFlux.toFixed(3)),
    flux_fit: Number(averageFlux.toFixed(3)),
    highlight: true,
  });

  return { points, averageFlux };
}

/**
 * Overwrite each point's `flux_fit` with the value predicted by the log-log
 * fit, leaving `flux` as measured.
 */
export function applyFitToSeries(points: RadioSearchDataDict[], fit: FittingResult | null): void {
  if (!fit) {
    return;
  }

  points.forEach((point) => {
    if (point.frequency !== null) {
      point.flux_fit = Math.pow(10, fit.slope * Math.log10(point.frequency) + fit.intercept);
    }
  });
}
