import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  saveUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl+'/create', user);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/find/${id}`);
  }
}
