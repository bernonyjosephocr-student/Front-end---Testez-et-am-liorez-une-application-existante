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

  loading: boolean = false;
  loginSuccess: boolean = false;
  errorMessage: string = '';
  hidePassword: boolean = true;

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
        this.router.navigate(['/students']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.loginSuccess = false;    

        // 1. In case of JSON object
        if (error.error && typeof error.error === 'object') {
          this.errorMessage =
            error.error.message ??
            error.error.error ??
            `Request failed (${error.status}).`;
        } 
        // 2. In case String JSON or plain text
        else if (typeof error.error === 'string' && error.error.trim()) {
          try {
            const parsedError = JSON.parse(error.error);
            this.errorMessage = parsedError.message ?? parsedError.error ?? error.error;
          } catch (e) {
            // We keep the original error string if it's not valid JSON
            this.errorMessage = error.error;
          }
        } 
        // 3. In case there is no response body or network error
        else {
          this.errorMessage =
            error.status === 0
              ? 'Unable to connect to the server.'
              : `Request failed with HTTP ${error.status}.`;
        }

        console.error('Login error:', this.errorMessage);
      }

    });
  }

}
