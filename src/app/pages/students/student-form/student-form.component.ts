import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MaterialModule } from '../../../shared/material.module';
import { StudentService } from '../../../core/service/student.service';
import { MembershipType, AccountStatus, Student } from '../../../core/models/student';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MaterialModule
  ],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly studentService = inject(StudentService);

  studentId?: number;

  loading = false;
  saving = false;
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    cardNumber: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [
      Validators.required,
      Validators.pattern(/^\+?[0-9][0-9\s().-]{5,18}[0-9]$|^\+?[0-9]{6,15}$/)
    ]],
    homeAddress: ['', Validators.required],
    membershipType: this.fb.nonNullable.control<MembershipType>('Standard', Validators.required),
    studentCardNumber: ['', Validators.required],
    studentCardExpiryDate: ['', Validators.required],
    membershipExpiryDate: ['', Validators.required],
    accountStatus: this.fb.nonNullable.control<AccountStatus>('ACTIVE', Validators.required)
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    // No ID means create mode.
    if (idParam === null) {
      return;
    }

    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage = 'Invalid student ID.';
      return;
    }

    this.studentId = id;
    this.loading = true;

    this.studentService.getStudentById(id).subscribe({
      next: student => {
        this.form.patchValue({
          cardNumber: student.cardNumber,
          firstName: student.firstName,
          lastName: student.lastName,
          dateOfBirth: student.dateOfBirth,
          email: student.email,
          phoneNumber: student.phoneNumber,
          homeAddress: student.homeAddress,
          membershipType: student.membershipType,
          studentCardNumber: student.studentCardNumber,
          studentCardExpiryDate: student.studentCardExpiryDate,
          membershipExpiryDate: student.membershipExpiryDate,
          accountStatus: student.accountStatus
        });

        this.loading = false;
      },
      error: error => {
        console.error('Error loading student:', error);

        this.errorMessage =
          'Unable to load the student. Please try again.';

        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.loading || this.saving) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const student: Student = this.form.getRawValue();

    const request$ = this.studentId !== undefined
      ? this.studentService.updateStudent(this.studentId, student)
      : this.studentService.createStudent(student);

    request$.subscribe({
      next: savedStudent => {
        this.saving = false;

        if (savedStudent.id !== undefined) {
          this.router.navigate(['/students', savedStudent.id]);
        } else {
          this.router.navigate(['/students']);
        }
      },
      error: error => {
        console.error('Error saving student:', error);

        if (error.status === 409) {
          this.errorMessage =
            'A student with this card number already exists.';
        } else if (error.status === 400) {
          this.errorMessage =
            'The submitted information is invalid.';
        } else {
          this.errorMessage =
            'Unable to save the student. Please try again.';
        }

        this.saving = false;
      }
    });
  }
}