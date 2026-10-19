import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;

  const userService = {
    register: jest.fn()
  };

  beforeAll(() => {
    Object.defineProperty(window, 'alert', {
      writable: true,
      value: jest.fn()
    });
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    userService.register.mockReturnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        {
          provide: UserService,
          useValue: userService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should initialize the registration form with empty fields', () => {
      expect(component.registerForm.value).toEqual({
        firstName: '',
        lastName: '',
        login: '',
        password: ''
      });
    });

    it('should mark the form as invalid when all fields are empty', () => {
      expect(component.registerForm.invalid).toBe(true);
    });

    it('should require all registration fields', () => {
      expect(component.form['firstName'].hasError('required')).toBe(true);
      expect(component.form['lastName'].hasError('required')).toBe(true);
      expect(component.form['login'].hasError('required')).toBe(true);
      expect(component.form['password'].hasError('required')).toBe(true);
    });

    it('should expose the form controls through the form getter', () => {
      expect(component.form).toBe(component.registerForm.controls);
    });

    it('should mark the form as valid when all fields are filled', () => {
      component.registerForm.setValue({
        firstName: 'John',
        lastName: 'Doe',
        login: 'john.doe',
        password: 'password123'
      });

      expect(component.registerForm.valid).toBe(true);
    });
  });

  describe('onSubmit()', () => {
    it('should mark the form as submitted', () => {
      component.onSubmit();

      expect(component.submitted).toBe(true);
    });

    it('should not call the registration service when the form is invalid', () => {
      component.onSubmit();

      expect(userService.register).not.toHaveBeenCalled();
    });

    it('should register the user with the entered form values', () => {
      const registerData = {
        firstName: 'John',
        lastName: 'Doe',
        login: 'john.doe',
        password: 'password123'
      };

      component.registerForm.setValue(registerData);

      component.onSubmit();

      expect(userService.register).toHaveBeenCalledWith(registerData);
    });

    it('should display a success alert after registration', () => {
      component.registerForm.setValue({
        firstName: 'John',
        lastName: 'Doe',
        login: 'john.doe',
        password: 'password123'
      });

      component.onSubmit();

      expect(window.alert).toHaveBeenCalledWith('SUCCESS!! :-)');
    });

    it('should navigate to the login page after registration', () => {
      component.registerForm.setValue({
        firstName: 'John',
        lastName: 'Doe',
        login: 'john.doe',
        password: 'password123'
      });

      component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('onReset()', () => {
    it('should reset the submitted flag', () => {
      component.submitted = true;

      component.onReset();

      expect(component.submitted).toBe(false);
    });

    it('should reset all form fields', () => {
      component.registerForm.setValue({
        firstName: 'John',
        lastName: 'Doe',
        login: 'john.doe',
        password: 'password123'
      });

      component.onReset();

      expect(component.registerForm.value).toEqual({
        firstName: null,
        lastName: null,
        login: null,
        password: null
      });
    });
  });
});