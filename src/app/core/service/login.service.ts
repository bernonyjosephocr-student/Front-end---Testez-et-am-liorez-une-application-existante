import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly httpClient = inject(HttpClient);

  login(request: LoginRequest): Observable<String> {
    return this.httpClient.post('/api/login', request, {responseType: 'text'})
      .pipe(
        tap(token => {
          // Store the token in local storage or a service for later use
          localStorage.setItem('authToken', token);
        })
      );
  }


}
