import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
      <div class="auth-card">
        <div class="text-center mb-4">
          <div class="mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="text-primary" viewBox="0 0 16 16">
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
            </svg>
          </div>
          <h1 class="auth-title">Admin Portal</h1>
          <p class="auth-subtitle">Sign in with admin credentials</p>
        </div>

        @if (errorMessage()) {
          <div class="alert alert-danger mb-4" role="alert">
            {{ errorMessage() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="mb-3">
            <label for="email" class="form-label">Admin Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              placeholder="Enter admin email"
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
              placeholder="Enter password"
              [disabled]="isLoading()"
            />
          </div>

          <button
            type="submit"
            class="btn btn-dark w-100 py-2"
            [disabled]="loginForm.invalid || isLoading()"
          >
            @if (isLoading()) {
              <span class="spinner-border spinner-border-sm me-2" role="status"></span>
              Authenticating...
            } @else {
              Access Dashboard
            }
          </button>
        </form>

        <div class="text-center mt-4">
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
export class AdminLoginComponent {
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
        if (response.success && response.data?.role === 'admin') {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
          this.router.navigateByUrl(returnUrl);
        } else {
          this.authService.logoutLocal();
          this.errorMessage.set('Access denied. Admin credentials required.');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Login failed. Please try again.');
      }
    });
  }
}
