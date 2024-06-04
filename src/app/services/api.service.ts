import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private token = environment.token;

  constructor(private http: HttpClient) {}

  getProductData(query: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}?t=${this.token}&q=${query}`;
    return this.http.get<any>(url).pipe(
      map(response => ApiResponse.fromJson(response))
    );
  }
}
