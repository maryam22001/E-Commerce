import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html'
})
export class ResetPassword implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;
  error = '';
  success = '';
  token = '';
  showPassword = false;

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    this.authService.resetPassword(this.token, this.form.value.password!).subscribe({
      next: () => {
        this.success = 'Password reset successfully!';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: err => {
        this.error = err.error?.message || 'Reset failed. The link may be expired.';
        this.loading = false;
      }
    });
  }
}
