import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html'
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  loading = false;
  error = '';
  success = '';

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.authService.forgotPassword(this.form.value.email!).subscribe({
      next: () => {
        this.success = 'Password reset link sent! Check your email inbox.';
        this.loading = false;
      },
      error: err => {
        this.error = err.error?.message || 'Failed to send reset email.';
        this.loading = false;
      }
    });
  }
}
