/*
import { AfterViewInit, Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { HonorCodePopupService } from '../../shared/honor-code-popup/honor-code-popup.service';
import { HonorCodeChartService } from '../../shared/honor-code-popup/honor-code-chart.service';
import { FormControl } from '@angular/forms';
import {Subject, takeUntil} from "rxjs";
import {HotTableRegisterer} from "@handsontable/angular";
import Handsontable from "handsontable";
import {ChartConfiguration, ScatterDataPoint, Chart} from "chart.js";
import { MatPaginator } from '@angular/material/paginator';
import { get } from 'http';
import { getTranslatedPhrase } from 'handsontable/i18n';


console.log('PulsarLightCurveComponent');

@Component({
  selector: 'app-pulsar-light-curve',
  templateUrl: './pulsar-light-curve.component.html',
  styleUrls: ['./pulsar-light-curve.component.scss', '../../shared/interface/tools.scss'],
})
export class PulsarLightCurveyComponent implements AfterViewInit, OnDestroy {
    dt= 3;
    
    fileName: string | undefined;
    fileLoaded: boolean = false;
    

  displayedColumns: string[] = ['time', 'channel 1', 'channel 2'];
  dataSource: MatTableDataSource<{time: number; chan1: number; chan2: number}> = new MatTableDataSource();
  private destroy$: Subject<void> = new Subject<void>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fileInput', { static: false }) fileInput! : ElementRef<HTMLInputElement>;

  constructor() {
    // Define the data directly in the component
    const initialData = this.getRandTableData();
    this.dataSource.data = this.limitPrecision(initialData);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  limitPrecision(data: { time: number; chan1: number; chan2: number }[]): { time: number; chan1: number; chan2: number }[] {
    return data.map(item => ({
      ...item,
      time: parseFloat(item.time.toFixed(3)),
      chan1: parseFloat(item.chan1.toFixed(3)),
      chan2: parseFloat(item.chan2.toFixed(3)),
    }));
  }
  getRandTableData() {
    const tableData = [];
    for (let i = 0; i < 1000; i++) {
        tableData[i] = {
            'time': (i * 0.2) + 3560,
            'chan1': (Math.random() / 20) + 20.63,
            'chan2': (Math.random() / 20) + 28.98,
        };
    }
    return tableData;   
}

onBackgroundScaleChange(event: Event): void {
    const time = this.dataSource.data.map(item => item.time);
    const chan1 = this.dataSource.data.map(item => item.chan1);
    const chan2 = this.dataSource.data.map(item => item.chan2);
    const subtractedChan1 = this.backgroundSubtraction(time, chan1, this.dt);
    const subtractedChan2 = this.backgroundSubtraction(time, chan2, this.dt);
    this.dataSource.data = this.dataSource.data.map((item, index) => ({
        ...item,
        chan1: subtractedChan1[index],
        chan2: subtractedChan2[index],
      }));     
      }

      median(arr: number[]) {
        arr = arr.filter(num => !isNaN(num));
        const mid = Math.floor(arr.length / 2);
        const nums = arr.sort((a, b) => a - b);
        return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}


    backgroundSubtraction(time: number[], flux: number[], dt: number): number[] {
    let n = Math.min(time.length, flux.length);
    const subtracted = [];

    let jmin = 0;
    let jmax = 0;
    for (let i = 0; i < n; i++) {
        while (jmin < n && time[jmin] < time[i] - (dt / 2)) {
            jmin++;
        }
        while (jmax < n && time[jmax] <= time[i] + (dt / 2)) {
            jmax++;
        }
        let fluxmed = this.median(flux.slice(jmin, jmax));
        subtracted.push(flux[i] - fluxmed);
    }
    return subtracted;
}
 
    uploadDataFile(): void {
    this.fileInput.nativeElement.click();
  }
  type: string | undefined;
  onFileSelected(event: Event): void {
    console.log("File selected");
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log("File read");
      const file = input.files[0];
      
      // Check if the uploaded file is a FITS file
      if (!file.type.match("(txt)") || !file.type.match(".*\.txt") || !file.type.match("bestprof") || !file.name.match(".*\.bestprof")) {
      console.log("Uploaded file type is: ", file.type);
      console.log("Uploaded file name is: ", file.name);
      alert("Please upload a txt or bestprof file.");
      return;
     }
      
      this.fileName = file.name;
      this.fileLoaded = true;
      console.log("Fits file loaded: ", this.fileName);
      let reader = new FileReader();
      reader.onload = () => {
        var data: string[] = (reader.result as string).split("\n");

        if (!this.type) {
            if (data[0].slice(0, 7) == "# Input")
                this.type = "pressto";

            else
                this.type = "standard";
        }

        //Standard files
        if (this.type === "standard") {

            data = data.filter(str => (str !== null && str !== undefined && str !== ""));
            data = data.filter(str => (str[0] !== '#'));

            //turn each string into an array of numbers
            let rows: number[][] | string[][] = data.map(val => val.trim().split(/\ +/));

            rows = rows.map(row => row.map(str => parseFloat(str)));
            const validIndex = rows[0].length - 1;
            rows = rows.filter(row => (row[validIndex] !== 0));
            rows = rows.map(row => [row[0], row[5], row[6]]) as number[][];
            if (rows.length === 0) {
                alert("All Observation Sweeps Are Invalid!\nFile Upload Failed.");
                return;
            }

            const tableData = [];
            for (let row of rows) {
                if (isNaN(row[0])) {
                    continue;
                }
                tableData.push({
                    'time': row[0],
                    'chan1': row[1],
                    'chan2': row[2]
                });
            }
            tableData.sort((a, b) => a.time - b.time);
            this.dataSource.data = tableData;
/*
            let ts = rows.map(row => row[0]).filter(num => !isNaN(num));
            let nyquist = 1.0 / (2.0 * (ArrMath.max(ts) - ArrMath.min(ts)) / ts.length);

            const fourierForm = document.getElementById('fourier-form') as FourierForm;

            fourierForm.pstart.value = Number((1 / nyquist).toPrecision(4));
            fourierForm.fstop.value = Number(nyquist.toPrecision(4));
            myChart.data.nyquist = nyquist;

            switchMode(myChart, 'lc', true, false);
            
        }

        //PRESSTO files
        
        if (this.type === "pressto") {
            alert("PRESSTO files are not supported yet.");
            /*
            myChart.data.minT = 0;
            let period = parseFloat(data[15].split(' ').filter(str => str != '')[4]) / 1000;
            let fluxstr: string[] = data
            // console.log(fluxstr);
            if (data[27].includes("\t")) {
                fluxstr = data.filter(str => (str[0] !== '#' && str.length != 0)).map(str => str.split("\t")[str.split("\t").length - 1].trim());
            } else {
                fluxstr = data.filter(str => (str[0] !== '#' && str.length != 0)).map(str => str.split(" ")[str.split(" ").length - 1].trim());
            }
            // console.log(fluxstr);
            if (!fluxstr[0].includes("e+")) {
                var fluxes: number[] = fluxstr.map(Number);
            } else {
                var fluxes: number[] = fluxstr.map(f => parseFloat(f.split("e+")[0]) * (10 ** parseFloat(f.split("e+")[1])));
            }
            // console.log(fluxes);
            let sampleRat = period / fluxes.length;

            var max = ArrMath.max(fluxes);
            //console.log(max)
            let med = median(fluxes);
            //console.log([med,max])

            const chartData = [];
            for (let i = 0; i < 2 * fluxes.length; i++) {
                let flux = fluxes[i % fluxes.length];
                if (isNaN(flux)) {
                    continue;
                }
                chartData.push({
                    'x': sampleRat * i,
                    'y': (flux - med) / (max - med),
                });
            }
            presstoMode(myChart, chartData, period)
            


        }
    }
        
    reader.readAsText(file);
}
    

  }
}
  }
    



}
/*
export function pulsar(): [Handsontable, Chart] {
    // Initialize form elements and event listeners here
    initializeForm();
    // Return the Handsontable and Chart instances
    return [handsontableInstance, chartInstance];
}
    */


