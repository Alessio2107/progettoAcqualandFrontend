import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttractionService {

  private apiUrl = 'http://localhost:8080/api/attrazioni';

  constructor(private http: HttpClient) {}

  getNearbyAttractions(latitude: number, longitude: number,
     age: number, height: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/nearby`, {
      params: {
        userLatitude: latitude.toString(),
        userLongitude: longitude.toString(),
        userAge: age.toString(),
        userHeight: height.toString()
      }
    });
  }
}
