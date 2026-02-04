export interface HistogramRange {
  min: number;
  max: number;
}

export interface HistogramResult {
  bins: [number, number][];
  binWidth: number;
}

export function computeHistogram(data: number[], binCount?: number, range?: HistogramRange): HistogramResult {
  if (!data || data.length === 0) {
    return {bins: [], binWidth: 0};
  }
  const min = range?.min ?? Math.min(...data);
  const max = range?.max ?? Math.max(...data);
  const filtered = data.filter((value) => value >= min && value <= max);
  if (filtered.length === 0) {
    return {bins: [], binWidth: 0};
  }
  const bins = binCount && binCount > 0 ? binCount : Math.ceil(Math.sqrt(filtered.length));
  const binWidth = (max - min) / bins || 1;
  const counts = new Array(bins).fill(0);
  for (const value of filtered) {
    const index = Math.min(bins - 1, Math.floor((value - min) / binWidth));
    counts[index] += 1;
  }
  const binData: [number, number][] = counts.map((count, index) => {
    const center = min + binWidth * (index + 0.5);
    return [center, count];
  });
  return {bins: binData, binWidth};
}
