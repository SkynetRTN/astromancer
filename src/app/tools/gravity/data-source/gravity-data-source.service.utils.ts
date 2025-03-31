import { generate, interval, Observable } from "rxjs"

export interface GravityEvent {
    Name: string
    Detectors: string[]
    Time: Date
    URL: string
}

export interface GravityEventFile {
    Detector: Detector
    URL: string
}

// unused
export enum Detector {
    L = 'L',
    V = 'V',
    H = 'H',
}

export interface Pagination {
    curent_page: number
    total_pages: number
    page_length: number
}

export interface SearchParams {
    min_time?: number
    max_time?: number
}

export function dateToGPS(date: Date) : number
{
    //this doesnt account for leap seconds but... we are dealing with days here. who cares.
    return ((date.valueOf()) - 315964800000)/1000
}

export function GPSToDate(gps_time: number): Date
{
    return new Date(gps_time*1000+315964800000)
}

// export function BufferTester(): Observable<number>{
//     return generate(1, x => x>100, x => x+1, interval(10))
// }