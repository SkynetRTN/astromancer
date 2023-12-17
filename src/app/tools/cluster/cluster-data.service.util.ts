import {FILTER, Photometry, Source} from "./cluster.util";

export function sourceSerialization(sources: any[]): { 'sources': Source[], 'filters': FILTER[] } {
  let sourcesObj: Source[] = [];
  let filters: FILTER[] = [];
  for (let entry of sources) {
    let photometries: Photometry[] = [];
    for (let photometry of entry['photometry']) {
      if (!filters.includes(photometry['filter']))
        filters.push(photometry['filter']);
      let photometryObj: Photometry = {
        filter: photometry['filter'],
        mag: photometry['mag'],
        mag_error: photometry['mag_err'],
      }
      photometries.push(photometryObj);
    }
    let source: Source = {
      id: entry['id'],
      astrometry: {
        ra: entry['astrometry']['ra'],
        dec: entry['astrometry']['dec'],
      },
      fsr: {
        pm_ra: entry['fsr']['pm_ra'],
        pm_dec: entry['fsr']['pm_dec'],
        distance: entry['fsr']['distance'],
      },
      photometries: photometries,
    }
    sourcesObj.push(source);
  }
  return {sources: sourcesObj, filters: filters};
}


export function appendFSRResults(sources: Source[], fsr: any[]) {
  fsr = fsr.sort((a, b) => {
    return a.id - b.id;
  });
  let i = 0, j = 0;
  while (i < sources.length && j < fsr.length) {
    const compare = sources[i].id.localeCompare(fsr[j].id);
    if (compare === 0) {
      sources[i].fsr = {
        pm_ra: fsr[j].pm_ra,
        pm_dec: fsr[j].pm_dec,
        distance: fsr[j].distance,
      }
      i++;
      j++;
    } else if (compare < 0) {
      i++;
    } else {
      j++;
    }
  }
  return sources;
}