/*
function initializeForm() {
    const pulsarForm = document.getElementById('pulsar-form') as HTMLFormElement;
    const lightCurveDiv = document.getElementById('light-curve-div');
    const fourierDiv = document.getElementById('fourier-div');
    const periodFoldingDiv = document.getElementById('period-folding-div');

    // Add event listeners and other initialization code here
    const computeButton = document.getElementById('compute') as HTMLButtonElement;
    computeButton.onclick = (e) => {
        e.preventDefault();
        // Add your computation logic here
    };



    // Graph control buttons
    const panRight = document.getElementById('panRight') as HTMLButtonElement;
    const zoomIn = document.getElementById('zoomIn') as HTMLButtonElement;
    const zoomOut = document.getElementById('zoomOut') as HTMLButtonElement;
    const Reset = document.getElementById('Reset') as HTMLButtonElement;

    let pan: number;
    panRight.onmousedown = function () {
        pan = setInterval(() => {
            myChart.pan(-5)
        }, 20);
    }
    panRight.onmouseup = panRight.onmouseleave = function () {
        clearInterval(pan);
    }

    Reset.onclick = function () {
        myChart.resetZoom();
        myChart.update();
    }

    let zoom: number;
    zoomIn.onmousedown = function () {
        zoom = setInterval(() => {
            myChart.zoom(1.03)
        }, 20);
    }
    zoomIn.onmouseup = zoomIn.onmouseleave = function () {
        clearInterval(zoom);
    }
    zoomOut.onmousedown = function () {
        zoom = setInterval(() => {
            myChart.zoom(0.97);
        }, 20);
    }
    zoomOut.onmouseup = zoomOut.onmouseleave = function () {
        clearInterval(zoom);
    }
}
    
export const ArrMath = {
    max: function (arr: number[]): number {
        return Math.max.apply(null, arr);
    },
    min: function (arr: number[]): number {
        return Math.min.apply(null, arr);
    },
    sum: function (arr: number[]): number {
        return arr.reduce((acc, cur) => acc + cur, 0);
    },
    weightedSum: function (arr: number[], weight: number[]): number {
        let summed = 0;
        for (let i = 0; i < arr.length; i++) {
            summed = summed + arr[i] * weight[i];
        }

        return summed
    },
    mean: function (arr: number[]): number {
        return this.sum(arr) / arr.length;
    },
    errorMean: function (arr: number[], error: number[]) {
        let weight = [];
        for (let i = 0; i < arr.length; i++) {
            weight[i] = 1 / (error[i] * error[i])
        }

        return this.weightedSum(arr, weight) / this.sum(weight)

    },
    mul: function (arr1: number[] | number, arr2: number[] | number): number[] {
        if (Array.isArray(arr1) && Array.isArray(arr2)) {
            console.assert(arr1.length === arr2.length,
                "Error: Dimension mismatch when multiplying two arrays.");
            return arr1.map((x, i) => x * arr2[i]);
        } else if (Array.isArray(arr1)) {
            return arr1.map(x => x * (arr2 as number));
        } else if (Array.isArray(arr2)) {
            return arr2.map(x => x * (arr1 as number));
        } else {
            throw new TypeError("Error: Do not use ArrMath for scalar multiplications");
        }
    },
    div: function (arr1: number[] | number, arr2: number[] | number): number[] {
        if (Array.isArray(arr1) && Array.isArray(arr2)) {
            console.assert(arr1.length === arr2.length,
                "Error: Dimension mismatch when dividing two arrays.");
            return arr1.map((x, i) => x / arr2[i]);
        } else if (Array.isArray(arr1)) {
            return arr1.map(x => x / (arr2 as number));
        } else if (Array.isArray(arr2)) {
            return arr2.map(x => x / (arr1 as number));
        } else {
            throw new TypeError("Error: Do not use ArrMath for scalar divisions");
        }
    },
    add: function (arr1: number[] | number, arr2: number[] | number): number[] {
        if (Array.isArray(arr1) && Array.isArray(arr2)) {
            console.assert(arr1.length === arr2.length,
                "Error: Dimension mismatch when adding two arrays.");
            return arr1.map((x, i) => x + arr2[i]);
        } else if (Array.isArray(arr1)) {
            return arr1.map(x => x + (arr2 as number));
        } else if (Array.isArray(arr2)) {
            return arr2.map(x => x + (arr1 as number));
        } else {
            throw new TypeError("Error: Do not use ArrMath for scalar additions");
        }
    },
    sub: function (arr1: number[] | number, arr2: number[] | number): number[] {
        if (Array.isArray(arr1) && Array.isArray(arr2)) {
            console.assert(arr1.length === arr2.length,
                "Error: Dimension mismatch when subtracting two arrays.");
            return arr1.map((x, i) => x - arr2[i]);
        } else if (Array.isArray(arr1)) {
            return arr1.map(x => x - (arr2 as number));
        } else if (Array.isArray(arr2)) {
            return arr2.map(x => x - (arr1 as number));
        } else {
            throw new TypeError("Error: Do not use ArrMath for scalar subtractions");
        }
    },
    dot: function (arr1: number[] | number, arr2?: number[] | number): number {
        if (arr2 === undefined) {
            return this.dot(arr1, arr1);
        }
        if (Array.isArray(arr1) && Array.isArray(arr2)) {
            console.assert(arr1.length === arr2.length,
                "Error: Dimension mismatch when dot multiplying two arrays.");
            return arr1.reduce((acc, cur, i) => (acc + cur * arr2[i]), 0);
        } else if (!Array.isArray(arr1) && !Array.isArray(arr2)) {
            return arr1 * arr2;
        } else {
            throw new TypeError("Error: Can't take dot product of a vector and a number");
        }
    },
    errordot: function (arr1: number[] | number, error: number[] | number, arr2?: number[] | number,): number {
        if (arr2 === undefined) {
            return this.errordot(arr1, error, arr1);
        }
        if (Array.isArray(arr1) && Array.isArray(arr2) && Array.isArray(error)) {
            console.assert(arr1.length === arr2.length,
                "Error: Dimension mismatch when dot multiplying two arrays.");
            let weight = [];
            let dotlist = []
            for (let i = 0; i < arr1.length; i++) {
                weight[i] = 1 / (error[i] * error[i])
                dotlist.push(arr1[i] * arr2[i])
            }

            return this.weightedSum(dotlist, weight) / this.sum(weight);
        } else if (!Array.isArray(arr1) && !Array.isArray(arr2) && !Array.isArray(error)) {
            return arr1 * arr2;
        } else {
            throw new TypeError("Error: Can't take dot product of a vector and a number");
        }
    },
    cos: function (arr: number[]): number[] {
        return arr.map(x => Math.cos(x));
    },
    sin: function (arr: number[]): number[] {
        return arr.map(x => Math.sin(x));
    },
    var: function (arr: number[]): number {
        // Variance
        let mean = this.mean(arr);
        return this.sum(arr.map(x => Math.pow(x - mean, 2))) / arr.length;
    }
}
*/