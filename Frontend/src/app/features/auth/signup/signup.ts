import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html'
})
export class Signup {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]]
  });

  loading = false;
  error = '';
  success = '';
  showPassword = false;
  registeredEmail = '';

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.registeredEmail = this.form.value.email!;
    this.authService.signup(this.form.value as { name: string; email: string; password: string }).subscribe({
      next: () => {
        this.success = 'Account created! Check your email for the OTP verification code.';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/auth/verify-otp'], { queryParams: { email: this.registeredEmail } }), 2000);
      },
      error: err => {
        this.error = err.error?.message || 'Signup failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
