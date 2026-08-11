/**
 * Colour mapping for the FITS raster.
 *
 * These were previously declared *inside* displayFitsImage, so all seven
 * closures were rebuilt on every repaint - which happens on every slider tick,
 * every colormap change, every click and every window resize. They are pure,
 * so they live here instead. Numerics are unchanged.
 */

export type Rgb = [number, number, number];

export type ColorMapName = 'turbo' | 'sls' | 'rainbow';

export type StretchName = 'asinh' | 'linear' | 'log';

export interface StretchOption {
  value: StretchName;
  label: string;
}

export const STRETCH_OPTIONS: readonly StretchOption[] = [
  { value: 'asinh', label: 'ASinh' },
  { value: 'linear', label: 'Linear' },
  { value: 'log', label: 'Log' },
];

export interface ColorMapOption {
  value: ColorMapName;
  label: string;
}

export const COLOR_MAP_OPTIONS: readonly ColorMapOption[] = [
  { value: 'turbo', label: 'Turbo' },
  { value: 'sls', label: 'SLS' },
  { value: 'rainbow', label: 'Rainbow' },
];

/** Linear interpolation between the sorted samples at fractional rank `p`. */
export function percentile(sorted: ArrayLike<number>, p: number): number {
  if (sorted.length === 0) {
    return 0;
  }

  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) {
    return sorted[lower];
  }

  const fraction = index - lower;
  return sorted[lower] * (1 - fraction) + sorted[upper] * fraction;
}

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function turboColormap(value: number): Rgb {
  value = clamp01(value);

  const r = Math.max(0, Math.min(1, 1.0 - 4.0 * Math.pow(value - 0.75, 2))) * 255;
  const g = Math.exp(-Math.pow(value - 0.5, 2) / 0.1) * 255;
  const b = Math.max(0, Math.min(1, 1.0 - 4.0 * Math.pow(value - 0.25, 2))) * 255;

  return [Math.round(r), Math.round(g), Math.round(b)];
}

const SLS_STOPS: Rgb[] = [
  [0, 0, 0],
  [75, 0, 130],
  [0, 0, 255],
  [0, 255, 255],
  [0, 255, 0],
  [255, 255, 0],
  [255, 128, 0],
  [255, 0, 0],
  [255, 255, 255],
];

function slsColormap(value: number): Rgb {
  value = clamp01(value);

  const n = SLS_STOPS.length - 1;
  const scaledValue = value * n;
  const i = Math.floor(scaledValue);
  const t = scaledValue - i;

  const [r1, g1, b1] = SLS_STOPS[i];
  const [r2, g2, b2] = SLS_STOPS[Math.min(i + 1, n)];

  return [
    Math.round(r1 + t * (r2 - r1)),
    Math.round(g1 + t * (g2 - g1)),
    Math.round(b1 + t * (b2 - b1)),
  ];
}

function hsvToRgb(h: number, s: number, v: number): Rgb {
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;

  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function rainbowColormap(intensity: number): Rgb {
  intensity = clamp01(intensity - 0.03);
  const hue = 300 - 300 * intensity;
  return hsvToRgb(hue, 1, 1);
}

/**
 * Transfer functions mapping a percentile-normalized pixel value to display
 * intensity.
 *
 * `value` is the pixel normalized to [0, 1] between the low and high percentile
 * cuts. `brightness` is the Scale slider, 0..1 with 0.5 as the default; each
 * curve is arranged so that 0.5 spans the full output range, which is why the
 * default view is unchanged from when only asinh existed.
 */
const ASINH_MAX = Math.asinh(255);
const LOG_RANGE = 999;
const LOG_MAX = Math.log10(1 + LOG_RANGE);

export type StretchFn = (value: number, brightness: number) => number;

const STRETCHES: Record<StretchName, StretchFn> = {
  // Original behaviour: brightness 0.5 reproduces the pre-dropdown rendering.
  asinh: (value, brightness) => clamp01(Math.asinh(value * brightness * 255) / ASINH_MAX),
  // brightness 0.5 is the identity.
  linear: (value, brightness) => clamp01(value * brightness * 2),
  // brightness 0.5 gives log10(1 + 999*value) / 3.
  log: (value, brightness) => clamp01(Math.log10(1 + value * brightness * 2 * LOG_RANGE) / LOG_MAX),
};

/** Look up a stretch by name. Unknown names fall back to asinh. */
export function getStretch(name: string): StretchFn {
  return STRETCHES[name as StretchName] ?? STRETCHES.asinh;
}

/** Map a normalized intensity in [0, 1] to RGB. Unknown names fall back to turbo. */
export function getColorFromMap(intensity: number, colorMap: string): Rgb {
  switch (colorMap) {
    case 'sls':
      return slsColormap(intensity);
    case 'rainbow':
      return rainbowColormap(intensity);
    case 'turbo':
    default:
      return turboColormap(intensity);
  }
}
