import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting // replace the HTTP backend with a mock backend for testing
} from '@angular/common/http/testing';

import { LoginService } from './login.service';
import { LoginRequest } from '../models/login';

describe('LoginService', () => {
  let service: LoginService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(LoginService);
    httpTestingController = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  // Testing the login method to ensure it sends the correct request and handles the response properly
  it('should send login credentials and store the returned token', () => {
    const request = {
      login: 'testuser',
      password: 'password'
    } as LoginRequest;

    const token = 'test-jwt-token';

    service.login(request).subscribe(response => {
      expect(response).toBe(token);
      expect(localStorage.getItem('authToken')).toBe(token);
    });

    const httpRequest = httpTestingController.expectOne('/api/login');
    // Let's check the request method, body, and response type
    expect(httpRequest.request.method).toBe('POST');
    expect(httpRequest.request.body).toEqual(request);
    expect(httpRequest.request.responseType).toBe('text');

    httpRequest.flush(token);
  });
});