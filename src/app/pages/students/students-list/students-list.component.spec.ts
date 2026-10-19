import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { StudentsListComponent } from './students-list.component';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/model/student.model';

describe('StudentsListComponent', () => {
  let component: StudentsListComponent;
  let fixture: ComponentFixture<StudentsListComponent>;

  let studentService: {
    getStudents: jest.Mock;
    deleteStudent: jest.Mock;
  };

  let snackBar: {
    open: jest.Mock;
  };

  const mockStudents: Student[] = [
    {
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
    },
    {
      id: 13,
      cardNumber: 'CARD002',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1995-08-20',
      email: 'jane.smith@example.com',
      phoneNumber: '+33987654321',
      homeAddress: '20 High Street',
      membershipType: 'Premium',
      studentCardNumber: 'STU002',
      studentCardExpiryDate: '2027-12-31',
      membershipExpiryDate: '2027-12-31',
      accountStatus: 'ACTIVE'
    }
  ];

  beforeEach(async () => {
    studentService = {
      getStudents: jest.fn().mockReturnValue(of(mockStudents)),
      deleteStudent: jest.fn().mockReturnValue(of(void 0))
    };

    snackBar = {
      open: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [StudentsListComponent],
      providers: [
        provideRouter([]),
        {
          provide: StudentService,
          useValue: studentService
        },
        {
          provide: MatSnackBar,
          useValue: snackBar
        }
      ]
    })
      .overrideComponent(StudentsListComponent, {
        set: {
          providers: [
            {
              provide: StudentService,
              useValue: studentService
            },
            {
              provide: MatSnackBar,
              useValue: snackBar
            }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(StudentsListComponent);
    component = fixture.componentInstance;
  });

  describe('initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with an empty students list', () => {
      expect(component.students).toEqual([]);
    });

    it('should initialize with loading set to true', () => {
      expect(component.loading).toBe(true);
    });

    it('should initialize with an empty error message', () => {
      expect(component.errorMessage).toBe('');
    });

    it('should define the displayed columns', () => {
      expect(component.displayedColumns).toEqual([
        'cardNumber',
        'firstName',
        'lastName',
        'email',
        'membershipType',
        'accountStatus',
        'actions'
      ]);
    });

    it('should load students when the component initializes', () => {
      fixture.detectChanges();

      expect(studentService.getStudents).toHaveBeenCalledTimes(1);
    });

    it('should store the students returned by the service', () => {
      fixture.detectChanges();

      expect(component.students).toEqual(mockStudents);
    });

    it('should finish loading after students are retrieved', () => {
      fixture.detectChanges();

      expect(component.loading).toBe(false);
    });
  });

  describe('loadStudents()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call the student service', () => {
      studentService.getStudents.mockClear();

      component.loadStudents();

      expect(studentService.getStudents).toHaveBeenCalledTimes(1);
    });

    it('should replace the current students list with the retrieved list', () => {
      const updatedStudents = [mockStudents[0]];

      studentService.getStudents.mockReturnValue(of(updatedStudents));

      component.loadStudents();

      expect(component.students).toEqual(updatedStudents);
    });

    it('should finish loading after reloading students', () => {
      component.loading = true;

      component.loadStudents();

      expect(component.loading).toBe(false);
    });

    it('should clear the error message when reloading students', () => {
      component.errorMessage = 'Previous error';

      component.loadStudents();

      expect(component.errorMessage).toBe('');
    });

    it('should handle an empty list returned by the service', () => {
      studentService.getStudents.mockReturnValue(of([]));

      component.loadStudents();

      expect(component.students).toEqual([]);
      expect(component.loading).toBe(false);
    });
  });

  describe('deleteStudent()', () => {
    let confirmSpy: jest.SpyInstance;

    beforeEach(() => {
      fixture.detectChanges();

      confirmSpy = jest.spyOn(window, 'confirm');
    });

    afterEach(() => {
      confirmSpy.mockRestore();
    });

    it('should not delete a student without an ID', () => {
      const studentWithoutId = {
        ...mockStudents[0],
        id: undefined
      };

      component.deleteStudent(studentWithoutId);

      expect(confirmSpy).not.toHaveBeenCalled();
      expect(studentService.deleteStudent).not.toHaveBeenCalled();
    });

    it('should ask for confirmation before deleting a student', () => {
      confirmSpy.mockReturnValue(false);

      component.deleteStudent(mockStudents[0]);

      expect(confirmSpy).toHaveBeenCalledWith(
        'Are you sure you want to delete John Doe?'
      );
    });

    it('should not delete a student when deletion is cancelled', () => {
      confirmSpy.mockReturnValue(false);

      component.deleteStudent(mockStudents[0]);

      expect(studentService.deleteStudent).not.toHaveBeenCalled();
      expect(component.students).toEqual(mockStudents);
    });

    it('should call the service with the student ID when deletion is confirmed', () => {
      confirmSpy.mockReturnValue(true);

      component.deleteStudent(mockStudents[0]);

      expect(studentService.deleteStudent).toHaveBeenCalledWith(12);
    });

    it('should remove the deleted student from the list', () => {
      confirmSpy.mockReturnValue(true);

      component.deleteStudent(mockStudents[0]);

      expect(component.students).toEqual([mockStudents[1]]);
    });

    it('should keep the other students in the list after deletion', () => {
      confirmSpy.mockReturnValue(true);

      component.deleteStudent(mockStudents[1]);

      expect(component.students).toEqual([mockStudents[0]]);
    });

    it('should display a success notification after deletion', () => {
      confirmSpy.mockReturnValue(true);

      component.deleteStudent(mockStudents[0]);

      expect(snackBar.open).toHaveBeenCalledWith(
        'Student deleted successfully.',
        'Close',
        { duration: 3000 }
      );
    });
  });
});