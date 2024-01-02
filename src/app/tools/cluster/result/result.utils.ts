import {haversine, Source} from "../cluster.util";
import {deg, rad} from "../../shared/data/utils";

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
    const ra_ngp: number = rad(192.8595);
    const dec_ngp: number = rad(27.1284);
    const l_ngp: number = rad(122.93314);

    const ra_rad: number = rad(ra);
    const dec_rad: number = rad(dec);
    const b = Math.asin(Math.sin(dec_ngp) * Math.sin(dec_rad)
        + Math.cos(dec_ngp) * Math.cos(dec_rad) * Math.cos(ra_rad - ra_ngp));
    let temp = Math.cos(dec_rad) * Math.sin(ra_rad - ra_ngp) /
        (Math.sin(dec_rad) * Math.cos(dec_ngp) - Math.cos(dec_rad) * Math.sin(dec_ngp) * Math.cos(ra_rad - ra_ngp));
    temp = Math.atan(temp)
    temp = temp < 0 ? temp + Math.PI : temp; //shift arctan to [0, 2pi]
    let l = l_ngp - temp;
    l = l < 0 ? l + 2 * Math.PI : l; //shift to [0, 2pi]
    return {l: deg(l), b: deg(b)};
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

export function drawStar(ctx: any, stroke: string, fill: string,
                         cx: number, cy: number, spikes: number,
                         outerRadius: number, innerRadius: number) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius)
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y)
        rot += step
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = stroke;
    ctx.stroke();
    ctx.fillStyle = fill;
    ctx.fill();
}
