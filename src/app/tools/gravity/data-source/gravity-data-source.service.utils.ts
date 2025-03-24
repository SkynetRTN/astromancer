
export interface GravityEvent {
    Name: string
    Detector: Detector
    Time: Date
}

export enum Detector {
    L = 'L',
    V = 'V',
    H = 'H',
}