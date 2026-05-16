import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="text-center mb-4">
          <h1 class="auth-title">Forgot Password</h1>
          <p class="auth-subtitle">Enter your email to receive a reset link</p>
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

        @if (!emailSent()) {
          <form (ngSubmit)="onSubmit()" #forgotForm="ngForm">
            <div class="mb-4">
              <label for="email" class="form-label">Email Address</label>
              <input
                type="email"
                class="form-control"
                id="email"
                name="email"
                [(ngModel)]="email"
                required
                email
                placeholder="Enter your email address"
                [disabled]="isLoading()"
              />
            </div>

            <button
              type="submit"
              class="btn btn-accent w-100 py-2"
              [disabled]="forgotForm.invalid || isLoading()"
            >
              @if (isLoading()) {
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Sending...
              } @else {
                Send Reset Link
              }
            </button>
          </form>
        } @else {
          <div class="text-center">
            <div class="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="text-success" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
            </div>
            <p class="text-muted">
              We&apos;ve sent a password reset link to <strong>{{ email }}</strong>.
              Please check your email and follow the instructions.
            </p>
          </div>
        }

        <div class="text-center mt-4">
          <a routerLink="/login" class="text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left me-1" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
            Back to login
          </a>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);

  email = '';
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  emailSent = signal(false);

  onSubmit(): void {
    if (!this.email) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.forgotPassword({ email: this.email }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.emailSent.set(true);
          this.successMessage.set(response.message || 'Reset link sent to your email.');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Failed to send reset link. Please try again.');
      }
    });
  }
}
