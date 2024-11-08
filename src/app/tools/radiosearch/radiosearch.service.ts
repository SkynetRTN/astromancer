import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Job, JobType, JobStorageObject } from '../../shared/job/job';  // Ensure correct path to Job
import { RadioSearchStorageService } from './storage/radiosearch-storage.service';  // Path to your storage service
import { Source } from './storage/radiosearch-storage.service.util';  // Import Source from the appropriate file
import { BehaviorSubject } from 'rxjs';
import {environment} from "../../../environments/environment";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
    providedIn: 'root',
  })
  export class RadioSearchService {
    public sources: { ra: number; dec: number }[] = [];  // Updated type to match simplified sources
    public sourcesSubject: BehaviorSubject<{ ra: number; dec: number }[]>;

    constructor(
      private http: HttpClient
    ) {
      
        // Initialize the BehaviorSubject with an empty array or existing sources
        this.sourcesSubject = new BehaviorSubject<{ ra: number; dec: number }[]>(this.sources);
    }


  public setSources(sources: Source[]) {
    this.sources = [];

    // Loop through the provided sources and add them to the list
    for (const source of sources) {
        if (source.ra != null && source.dec != null) {
            this.sources.push({
                ra: source.ra,
                dec: source.dec
            });
        }
    }

    // Notify any subscribers about the updated sources list
    this.sourcesSubject.next(this.sources);
}



public getRadioCatalogResults(id: number | null): Observable<any> | void {
  if (id !== null) {
    // Return the Observable so you can subscribe to it outside this method
    return this.http.get<any>(`${environment.apiUrl}/radiosearch/radio-catalog/query`, { 
      params: { 'id': id.toString() }
    }).pipe(
      map((resp: any) => {
        const sources: Source[] = resp['output_sources'];  // Extract sources from the response
        this.setSources(sources);  // Set the sources in storage
        return resp;  // Return the response or sources if needed
      })
    );
  }
  return;  // If id is null, return void
}


fetchRadioCatalog(rccords: string, ra: number, dec: number, width: number, height: number): Observable<any> {
  // Build the payload with RA, Dec, width, and height
  const payload = { rccords, ra, dec, width, height };

  console.log('Payload being sent:', payload);  // Debugging

  // Use the environment.apiUrl variable with template strings (backticks)
  return this.http.post(`${environment.apiUrl}/radiosearch/radio-catalog/query`, payload);
}

// Method to process and extract a frame from the FITS image
getFrame(
  fitsImage: any,
  frame: number,
  callback: (arr: Float64Array, opts?: any) => void,
  opts?: any
): void {
  const frameInfo = fitsImage.frameOffsets[frame];
  if (!frameInfo) {
    console.error(`Frame ${frame} not found in frameOffsets.`);
    return;
  }

  const begin = frameInfo.begin;
  const end = begin + fitsImage.frameLength;

  if (end > fitsImage.buffer.byteLength) {
    console.error('Attempting to access data beyond buffer limits.');
    return;
  }

  const frameData = fitsImage.buffer.slice(begin, end);

  // Check if the buffer length matches the expected frame size
  const expectedByteLength = fitsImage.width * fitsImage.height * fitsImage.bytes;
  if (frameData.byteLength !== expectedByteLength) {
    console.error('Frame data length mismatch. Expected:', expectedByteLength, 'Got:', frameData.byteLength);
    return;
  }

  try {
    const pixelArray = new Float64Array(frameData);

    // Apply BZERO and BSCALE if needed
    for (let i = 0; i < pixelArray.length; i++) {
      pixelArray[i] = fitsImage.bzero + fitsImage.bscale * pixelArray[i];
    }

    // Call the callback with the processed data
    callback(pixelArray, opts);
  } catch (error) {
    console.error('Error processing frame data:', error);
  }
}

// Utility function to convert FITS image data to ImageData format for display
convertFitsToImageData(imageData: Float64Array, width: number, height: number): ImageData {
  const imageDataArray = new Uint8ClampedArray(width * height * 4); // RGBA array

  // Normalize and map the FITS data to the canvas data array
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < imageData.length; i++) {
    if (imageData[i] < min) min = imageData[i];
    if (imageData[i] > max) max = imageData[i];
  }

  for (let i = 0; i < imageData.length; i++) {
    // Normalize the pixel value to 0-255 range
    const normalizedValue = Math.floor(255 * (imageData[i] - min) / (max - min));

    // Set the RGBA values
    const index = i * 4;
    imageDataArray[index] = normalizedValue; // Red channel
    imageDataArray[index + 1] = normalizedValue; // Green channel
    imageDataArray[index + 2] = normalizedValue; // Blue channel
    imageDataArray[index + 3] = 255; // Alpha channel (fully opaque)
  }

  return new ImageData(imageDataArray, width, height);
}

}