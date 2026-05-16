import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="text-center mb-4">
          <h1 class="auth-title">Reset Password</h1>
          <p class="auth-subtitle">Enter your new password below</p>
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

        @if (!resetSuccess()) {
          <form (ngSubmit)="onSubmit()" #resetForm="ngForm">
            <div class="mb-3">
              <label for="password" class="form-label">New Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                name="password"
                [(ngModel)]="password"
                required
                minlength="6"
                placeholder="Enter new password (min 6 characters)"
                [disabled]="isLoading()"
              />
            </div>

            <div class="mb-4">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input
                type="password"
                class="form-control"
                id="confirmPassword"
                name="confirmPassword"
                [(ngModel)]="confirmPassword"
                required
                minlength="6"
                placeholder="Confirm your new password"
                [disabled]="isLoading()"
              />
              @if (password && confirmPassword && password !== confirmPassword) {
                <div class="text-danger small mt-1">Passwords do not match</div>
              }
            </div>

            <button
              type="submit"
              class="btn btn-accent w-100 py-2"
              [disabled]="resetForm.invalid || password !== confirmPassword || isLoading()"
            >
              @if (isLoading()) {
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Resetting...
              } @else {
                Reset Password
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
            <p class="text-muted mb-4">
              Your password has been reset successfully!
            </p>
            <a routerLink="/login" class="btn btn-accent">
              Sign In Now
            </a>
          </div>
        }

        @if (!resetSuccess()) {
          <div class="text-center mt-4">
            <a routerLink="/login" class="text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left me-1" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
              </svg>
              Back to login
            </a>
          </div>
        }
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  token = '';
  password = '';
  confirmPassword = '';
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  resetSuccess = signal(false);

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'] || '';
    if (!this.token) {
      this.errorMessage.set('Invalid reset link. Please request a new one.');
    }
  }

  onSubmit(): void {
    if (!this.password || this.password !== this.confirmPassword || !this.token) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.resetPassword(this.token, { password: this.password }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.resetSuccess.set(true);
          this.successMessage.set(response.message || 'Password reset successful!');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Failed to reset password. The link may have expired.');
      }
    });
  }
}
