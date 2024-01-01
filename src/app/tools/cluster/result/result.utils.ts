import {haversine, Source} from "../cluster.util";
import {rad} from "../../shared/data/utils";

/*
    * Returns the half-light radius of the cluster in degrees
    * 50% median of the angular distance (using haversine) between the cluster center and the sources
 */
export function getHalfLightRadius(sources: Source[], centerRa: number, centerDec: number): number {
    const angularDistance: number[] = [];
    sources.forEach(source => {
        angularDistance.push(haversine(centerDec, source.astrometry.dec, centerRa, source.astrometry.ra));
    });
    angularDistance.sort((a, b) => a - b);
    return angularDistance[Math.floor(angularDistance.length / 2)];
}

// https://en.wikipedia.org/wiki/Galactic_coordinate_system#cite_note-5
export function equatorial2Galactic(ra: number, dec: number): { l: number, b: number } {
    const ra_ngp: number = rad(192.85);
    const dec_ngp: number = rad(27.13);
    const l_ngp: number = rad(122.93314);

    const ra_rad: number = rad(ra);
    const dec_rad: number = rad(dec);
    const b = Math.asin(Math.sin(dec_ngp) * Math.sin(dec_rad)
        + Math.cos(dec_ngp) * Math.cos(dec_rad) * Math.cos(ra_rad - ra_ngp));

    return {l: 0, b: b};
}

export function getPhysicalRadius(distance: number, angularRadius: number): number {
    return 2 * distance * Math.tan(rad(angularRadius) / 2) * 3261.56;
}

export function getPmra(pmras: number[]): number {
    const size: number = pmras.length;
    return pmras[Math.floor(size / 2)];
}

export function getPmdec(pmdecs: number[]): number {
    const size: number = pmdecs.length;
    return pmdecs[Math.floor(size / 2)];
}
