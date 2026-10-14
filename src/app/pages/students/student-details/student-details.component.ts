import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MaterialModule } from '../../../shared/material.module';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/models/student';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MaterialModule
  ],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly studentService = inject(StudentService);

  student?: Student;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage = 'Invalid student ID.';
      this.loading = false;
      return;
    }

    this.studentService.getStudentById(id).subscribe({
      next: student => {
        this.student = student;
        this.loading = false;
      },
      error: error => {
        console.error('Error loading student:', error);
        this.errorMessage = 'Unable to load student details.';
        this.loading = false;
      }
    });
  }
}