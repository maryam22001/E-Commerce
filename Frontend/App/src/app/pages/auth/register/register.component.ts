import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="text-center mb-4">
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Join us and start shopping today</p>
        </div>

        @if (errorMessage()) {
          <div class="alert alert-danger mb-4" role="alert">
            {{ errorMessage() }}
          </div>
        }

        @if (successMessage()) {
          <div class="alert alert-success mb-4" role="alert">
            {{ successMessage() }}
          </div>
        }

        @if (!showOtpForm()) {
          <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <div class="mb-3">
              <label for="name" class="form-label">Full Name</label>
              <input
                type="text"
                class="form-control"
                id="name"
                name="name"
                [(ngModel)]="name"
                required
                minlength="2"
                placeholder="Enter your full name"
                [disabled]="isLoading()"
              />
            </div>

            <div class="mb-3">
              <label for="email" class="form-label">Email Address</label>
              <input
                type="email"
                class="form-control"
                id="email"
                name="email"
                [(ngModel)]="email"
                required
                email
                placeholder="Enter your email"
                [disabled]="isLoading()"
              />
            </div>

            <div class="mb-4">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                name="password"
                [(ngModel)]="password"
                required
                minlength="6"
                placeholder="Create a password (min 6 characters)"
                [disabled]="isLoading()"
              />
            </div>

            <button
              type="submit"
              class="btn btn-accent w-100 py-2"
              [disabled]="registerForm.invalid || isLoading()"
            >
              @if (isLoading()) {
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Creating account...
              } @else {
                Create Account
              }
            </button>
          </form>
        } @else {
          <form (ngSubmit)="onVerifyOtp()" #otpForm="ngForm">
            <div class="mb-4">
              <label for="otp" class="form-label">Verification Code</label>
              <input
                type="text"
                class="form-control text-center"
                id="otp"
                name="otp"
                [(ngModel)]="otp"
                required
                minlength="6"
                maxlength="6"
                placeholder="Enter 6-digit code"
                [disabled]="isLoading()"
                style="font-size: 1.5rem; letter-spacing: 0.5rem;"
              />
              <div class="form-text text-center mt-2">
                Check your email for the verification code
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-accent w-100 py-2"
              [disabled]="otpForm.invalid || isLoading()"
            >
              @if (isLoading()) {
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Verifying...
              } @else {
                Verify & Continue
              }
            </button>

            <button
              type="button"
              class="btn btn-link w-100 mt-2"
              (click)="showOtpForm.set(false)"
            >
              Back to registration
            </button>
          </form>
        }

        <div class="text-center mt-4">
          <p class="text-muted mb-0">
            Already have an account?
            <a routerLink="/login" class="fw-semibold">Sign in</a>
          </p>
        </div>

        <div class="text-center mt-3">
          <a routerLink="/" class="text-muted small">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left me-1" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
            Back to store
          </a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  otp = '';
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  showOtpForm = signal(false);

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.signup({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.successMessage.set(response.message || 'Account created! Please check your email for the verification code.');
          this.showOtpForm.set(true);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Registration failed. Please try again.');
      }
    });
  }

  onVerifyOtp(): void {
    if (!this.otp) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.verifyOtp({ email: this.email, otp: this.otp }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Verification failed. Please try again.');
      }
    });
  }
}
