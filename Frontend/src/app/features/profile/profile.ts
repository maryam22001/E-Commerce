import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html'
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  currentUser: User | null = null;
  orders: any[] = [];
  activeTab: 'profile' | 'orders' = 'profile';
  loading = false;
  success = '';
  error = '';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: [{ value: '', disabled: true }]
  });

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    if (this.currentUser) {
      this.form.patchValue({ name: this.currentUser.name, email: this.currentUser.email });
    }
    this.orders = JSON.parse(localStorage.getItem('orders') || '[]').reverse();
  }

  saveProfile(): void {
    if (this.form.invalid || !this.currentUser) return;
    this.loading = true;
    this.userService.update(this.currentUser._id, { name: this.form.value.name! }).subscribe({
      next: res => {
        this.success = 'Profile updated successfully!';
        this.loading = false;
        // Update local user
        const updated = { ...this.currentUser!, name: this.form.value.name! };
        localStorage.setItem('user', JSON.stringify(updated));
        setTimeout(() => this.success = '', 3000);
      },
      error: err => {
        this.error = err.error?.message || 'Update failed.';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
