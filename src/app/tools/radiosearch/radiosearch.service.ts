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
      private http: HttpClient,
      private storageService: RadioSearchStorageService
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


fetchRadioCatalog(ra: number, dec: number, width: number, height: number): Observable<any> {
  // Build the payload with RA, Dec, width, and height
  const payload = { ra, dec, width, height };

  console.log('Payload being sent:', payload);  // Debugging

  // Use the environment.apiUrl variable with template strings (backticks)
  return this.http.post(`${environment.apiUrl}/radiosearch/radio-catalog/query`, payload);
}



// Function to process the catalog results
processRadioCatalogResults(results: any): void {
  // Logic to handle the results goes here
  console.log('Processing catalog results:', results);

  // You can store the results or update the UI accordingly
  // For example:
  this.storageService.setSources(results);
}

}