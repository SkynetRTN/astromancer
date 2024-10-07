// Assuming fitsjs.ts or fitsjs.js is your implementation file

namespace astro.FITS {
    export class Image {
      bitpix: number;
      bscale: number;
      bzero: number;
      width: number;
      height: number;
      buffer: ArrayBuffer;
      frameLength: number;
      frameOffsets: Array<{ begin: number }>;
  
      constructor(header: any, data: ArrayBuffer) {
        this.bitpix = header.bitpix;
        this.bscale = header.bscale || 1;
        this.bzero = header.bzero || 0;
        this.width = header.naxis[0];
        this.height = header.naxis[1];
        this.buffer = data;
        this.frameLength = this.width * this.height * (Math.abs(this.bitpix) / 8);
        this.frameOffsets = [{ begin: 0 }];
      }
  
      // Implement the getFrame method here
      getFrame(
        frame: number,
        callback: (arr: Float32Array | Float64Array, opts?: any) => void,
        opts?: any
      ): void {
        const frameInfo = this.frameOffsets[frame];
        if (!frameInfo) {
          console.error(`Frame ${frame} not found in frameOffsets.`);
          return;
        }
  
        const begin = frameInfo.begin;
        const end = begin + this.frameLength;
  
        if (end > this.buffer.byteLength) {
          console.error('Attempting to access data beyond buffer limits.');
          return;
        }
  
        const frameData = this.buffer.slice(begin, end);
  
        const expectedByteLength = this.width * this.height * this.bytes; // For Float64Array, bytes = 8
        if (frameData.byteLength !== expectedByteLength) {
          console.error('Frame data length mismatch. Expected:', expectedByteLength, 'Got:', frameData.byteLength);
          return;
        }
  
        try {
          const pixelArray = new Float64Array(frameData);
  
          for (let i = 0; i < pixelArray.length; i++) {
            pixelArray[i] = this.bzero + this.bscale * pixelArray[i];
          }
  
          callback(pixelArray, opts);
        } catch (error) {
          console.error('Error processing frame data:', error);
        }
      }
    }
  }
  