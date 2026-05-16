import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <div class="mb-4">
      <h1 class="h3 fw-bold">Dashboard</h1>
      <p class="text-muted">Welcome to your admin dashboard</p>
    </div>

    <!-- Stats Cards -->
    <div class="row g-4 mb-5">
      <div class="col-md-6 col-lg-3">
        <div class="stats-card">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <div class="stats-value">{{ productCount() }}</div>
              <div class="stats-label">Total Products</div>
            </div>
            <div class="p-2 rounded" style="background: rgba(233, 69, 96, 0.1);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" style="color: var(--color-accent);" viewBox="0 0 16 16">
                <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="stats-card">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <div class="stats-value">{{ userCount() }}</div>
              <div class="stats-label">Total Users</div>
            </div>
            <div class="p-2 rounded" style="background: rgba(16, 185, 129, 0.1);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" style="color: var(--color-success);" viewBox="0 0 16 16">
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="stats-card">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <div class="stats-value">{{ categoryCount() }}</div>
              <div class="stats-label">Categories</div>
            </div>
            <div class="p-2 rounded" style="background: rgba(245, 158, 11, 0.1);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" style="color: var(--color-warning);" viewBox="0 0 16 16">
                <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="stats-card">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <div class="stats-value">{{ avgPrice() | currency }}</div>
              <div class="stats-label">Avg. Product Price</div>
            </div>
            <div class="p-2 rounded" style="background: rgba(59, 130, 246, 0.1);">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" style="color: #3b82f6;" viewBox="0 0 16 16">
                <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="row g-4 mb-5">
      <div class="col-md-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h5 class="fw-bold mb-4">Quick Actions</h5>
            <div class="d-flex flex-column gap-2">
              <a routerLink="/admin/products/new" class="btn btn-accent">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="me-2" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>
                Add New Product
              </a>
              <a routerLink="/admin/products" class="btn btn-outline-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="me-2" viewBox="0 0 16 16">
                  <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
                </svg>
                Manage Products
              </a>
              <a routerLink="/admin/users" class="btn btn-outline-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="me-2" viewBox="0 0 16 16">
                  <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                </svg>
                Manage Users
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <h5 class="fw-bold mb-4">Category Statistics</h5>
            @if (categoryStats().length === 0) {
              <p class="text-muted">Loading statistics...</p>
            } @else {
              <div class="d-flex flex-column gap-3">
                @for (stat of categoryStats(); track stat._id) {
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="text-capitalize">{{ stat._id }}</span>
                    <div class="text-end">
                      <span class="badge bg-dark me-2">{{ stat.count }} products</span>
                      <span class="text-muted small">avg {{ stat.avgPrice | currency }}</span>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private userService = inject(UserService);

  productCount = signal(0);
  userCount = signal(0);
  categoryCount = signal(7); // Fixed categories in the backend
  avgPrice = signal(0);
  categoryStats = signal<any[]>([]);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.productService.getAll({ limit: 1000 }).subscribe({
      next: (response) => {
        if (response.success) {
          this.productCount.set(response.count);
          if (response.data.length > 0) {
            const avg = response.data.reduce((sum, p) => sum + p.price, 0) / response.data.length;
            this.avgPrice.set(Math.round(avg * 100) / 100);
          }
        }
      }
    });

    this.productService.getStatus().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categoryStats.set(response.data);
        }
      }
    });

    this.userService.getAll().subscribe({
      next: (response) => {
        if (response.success) {
          this.userCount.set(response.count || response.data?.length || 0);
        }
      }
    });
  }
}
