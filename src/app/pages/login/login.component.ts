import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { LoginService } from '../../core/service/login.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterLink,
    MaterialModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly formBuilder= inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  loading = false;
  loginSuccess = false;
  errorMessage= '';

  loginForm = this.formBuilder.nonNullable.group({
    login: ['', Validators.required],
    password: ['', Validators.required]
  });
  
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.loginService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        // Login successful
        this.loading = false;
        this.loginSuccess = true;
        console.log('Login successful');
        // Navigate to dashboard or desired route
        //this.router.navigate(['/somepath']);
      },
      error: (error: HttpErrorResponse) => {
        // Handle login error
        this.loading = false;
        console.error('Login failed:', error);
        this.errorMessage = 
          error.status === 401 || error.status === 403 
            ? 'Invalid login credentials. Please try again.' 
            : 'An error occurred. Please try again.';
      }
    });
  }

}
