import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { Spinner } from '../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-user-manager',
  standalone: true,
  imports: [CommonModule, Spinner],
  templateUrl: './user-manager.html'
})
export class UserManager implements OnInit {
  private userService = inject(UserService);
  users: User[] = [];
  loading = true;
  deleting: string | null = null;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: res => { this.users = res.data || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  softDelete(id: string): void {
    if (!confirm('Deactivate this user?')) return;
    this.deleting = id;
    this.userService.softDelete(id).subscribe({
      next: () => { this.load(); this.deleting = null; },
      error: () => { this.deleting = null; }
    });
  }
}
