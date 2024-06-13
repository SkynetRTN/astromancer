// Form Enums
export enum channel {
    xx = "XX",
    yy = "YY",
    sum = "SUM",
}

export enum spectrum {
    high = "High Frequency",
    low = "Low Frequency"
}

export enum gainCalibration {
    pre = "Pre",
    post = "Post",
    interpolated = "Interpolated",
    none = "None"
}

export enum imageCoordinate {
    galactic = "Galactic",
    equatorial = "Equatorial"
}

export enum timeDelayOption {
    auto = "Auto",
    off = "Off",
    custom = "Custom"
}

export enum frequencyRangePreset {
    na = "N/A",
    luminosity = "Luminosity",
    red = "Red",
    green = "Green",
    blue = "Blue",
    mw_hi = "MW HI",
}

export enum rfiSubPreset {
    faint_target = "Faint Target",
    bright_target = "Bright Target with Airy Rings",
    na = "N/A"
}

export enum surfaceModel {
    third_order = "3rd-Order 2D Polynomial",
    third_order_noise = "3rd-Order 2D Polynomial with Noise Prior"
}

export enum surfaceModelScale {
    one_third = "1/3 (measurement-quality image)",
    one_half = "1/2",
    two_thirds = "2/3 (display-quality image)"
}

export class RcInterfaceInfo {
    private name: string;

    private channel: channel;
    private spectrum: spectrum;
    private gainCalibration: gainCalibration;
    private imageCoordinate: imageCoordinate;
    private timeDelayOption: timeDelayOption;
    private includeRawImage: boolean;
    
    private frequencyRangePreset: frequencyRangePreset;
    private minFrequency: number;
    private maxFrequency: number;
    private skipFrequency: boolean;
    private minFrequencySkip: Array<number>;
    private maxFrequencySkip: Array<number>;

    private oneDBkgSub: number;
    private rfiSubPreset: rfiSubPreset;
    private rfiSubScale: number;
    private surfaceModel: surfaceModel;
    private surfaceModelScale: surfaceModelScale;

    constructor() {
        this.name = "RC Job";

        this.channel = channel.sum;
        this.spectrum = spectrum.high;
        this.gainCalibration = gainCalibration.interpolated;
        this.imageCoordinate = imageCoordinate.equatorial;
        this.timeDelayOption = timeDelayOption.auto;
        this.includeRawImage = true;

        this.frequencyRangePreset = frequencyRangePreset.na;
        this.minFrequency = 1355.0;
        this.maxFrequency = 1435.0;
        this.skipFrequency = false;
        this.minFrequencySkip = [];
        this.maxFrequencySkip = [];

        this.oneDBkgSub = 6;
        this.rfiSubPreset = rfiSubPreset.bright_target;
        this.rfiSubScale = 0.35;
        this.surfaceModel = surfaceModel.third_order_noise;
        this.surfaceModelScale = surfaceModelScale.one_third;
    }

    // Getters

    getName(): string {
        return this.name;
    }

    getChannel(): channel {
        return this.channel;
    }

    getSpectrum(): spectrum {
        return this.spectrum;
    }

    getGainCalibration(): gainCalibration {
        return this.gainCalibration;
    }

    getImageCoordinate(): imageCoordinate {
        return this.imageCoordinate;
    }

    getTimeDelayOption(): timeDelayOption {
        return this.timeDelayOption;
    }

    getIncludeRawImage(): boolean {
        return this.includeRawImage;
    }

    getFrequencyRangePreset(): frequencyRangePreset {
        return this.frequencyRangePreset;
    }

    getMinFrequency(): number {
        return this.minFrequency;
    }

    getMaxFrequency(): number {
        return this.maxFrequency;
    }

    getSkipFrequency(): boolean {
        return this.skipFrequency;
    }

    getMinFrequencySkip(): Array<number> {
        return this.minFrequencySkip;
    }

    getMaxFrequencySkip(): Array<number> {
        return this.maxFrequencySkip;
    }

    getOneDBkgSub(): number {
        return this.oneDBkgSub;
    }

    getRfiSubPreset(): rfiSubPreset {
        return this.rfiSubPreset;
    }

    getRfiSubScale(): number {
        return this.rfiSubScale;
    }

    getSurfaceModel(): surfaceModel {
        return this.surfaceModel;
    }

    getSurfaceModelScale(): surfaceModelScale {
        return this.surfaceModelScale;
    }

    // Setters

    setName(name: string) {
        this.name = name;
    }

    setChannel(channel: channel) {
        this.channel = channel;
    }

    setSpectrum(spectrum: spectrum) {
        this.spectrum = spectrum;
    }

    setGainCalibration(gainCalibration: gainCalibration) {
        this.gainCalibration = gainCalibration;
    }

    setImageCoordinate(imageCoordinate: imageCoordinate) {
        this.imageCoordinate = imageCoordinate;
    }

    setTimeDelayOption(timeDelayOption: timeDelayOption) {
        this.timeDelayOption = timeDelayOption;
    }

    setIncludeRawImage(includeRawImage: boolean) {
        this.includeRawImage = includeRawImage;
    }

    setFrequencyRangePreset(frequencyRangePreset: frequencyRangePreset) {
        this.frequencyRangePreset = frequencyRangePreset;
    }

    setMinFrequency(minFrequency: number) {
        this.minFrequency = minFrequency;
    }

    setMaxFrequency(maxFrequency: number) {
        this.maxFrequency = maxFrequency;
    }

    setSkipFrequency(skipFrequency: boolean) {
        this.skipFrequency = skipFrequency;
    }

    setMinFrequencySkip(minFrequencySkip: Array<number>) {
        this.minFrequencySkip = minFrequencySkip;
    }

    setMaxFrequencySkip(maxFrequencySkip: Array<number>) {
        this.maxFrequencySkip = maxFrequencySkip;
    }

    setOneDBkgSub(oneDBkgSub: number) {
        this.oneDBkgSub = oneDBkgSub;
    }

    setRfiSubPreset(rfiSubPreset: rfiSubPreset) {
        this.rfiSubPreset = rfiSubPreset;
    }

    setRfiSubScale(rfiSubScale: number) {
        this.rfiSubScale = rfiSubScale;
    }

    setSurfaceModel(surfaceModel: surfaceModel) {
        this.surfaceModel = surfaceModel;
    }

    setSurfaceModelScale(surfaceModelScale: surfaceModelScale) {
        this.surfaceModelScale = surfaceModelScale;
    } 

}
