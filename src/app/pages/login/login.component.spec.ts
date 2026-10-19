import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { LoginComponent } from './login.component';
import { LoginService } from '../../core/service/login.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  const loginService = {
    login: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    loginService.login.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        {
          provide: LoginService,
          useValue: loginService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should initialize the component with default values', () => {
      expect(component.loading).toBe(false);
      expect(component.loginSuccess).toBe(false);
      expect(component.errorMessage).toBe('');
      expect(component.hidePassword).toBe(true);
    });

    it('should initialize the login form with empty fields', () => {
      expect(component.loginForm.getRawValue()).toEqual({
        login: '',
        password: ''
      });
    });

    it('should mark the form as invalid when the fields are empty', () => {
      expect(component.loginForm.invalid).toBe(true);
      expect(component.loginForm.controls.login.hasError('required')).toBe(true);
      expect(component.loginForm.controls.password.hasError('required')).toBe(true);
    });

    it('should mark the form as valid when both fields are filled', () => {
      component.loginForm.setValue({
        login: 'john.doe',
        password: 'password123'
      });

      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe('onSubmit()', () => {
    it('should not call the login service when the form is invalid', () => {
      component.onSubmit();

      expect(loginService.login).not.toHaveBeenCalled();
      expect(component.loading).toBe(false);
      expect(component.loginSuccess).toBe(false);
    });

    it('should call the login service with the entered credentials', () => {
      component.loginForm.setValue({
        login: 'john.doe',
        password: 'password123'
      });

      component.onSubmit();

      expect(loginService.login).toHaveBeenCalledWith({
        login: 'john.doe',
        password: 'password123'
      });
    });

    it('should set the success state and navigate to students after login', () => {
      component.loginForm.setValue({
        login: 'john.doe',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.loading).toBe(false);
      expect(component.loginSuccess).toBe(true);
      expect(router.navigate).toHaveBeenCalledWith(['/students']);
    });

    it('should set loading to true while the login request is pending', () => {
      const loginResponse = new Subject<void>();
      loginService.login.mockReturnValue(loginResponse.asObservable());

      component.loginForm.setValue({
        login: 'john.doe',
        password: 'password123'
      });

      component.onSubmit();

      expect(component.loading).toBe(true);

      loginResponse.next();

      expect(component.loading).toBe(false);
      expect(component.loginSuccess).toBe(true);
      expect(router.navigate).toHaveBeenCalledWith(['/students']);

      loginResponse.complete();
    });

    it('should display the error message returned by the server', () => {
      loginService.login.mockReturnValue(
        throwError(() => ({
          error: { message: 'Invalid credentials' },
          status: 401
        }))
      );

      component.loginForm.setValue({
        login: 'john.doe',
        password: 'wrong-password'
      });

      jest.spyOn(console, 'error').mockImplementation();

      component.onSubmit();

      expect(component.loading).toBe(false);
      expect(component.loginSuccess).toBe(false);
      expect(component.errorMessage).toBe('Invalid credentials');
    });

    it('should parse a JSON error response', () => {
      loginService.login.mockReturnValue(
        throwError(() => ({
          error: JSON.stringify({ message: 'Account locked' }),
          status: 401
        }))
      );

      component.loginForm.setValue({
        login: 'john.doe',
        password: 'password123'
      });

      jest.spyOn(console, 'error').mockImplementation();

      component.onSubmit();

      expect(component.errorMessage).toBe('Account locked');
    });

    it('should display a connection error when the server is unreachable', () => {
      loginService.login.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 0 }))
      );

      component.loginForm.setValue({
        login: 'john.doe',
        password: 'password123'
      });

      jest.spyOn(console, 'error').mockImplementation();

      component.onSubmit();

      expect(component.loading).toBe(false);
      expect(component.errorMessage).toBe('Unable to connect to the server.');
    });
  });
});