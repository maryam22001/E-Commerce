import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="text-center mb-4">
          <h1 class="auth-title">Welcome Back</h1>
          <p class="auth-subtitle">Sign in to your account to continue</p>
        </div>

        @if (errorMessage()) {
          <div class="alert alert-danger mb-4" role="alert">
            {{ errorMessage() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
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
              placeholder="Enter your password"
              [disabled]="isLoading()"
            />
          </div>

          <div class="d-flex justify-content-between align-items-center mb-4">
            <a routerLink="/forgot-password" class="text-decoration-none small">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            class="btn btn-accent w-100 py-2"
            [disabled]="loginForm.invalid || isLoading()"
          >
            @if (isLoading()) {
              <span class="spinner-border spinner-border-sm me-2" role="status"></span>
              Signing in...
            } @else {
              Sign In
            }
          </button>
        </form>

        <div class="text-center mt-4">
          <p class="text-muted mb-0">
            Don&apos;t have an account?
            <a routerLink="/register" class="fw-semibold">Create one</a>
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
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  isLoading = signal(false);
  errorMessage = signal('');

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Login failed. Please try again.');
      }
    });
  }
}
