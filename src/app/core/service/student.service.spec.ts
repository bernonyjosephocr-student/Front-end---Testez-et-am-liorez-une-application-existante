import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { StudentService } from './student.service';
import { Student } from '../models/student';

describe('StudentService', () => {
  let service: StudentService;
  let httpTestingController: HttpTestingController;

  const student: Student = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe'
  } as Student;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(StudentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all students', () => {
    const students = [student];

    service.getStudents().subscribe(result => {
      expect(result).toEqual(students);
    });

    const request = httpTestingController.expectOne('/api/students');

    expect(request.request.method).toBe('GET');

    request.flush(students);
  });

  it('should retrieve a student by id', () => {
    service.getStudentById(1).subscribe(result => {
      expect(result).toEqual(student);
    });

    const request = httpTestingController.expectOne('/api/students/1');

    expect(request.request.method).toBe('GET');

    request.flush(student);
  });

  it('should create a student', () => {
    service.createStudent(student).subscribe(result => {
      expect(result).toEqual(student);
    });

    const request = httpTestingController.expectOne('/api/students');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(student);

    request.flush(student);
  });

  it('should update a student', () => {
    service.updateStudent(1, student).subscribe(result => {
      expect(result).toEqual(student);
    });

    const request = httpTestingController.expectOne('/api/students/1');

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(student);

    request.flush(student);
  });

  it('should delete a student', () => {
    service.deleteStudent(1).subscribe(result => {
      expect(result).toBeNull();
    });

    const request = httpTestingController.expectOne('/api/students/1');

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });
});