
/**
 * @interface GravityEvent all the important data for a gravity event
 * @property {string} Name event name
 * @property {string[]} Detectors detectors with recorded data of the event
 * @property {Date} Time time of the event
 * @property {string} URL link to the event's documentation page. Currently leads to the event release.
 */
export interface GravityEvent {
    Name: string
    Detectors: string[]
    Time: Date
    URL: string
}

// unused
/**
 * @enum All the current gravity detectors. unused due the posibility of interferometers being established
 */
export enum Detector {
    L = 'L',
    V = 'V',
    H = 'H',
}

export interface Pagination {
    total_items: number
    page_length: number
}

export interface SearchParams {
    min_time?: number
    max_time?: number
}


/**
 * @remarks (Roughly) converts a UST date to a GPS one
 * @param date The date in UST
 * @returns date in GPS time, not accounting for leap seconds 
 */
export function dateToGPS(date: Date) : number
{
    //this doesnt account for leap seconds but... we are dealing with days here. who cares.
    return ((date.valueOf()) - 315964800000)/1000
}

/**
 * @remarks (Roughly) converts a GPS date to a UST one
 * @param date The date in GPS time
 * @returns date in UST, not accounting for leap seconds 
 */
export function GPSToDate(gps_time: number): Date
{
    return new Date(gps_time*1000+315964800000)
}