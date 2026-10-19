import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { StudentDetailsComponent } from './student-details.component';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/models/student';

describe('StudentDetailsComponent', () => {
  let component: StudentDetailsComponent;
  let fixture: ComponentFixture<StudentDetailsComponent>;

  // Mock the service to avoid real HTTP requests.
  let studentService: {
    getStudentById: jest.Mock;
  };

  // Mock the route to control the student ID.
  let routeStub: {
    snapshot: {
      paramMap: ReturnType<typeof convertToParamMap>;
    };
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

  beforeEach(async () => {
    studentService = {
      getStudentById: jest.fn()
    };

    // Default route parameter: student ID 12.
    routeStub = {
      snapshot: {
        paramMap: convertToParamMap({ id: '12' })
      }
    };

    // Configure the Angular testing environment.
    await TestBed.configureTestingModule({
      imports: [StudentDetailsComponent],
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

    fixture = TestBed.createComponent(StudentDetailsComponent);
    component = fixture.componentInstance;
  });

  // Initialize the component and execute ngOnInit().
  function initializeComponent(): void {
    fixture.detectChanges();
  }

  describe('initialization', () => {
    it('should create the component', () => {
      studentService.getStudentById.mockReturnValue(of(mockStudent));

      initializeComponent();

      expect(component).toBeTruthy();
    });

    it('should initialize with loading set to true', () => {
      expect(component.loading).toBe(true);
    });

    it('should load the student using the ID from the route', () => {
      studentService.getStudentById.mockReturnValue(of(mockStudent));

      initializeComponent();

      expect(studentService.getStudentById).toHaveBeenCalledWith(12);
    });

    it('should store the student returned by the service', () => {
      studentService.getStudentById.mockReturnValue(of(mockStudent));

      initializeComponent();

      expect(component.student).toEqual(mockStudent);
    });

    it('should set loading to false after loading the student', () => {
      studentService.getStudentById.mockReturnValue(of(mockStudent));

      initializeComponent();

      expect(component.loading).toBe(false);
    });

    it('should not display an error message after successful loading', () => {
      studentService.getStudentById.mockReturnValue(of(mockStudent));

      initializeComponent();

      expect(component.errorMessage).toBe('');
    });
  });

  describe('student ID validation', () => {
    it('should reject a non-numeric student ID', () => {
      routeStub.snapshot.paramMap = convertToParamMap({
        id: 'abc'
      });

      initializeComponent();

      expect(component.errorMessage).toBe('Invalid student ID.');
      expect(component.loading).toBe(false);
      expect(component.student).toBeUndefined();
      expect(studentService.getStudentById).not.toHaveBeenCalled();
    });

    it('should reject a student ID of zero', () => {
      routeStub.snapshot.paramMap = convertToParamMap({
        id: '0'
      });

      initializeComponent();

      expect(component.errorMessage).toBe('Invalid student ID.');
      expect(component.loading).toBe(false);
      expect(studentService.getStudentById).not.toHaveBeenCalled();
    });

    it('should reject a negative student ID', () => {
      routeStub.snapshot.paramMap = convertToParamMap({
        id: '-1'
      });

      initializeComponent();

      expect(component.errorMessage).toBe('Invalid student ID.');
      expect(component.loading).toBe(false);
      expect(studentService.getStudentById).not.toHaveBeenCalled();
    });

    it('should reject a missing student ID', () => {
      routeStub.snapshot.paramMap = convertToParamMap({});

      initializeComponent();

      expect(component.errorMessage).toBe('Invalid student ID.');
      expect(component.loading).toBe(false);
      expect(studentService.getStudentById).not.toHaveBeenCalled();
    });
  });
});