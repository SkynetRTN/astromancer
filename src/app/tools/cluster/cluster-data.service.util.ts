import {FILTER, Photometry, Source} from "./cluster.util";
import {FsrParameters} from "./FSR/fsr.util";
import {StarCount} from "./storage/cluster-storage.service.util";

export function sourceSerialization(sources: any[]): { 'sources': Source[], 'filters': FILTER[] } {
    let sourcesObj: Source[] = [];
    let filters: FILTER[] = [];
    for (let entry of sources) {
        let photometries: Photometry[] = [];
        for (let photometry of entry['photometries']) {
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

export function updateClusterFieldSources(sources: Source[] | null, fsr: FsrParameters): { fsr: Source[], not_fsr: Source[] } {
    if (sources == null) {
        return {fsr: [], not_fsr: []};
    }
    const sources_fsr = [];
    const sources_not_fsr = [];
    const pmBoolGlobal = fsr.pm_ra === null || fsr.pm_dec === null;
    let a: number
    let b: number;
    let center_ra: number;
    let center_dec: number;
    if (!pmBoolGlobal) {
        a = (fsr.pm_ra!.max - fsr.pm_ra!.min) / 2;
        b = (fsr.pm_dec!.max - fsr.pm_dec!.min) / 2;
        center_ra = (fsr.pm_ra!.max + fsr.pm_ra!.min) / 2
        center_dec = (fsr.pm_dec!.max + fsr.pm_dec!.min) / 2
    }
    for (const data of sources) {
        const distanceBool
            = fsr.distance === null ||
            (data.fsr && data.fsr.distance && data.fsr.distance >= fsr.distance.min * 1000 && data.fsr.distance <= fsr.distance.max * 1000);
        let pmBool: boolean = pmBoolGlobal;
        if (!pmBool && data.fsr && data.fsr.pm_ra && data.fsr.pm_dec) {
            const decDiff = b! * Math.sqrt(
                1 - Math.pow((data.fsr.pm_ra - center_ra!) / a!, 2));
            pmBool = data.fsr.pm_dec >= center_dec! - decDiff
                && data.fsr.pm_dec <= center_dec! + decDiff;
        } else if (pmBoolGlobal &&
            (data.fsr == null || data.fsr.pm_ra == null || data.fsr.pm_dec == null)) {
            pmBool = false;
        }
        if (distanceBool && pmBool) {
            sources_fsr.push(data);
        } else {
            sources_not_fsr.push(data);
        }
    }
    return {fsr: sources_fsr, not_fsr: sources_not_fsr};
}

export function getStarCountsByFilter(clusterSources: Source[], fieldSources: Source[],
                                      filters: FILTER[], fsr: FsrParameters, starCount: StarCount, totalStarsCount: number): StarCount {
    let cluster_stars = 0;
    let field_stars = 0;
    cluster_stars = sourceByCatalog(clusterSources, filters).length;
    field_stars = sourceByCatalog(fieldSources, filters).length;
    if (cluster_stars === 0 && field_stars === 0) {
        return {cluster_stars: 0, field_stars: 0, unused_stars: totalStarsCount};
    } else {
        field_stars += starCount.field_stars;
        let unused_stars = totalStarsCount - cluster_stars - field_stars;
        unused_stars = unused_stars < 0 ? 0 : unused_stars;
        return {cluster_stars: cluster_stars, field_stars: field_stars, unused_stars: unused_stars};
    }
}

function sourceByCatalog(sources: Source[], filters: FILTER[]): Source[] {
    return sources.filter(source => {
        return source.photometries.some(photometry => {
            return filters.includes(photometry.filter);
        });
        // return filters.every(filter => {
        //     return source.photometries.some(photometry => {
        //         return filter === photometry.filter;
        //     });
        // });
    });
}
