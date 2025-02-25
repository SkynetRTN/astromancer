import {Component, ElementRef, ViewChild} from '@angular/core';
// import { FITSHeaderParser } from '../shared/data/FitsParser/FitsParser';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MyFileParser} from "../shared/data/FileParser/FileParser";
import {FileType} from "../shared/data/FileParser/FileParser.util";
import {
    RadioCalibrateData,
    RadioCalibrateInput,
    RadioCalibrateSources,
    RadioCalibrateStorage
} from "./radioCalibrate.util";
import {Subject} from "rxjs";


@Component({
    selector: 'app-radioCalibrate',
    templateUrl: './radioCalibrate.component.html',
    styleUrls: ['./radioCalibrate.component.scss', '../shared/interface/tools.scss'],
})

export class RadioCalibrateComponent {
    // init file parser
    private fileParser: MyFileParser = new MyFileParser(FileType.FITS, [], []);
    // data object
    private data: RadioCalibrateData = new RadioCalibrateData();
    // storage object
    private storage: RadioCalibrateStorage = new RadioCalibrateStorage(RadioCalibrateData.getDefaultStorageObject());

    private computeSubject: Subject<void> = new Subject();
    public compute$ = this.computeSubject.asObservable();

    public formGroup: FormGroup;

    sources = Object.values(RadioCalibrateSources);

    constructor() {
        // init data
        this.data.setStorageObject(this.storage.getInterface());
        // create form group
        const input: RadioCalibrateInput = this.data.getInput();
        this.formGroup = new FormGroup({
            source: new FormControl(input.source, [Validators.required]),
            startFreq: new FormControl(input.startFreq, [Validators.required, Validators.min(0)]),
            endFreq: new FormControl(input.endFreq, [Validators.required, Validators.min(0)]),
            date: new FormControl(input.date, [Validators.required, Validators.min(2000)]),
        });
        // subscribe to data changes
        this.formGroup.valueChanges.subscribe(() => {
            if (this.formGroup.valid) {
                this.data.setInput({
                    source: this.formGroup.value.source as RadioCalibrateSources,
                    startFreq: this.formGroup.value.startFreq as number,
                    endFreq: this.formGroup.value.endFreq as number,
                    date: this.formGroup.value.date as Date,
                });
                console.log(this.data.getInput());
                console.log(this.data.getOutput());
                this.storage.saveInterface(this.data.getStorageObject());
                this.computeSubject.next();
            }
        });
        this.compute$.subscribe(() => {
            const output = this.data.getOutput();
            if (output.flux !== null && output.fluxError !== null) {
                this.fluxDensity = `${output.flux.toFixed(1)} ± ${output.fluxError.toFixed(1)}`;
            } else {
                this.fluxDensity = undefined;
            }
            if (output.effectiveFrequency !== null) {
                this.effectiveFrequency = output.effectiveFrequency.toFixed(1);
            } else {
                this.effectiveFrequency = undefined;
            }
        });
        // notify view
        this.computeSubject.next();
    }


    fluxDensity: string | undefined;
    effectiveFrequency: string | undefined;


    @ViewChild('fileInput', {static: false}) fileInput!: ElementRef<HTMLInputElement>;

    // When the user clicks the "Upload" button, trigger the file upload process 
    fitsUpload(): void {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
            console.log("No file selected");
            return;
        }

        const file = input.files[0];
        // validate format
        if (!this.fileParser.validateFormat(file)) {
            console.log("Invalid file format");
            return;
        }

        this.fileParser.getHeaders(file, false, (headers, errorSubject) => {
            if (headers) {
                const startFQ = parseFloat(headers["RCMINFQ"]);
                const stopFQ = parseFloat(headers["RCMAXFQ"]);
                const dateUTC = this.stringToUTC(headers["OBSTIME"]);

                this.formGroup.patchValue({
                    startFreq: startFQ,
                    endFreq: stopFQ,
                    date: dateUTC
                });
            }
        });
    }

    reset() {
        const input = RadioCalibrateData.getDefaultStorageObject().input;
        this.formGroup.patchValue({
            source: input.source,
            startFreq: input.startFreq,
            endFreq: input.endFreq,
            date: input.date
        });
    }


    // OBSTIME = '2023-01-12 21:44:34'
    stringToUTC(input: string): Date {
        // remove any single quotes maybe a bug from the fits parser strategy?
        input = input.replace("'", "");
        const [date, time] = input.split(" ");
        const [year, month, day] = date.split("-");
        const [hour, min, sec] = time.split(":");
        return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(min), parseInt(sec)));
    }

    protected readonly RadioCalibrateSources = RadioCalibrateSources;
}
