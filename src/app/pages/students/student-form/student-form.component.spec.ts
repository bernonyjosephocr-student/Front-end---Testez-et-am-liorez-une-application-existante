import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { StudentFormComponent } from './student-form.component';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/models/student';

describe('StudentFormComponent', () => {
  let component: StudentFormComponent; //the comp being tested
  let fixture: ComponentFixture<StudentFormComponent>; // comp test environment containing the comp and its template
  let router: Router; // router for verifying navigation

  // Mocking the service for not ding actual HTTP request to the backend.
  let studentService: {
    getStudentById: jest.Mock;
    createStudent: jest.Mock;
    updateStudent: jest.Mock;
  };

  let routeStub: {
    snapshot: {
      paramMap: ReturnType<typeof convertToParamMap>;
      params: Record<string, string>;
    };
    paramMap: ReturnType<typeof of>;
    params: ReturnType<typeof of>;
  };

  const mockStudent: Student = {
    id: 12,
    cardNumber: 'CARD001',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-05-15',
    email: 'john.doe@example.com',
    phoneNumber: '+33123456789',
    homeAddress: '10 Main Street',
    membershipType: 'Standard',
    studentCardNumber: 'STU001',
    studentCardExpiryDate: '2027-12-31',
    membershipExpiryDate: '2027-12-31',
    accountStatus: 'ACTIVE'
  };

  // Configures the Angular testing environment and creates a fresh component
  beforeEach(async () => {
    studentService = {
      getStudentById: jest.fn(),
      createStudent: jest.fn(),
      updateStudent: jest.fn()
    };

    routeStub = {
      snapshot: {
        paramMap: convertToParamMap({}),
        params: {}
      },
      paramMap: of(convertToParamMap({})),
      params: of({})
    };
    // Configuring the testing environment using TesBed  Ang utility 
    await TestBed.configureTestingModule({
      imports: [StudentFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: routeStub
        },
        {
          provide: StudentService,
          useValue: studentService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  //  Initialize the logic to be tested
  function initializeComponent(): void {
    fixture.detectChanges();
  }

  function fillValidForm(): void {
    component.form.patchValue({
      cardNumber: 'CARD001',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-05-15',
      email: 'john.doe@example.com',
      phoneNumber: '+33123456789',
      homeAddress: '10 Main Street',
      membershipType: 'Standard',
      studentCardNumber: 'STU001',
      studentCardExpiryDate: '2027-12-31',
      membershipExpiryDate: '2027-12-31',
      accountStatus: 'ACTIVE'
    });
  }

  describe('initialization', () => {
    it('should create the component', () => {
      initializeComponent();

      expect(component).toBeTruthy();
    });

    it('should initialize in create mode when no student ID is provided', () => {
      initializeComponent();

      expect(component.studentId).toBeUndefined();
      expect(component.loading).toBe(false);
      expect(studentService.getStudentById).not.toHaveBeenCalled();
    });

    it('should set an error message when the student ID is invalid', () => {
      routeStub.snapshot.paramMap = convertToParamMap({ id: 'abc' });

      initializeComponent();

      expect(component.errorMessage).toBe('Invalid student ID.');
      expect(component.studentId).toBeUndefined();
      expect(studentService.getStudentById).not.toHaveBeenCalled();
    });

    it('should reject a student ID of zero', () => {
      routeStub.snapshot.paramMap = convertToParamMap({ id: '0' });

      initializeComponent();

      expect(component.errorMessage).toBe('Invalid student ID.');
      expect(studentService.getStudentById).not.toHaveBeenCalled();
    });

    it('should load the student and populate the form in edit mode', () => {
      routeStub.snapshot.paramMap = convertToParamMap({ id: '12' });
      studentService.getStudentById.mockReturnValue(of(mockStudent));

      initializeComponent();

      expect(studentService.getStudentById).toHaveBeenCalledWith(12);
      expect(component.studentId).toBe(12);
      expect(component.loading).toBe(false);
      expect(component.form.getRawValue()).toEqual({
        cardNumber: mockStudent.cardNumber,
        firstName: mockStudent.firstName,
        lastName: mockStudent.lastName,
        dateOfBirth: mockStudent.dateOfBirth,
        email: mockStudent.email,
        phoneNumber: mockStudent.phoneNumber,
        homeAddress: mockStudent.homeAddress,
        membershipType: mockStudent.membershipType,
        studentCardNumber: mockStudent.studentCardNumber,
        studentCardExpiryDate: mockStudent.studentCardExpiryDate,
        membershipExpiryDate: mockStudent.membershipExpiryDate,
        accountStatus: mockStudent.accountStatus
      });
    });

    it('should handle a failure when loading a student', () => {
      routeStub.snapshot.paramMap = convertToParamMap({ id: '12' });

      studentService.getStudentById.mockReturnValue(
        throwError(() => ({ status: 500 }))
      );

      jest.spyOn(console, 'error').mockImplementation(() => {});

      initializeComponent();

      expect(component.errorMessage).toBe(
        'Unable to load the student. Please try again.'
      );
      expect(component.loading).toBe(false);
    });
  });

  describe('form validation', () => {
    it('should initialize the form as invalid', () => {
      initializeComponent();

      expect(component.form.invalid).toBe(true);
    });

    it('should mark all fields as touched when saving an invalid form', () => {
      initializeComponent();

      component.save();

      expect(component.form.invalid).toBe(true);
      expect(component.form.controls.cardNumber.touched).toBe(true);
      expect(component.form.controls.firstName.touched).toBe(true);
      expect(component.form.controls.email.touched).toBe(true);
      expect(studentService.createStudent).not.toHaveBeenCalled();
    });

    it('should reject an invalid email address', () => {
      initializeComponent();
      fillValidForm();

      component.form.controls.email.setValue('invalid-email');

      expect(component.form.controls.email.hasError('email')).toBe(true);
      expect(component.form.invalid).toBe(true);
    });

    it('should reject an invalid phone number', () => {
      initializeComponent();
      fillValidForm();

      component.form.controls.phoneNumber.setValue('abc');

      expect(
        component.form.controls.phoneNumber.hasError('pattern')
      ).toBe(true);

      expect(component.form.invalid).toBe(true);
    });

    it('should accept valid form data', () => {
      initializeComponent();
      fillValidForm();

      expect(component.form.valid).toBe(true);
    });
  });

  describe('saving a student', () => {
    // prepares the component for tests specifically concerned with saving a student
    beforeEach(() => {
      initializeComponent();
      fillValidForm();
    });

    it('should create a student and navigate to the saved student', () => {
      studentService.createStudent.mockReturnValue(
        of(mockStudent)
      );

      const navigateSpy = jest.spyOn(router, 'navigate');

      component.save();

      expect(studentService.createStudent).toHaveBeenCalledWith(
        component.form.getRawValue()
      );
      expect(component.saving).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith([ '/students', mockStudent.id ]);
    });

    it('should update an existing student and navigate to the saved student', () => {
      component.studentId = 12;

      studentService.updateStudent.mockReturnValue(
        of(mockStudent)
      );

      const navigateSpy = jest.spyOn(router, 'navigate');

      component.save();

      expect(studentService.updateStudent).toHaveBeenCalledWith(
        12,
        component.form.getRawValue()
      );

      expect(studentService.createStudent).not.toHaveBeenCalled();

      expect(navigateSpy).toHaveBeenCalledWith([
        '/students',
        mockStudent.id
      ]);
    });

    it('should not save while the component is loading', () => {
      component.loading = true;

      component.save();

      expect(studentService.createStudent).not.toHaveBeenCalled();
      expect(studentService.updateStudent).not.toHaveBeenCalled();
    });

    it('should not save while another save is in progress', () => {
      component.saving = true;

      component.save();

      expect(studentService.createStudent).not.toHaveBeenCalled();
      expect(studentService.updateStudent).not.toHaveBeenCalled();
    });

    it('should clear the previous error message before saving', () => {
      component.errorMessage = 'Previous error';
      studentService.createStudent.mockReturnValue(of(mockStudent));

      component.save();

      expect(component.errorMessage).toBe('');
    });
  });
});