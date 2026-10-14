import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/models/student';
import { MaterialModule } from '../../../shared/material.module';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [ 
    CommonModule,
    RouterLink,
    MaterialModule],
  templateUrl: './students-list.component.html',
  styleUrl: './students-list.component.css'
})

export class StudentListComponent implements OnInit {

  private readonly studentService = inject(StudentService);
  private readonly snackBar = inject(MatSnackBar);

  students: Student[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  displayedColumns: string[] = [
    'cardNumber',
    'firstName',
    'lastName',
    'email',
    'membershipType',
    'accountStatus',
    'actions'
  ];

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.errorMessage = '';

    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.students = students;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.errorMessage =
          'Unable to load students. Please check your connection and authentication.';
        this.loading = false;
      }
    });
  }
  deleteStudent(student: Student): void {
    if (student.id === undefined) {
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete ${student.firstName} ${student.lastName}?`
    );

    if (!confirmed) {
      return;
    }

    this.studentService.deleteStudent(student.id).subscribe({
      next: () => {
        this.students = this.students.filter(
          item => item.id !== student.id
        );

        this.snackBar.open(
          'Student deleted successfully.',
          'Close',
          { duration: 3000 }
        );
      },
      error: error => {
        console.error('Error deleting student:', error);

        this.snackBar.open(
          'Unable to delete the student.',
          'Close',
          { duration: 4000 }
        );
      }
  });
}  
}