import {DataKey} from "../../shared/data/FileParser/FileParser.util";
import {FILTER, Source} from "../cluster.util";

/**
 * Columns of an uploaded photometry CSV. Each alias pair lists the Afterglow 2 column first,
 * then the legacy Afterglow column (id, filter, calibrated_mag, mag_error, ra_hours, dec_degs).
 */
export const CLUSTER_CSV_DATA_KEYS: DataKey[] = [
  ['source_id', 'id'],
  'filter',
  'calibrated_mag',
  ['calibrated_mag_error', 'mag_error'],
  ['sky_ra', 'ra_hours'],
  ['sky_dec', 'dec_degs'],
];
export const CLUSTER_CSV_OPTIONAL_DATA_KEYS: DataKey[] = ['excluded'];

/**
 * A single photometry measurement, independent of the uploaded CSV format
 */
export interface ClusterRawData {
  id: string;
  filter: string;
  mag: number;
  mag_error: number;
  ra: number; // degrees
  dec: number; // degrees
}

/**
 * Convert a parsed CSV row of either Afterglow format
 * @param row the row keyed by column name
 * @return the measurement, or null if the row is excluded or incomplete
 */
export function toClusterRawData(row: { [key: string]: string | undefined }): ClusterRawData | null {
  if (['true', '1', 'yes'].includes((row['excluded'] ?? '').toLowerCase())) {
    return null;
  }
  const entry: ClusterRawData = {
    id: row['source_id'] ?? row['id'] ?? '',
    filter: row['filter'] ?? '',
    mag: parseFloat(row['calibrated_mag'] ?? ''),
    mag_error: parseFloat(row['calibrated_mag_error'] ?? row['mag_error'] ?? ''),
    ra: row['sky_ra'] !== undefined ? parseFloat(row['sky_ra']) : parseFloat(row['ra_hours'] ?? '') * 15,
    dec: parseFloat(row['sky_dec'] ?? row['dec_degs'] ?? ''),
  };
  if (entry.id === '' || entry.filter === '' || isNaN(entry.ra) || isNaN(entry.dec)) {
    return null;
  }
  return entry;
}

/**
 * Group measurements into sources, averaging the position of each source
 * @param rawData
 * @return the sources with at least one photometry in a supported filter, and the filters found
 */
export function toClusterSources(rawData: ClusterRawData[]): { sources: Source[], filters: FILTER[] } {
  const sources: Source[] = [];
  const filters: FILTER[] = [];
  const sortedData = [...rawData].sort((a, b) => a.id.localeCompare(b.id));
  let i = 0;
  while (i < sortedData.length) {
    const id = sortedData[i].id;
    const entries: ClusterRawData[] = [];
    for (; i < sortedData.length && sortedData[i].id === id; i++) {
      entries.push(sortedData[i]);
    }
    const source: Source = {
      id: id,
      astrometry: {
        ra: entries.reduce((sum, entry) => sum + entry.ra, 0) / entries.length,
        dec: entries.reduce((sum, entry) => sum + entry.dec, 0) / entries.length,
      },
      photometries: [],
      fsr: null,
    };
    entries.forEach((entry) => {
      const filter = entry.filter as any as FILTER;
      if (Object.values(FILTER).includes(filter) && !isNaN(entry.mag) && !isNaN(entry.mag_error)) {
        source.photometries.push({filter: filter, mag: entry.mag, mag_error: entry.mag_error});
        if (!filters.includes(filter)) {
          filters.push(filter);
        }
      }
    });
    if (source.photometries.length > 0) {
      sources.push(source);
    }
  }
  return {sources: sources, filters: filters};
}

export interface ClusterLookUpData {
  name: string;
  ra: number;
  dec: number;
  radius: number;
}

export interface ClusterLookUpStack {
  push(data: ClusterLookUpData): void;

  pop(): ClusterLookUpData;

  list(): ClusterLookUpData[];

  hasData(): boolean;

  load(data: ClusterLookUpData[]): void;

  clear(): void;
}

export class ClusterLookUpStackImpl implements ClusterLookUpStack {
  private data: ClusterLookUpData[] = []
  private maxDataSize: number;

  constructor(maxDataSize: number) {
    this.maxDataSize = maxDataSize;
  }

  list(): ClusterLookUpData[] {
    return this.data;
  }

  push(data: ClusterLookUpData): void {
    if (!this.nameList().includes(data.name)) {
      if (this.data.length >= this.maxDataSize) {
        this.data = this.data.slice(1, this.data.length);
      }
      this.data.push(data);
    } else {
      this.data = this.data.filter(d => d.name !== data.name);
      this.data.push(data);
    }
  }

  load(data: ClusterLookUpData[]): void {
    this.data = data;
  }

  hasData(): boolean {
    return this.data.length > 0;
  }

  pop(): ClusterLookUpData {
    if (this.hasData())
      return this.data.pop()!;
    else
      throw new Error('No data in stack');
  }

  clear(): void {
    this.data = [];
  }

  private nameList(): string[] {
    return this.data.map(data => data.name);
  }
}
