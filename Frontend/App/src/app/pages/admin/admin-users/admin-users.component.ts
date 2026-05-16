import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    &lt;div class="admin-users"&gt;
      &lt;div class="page-header"&gt;
        &lt;h1&gt;User Management&lt;/h1&gt;
        &lt;div class="search-box"&gt;
          &lt;svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"&gt;
            &lt;circle cx="11" cy="11" r="8"/&gt;&lt;path d="m21 21-4.3-4.3"/&gt;
          &lt;/svg&gt;
          &lt;input type="text" placeholder="Search users..." [(ngModel)]="searchTerm" (input)="filterUsers()"&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div class="users-table-container"&gt;
        &lt;table class="users-table"&gt;
          &lt;thead&gt;
            &lt;tr&gt;
              &lt;th&gt;Name&lt;/th&gt;
              &lt;th&gt;Email&lt;/th&gt;
              &lt;th&gt;Role&lt;/th&gt;
              &lt;th&gt;Status&lt;/th&gt;
              &lt;th&gt;Joined&lt;/th&gt;
              &lt;th&gt;Actions&lt;/th&gt;
            &lt;/tr&gt;
          &lt;/thead&gt;
          &lt;tbody&gt;
            @for (user of filteredUsers; track user._id) {
              &lt;tr&gt;
                &lt;td&gt;
                  &lt;div class="user-info"&gt;
                    &lt;div class="avatar"&gt;{{ getInitials(user.firstName, user.lastName) }}&lt;/div&gt;
                    &lt;span&gt;{{ user.firstName }} {{ user.lastName }}&lt;/span&gt;
                  &lt;/div&gt;
                &lt;/td&gt;
                &lt;td&gt;{{ user.email }}&lt;/td&gt;
                &lt;td&gt;
                  &lt;span class="role-badge" [class.admin]="user.role === 'admin'"&gt;
                    {{ user.role }}
                  &lt;/span&gt;
                &lt;/td&gt;
                &lt;td&gt;
                  &lt;span class="status-badge" [class.active]="user.isVerified"&gt;
                    {{ user.isVerified ? 'Verified' : 'Pending' }}
                  &lt;/span&gt;
                &lt;/td&gt;
                &lt;td&gt;{{ user.createdAt | date:'mediumDate' }}&lt;/td&gt;
                &lt;td&gt;
                  &lt;div class="actions"&gt;
                    &lt;button class="btn-icon" (click)="toggleRole(user)" title="Toggle Role"&gt;
                      &lt;svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"&gt;
                        &lt;path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/&gt;
                        &lt;circle cx="9" cy="7" r="4"/&gt;
                        &lt;path d="M22 21v-2a4 4 0 0 0-3-3.87"/&gt;
                        &lt;path d="M16 3.13a4 4 0 0 1 0 7.75"/&gt;
                      &lt;/svg&gt;
                    &lt;/button&gt;
                    &lt;button class="btn-icon delete" (click)="deleteUser(user)" title="Delete User"&gt;
                      &lt;svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"&gt;
                        &lt;path d="M3 6h18"/&gt;&lt;path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/&gt;
                        &lt;path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/&gt;
                      &lt;/svg&gt;
                    &lt;/button&gt;
                  &lt;/div&gt;
                &lt;/td&gt;
              &lt;/tr&gt;
            } @empty {
              &lt;tr&gt;
                &lt;td colspan="6" class="empty-state"&gt;
                  @if (loading) {
                    &lt;p&gt;Loading users...&lt;/p&gt;
                  } @else {
                    &lt;p&gt;No users found&lt;/p&gt;
                  }
                &lt;/td&gt;
              &lt;/tr&gt;
            }
          &lt;/tbody&gt;
        &lt;/table&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  `,
  styles: [`
    .admin-users {
      padding: 1.5rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .page-header h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--foreground);
    }
    .search-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
    }
    .search-box svg {
      color: var(--muted-foreground);
    }
    .search-box input {
      border: none;
      background: none;
      outline: none;
      font-size: 0.875rem;
      color: var(--foreground);
      width: 200px;
    }
    .users-table-container {
      background: var(--card);
      border-radius: 0.75rem;
      border: 1px solid var(--border);
      overflow: hidden;
    }
    .users-table {
      width: 100%;
      border-collapse: collapse;
    }
    .users-table th,
    .users-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    .users-table th {
      background: var(--muted);
      font-weight: 500;
      font-size: 0.875rem;
      color: var(--muted-foreground);
    }
    .users-table td {
      font-size: 0.875rem;
      color: var(--foreground);
    }
    .users-table tbody tr:hover {
      background: var(--muted);
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--primary);
      color: var(--primary-foreground);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .role-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      background: var(--muted);
      color: var(--muted-foreground);
      text-transform: capitalize;
    }
    .role-badge.admin {
      background: var(--primary);
      color: var(--primary-foreground);
    }
    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      background: #fef3c7;
      color: #92400e;
    }
    .status-badge.active {
      background: #d1fae5;
      color: #065f46;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn-icon {
      padding: 0.5rem;
      background: none;
      border: 1px solid var(--border);
      border-radius: 0.375rem;
      cursor: pointer;
      color: var(--muted-foreground);
      transition: all 0.2s;
    }
    .btn-icon:hover {
      background: var(--muted);
      color: var(--foreground);
    }
    .btn-icon.delete:hover {
      background: #fee2e2;
      color: #dc2626;
      border-color: #fecaca;
    }
    .empty-state {
      text-align: center;
      padding: 3rem !important;
      color: var(--muted-foreground);
    }
    @media (max-width: 768px) {
      .users-table-container {
        overflow-x: auto;
      }
      .users-table {
        min-width: 700px;
      }
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);
  
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  loading = true;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.users || [];
        this.filteredUsers = this.users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  toggleRole(user: User) {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    this.userService.updateUserRole(user._id, newRole).subscribe({
      next: () => {
        user.role = newRole;
      }
    });
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      this.userService.deleteUser(user._id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u._id !== user._id);
          this.filterUsers();
        }
      });
    }
  }
}
