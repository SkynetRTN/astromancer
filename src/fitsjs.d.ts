declare module 'fitsjs' {
  export namespace astro {
    export class FITS {
      constructor(arg: Blob | ArrayBuffer, callback: (fits: FITS) => void, opts?: any);  // Support both Blob and ArrayBuffer with a callback
      getHDU(index: number): HDU;  // Method to get HDU by index
    }

    export class HDU {
      header: Header;
      dataUnit: DataUnit;
      getFrame(): Float32Array;  // Method to get frame data as Float32Array
    }

    export class Header {
      naxis: number;
      naxis1: number;
      naxis2: number;
      bitpix: number;
      bscale?: number;
      bzero?: number;
      [key: string]: any;  // Handle any other keys in the header
    }

    export class DataUnit {
      data: Float32Array;
    }
  }
}
