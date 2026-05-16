import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { IProduct } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 fw-bold mb-1">Products</h1>
        <p class="text-muted mb-0">Manage your product catalog</p>
      </div>
      <a routerLink="/admin/products/new" class="btn btn-accent">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="me-2" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
        </svg>
        Add Product
      </a>
    </div>

    @if (isLoading()) {
      <div class="text-center py-5">
        <div class="spinner"></div>
        <p class="text-muted mt-3">Loading products...</p>
      </div>
    } @else if (error()) {
      <div class="alert alert-danger">
        {{ error() }}
        <button class="btn btn-sm btn-outline-danger ms-2" (click)="loadProducts()">Retry</button>
      </div>
    } @else {
      <div class="card border-0 shadow-sm">
        <div class="table-responsive">
          <table class="table table-modern mb-0">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (product of products(); track product._id) {
                <tr>
                  <td>
                    <div class="d-flex align-items-center">
                      <img 
                        [src]="product.image" 
                        [alt]="product.name"
                        class="rounded me-3"
                        style="width: 48px; height: 48px; object-fit: cover;"
                      />
                      <div>
                        <div class="fw-semibold">{{ product.name }}</div>
                        <small class="text-muted">ID: {{ product._id }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge bg-secondary text-capitalize">{{ product.category }}</span>
                  </td>
                  <td class="fw-semibold">{{ product.price | currency }}</td>
                  <td>
                    <div class="d-flex gap-2">
                      <a [routerLink]="['/admin/products/edit', product._id]" class="btn btn-sm btn-outline-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                        </svg>
                      </a>
                      <button 
                        class="btn btn-sm btn-outline-danger"
                        (click)="deleteProduct(product)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="text-center py-4 text-muted">
                    No products found. Add your first product!
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }

    <!-- Delete Confirmation Modal -->
    @if (showDeleteModal()) {
      <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">Delete Product</h5>
              <button type="button" class="btn-close" (click)="cancelDelete()"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete <strong>{{ productToDelete()?.name }}</strong>?</p>
              <p class="text-muted small mb-0">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="cancelDelete()">Cancel</button>
              <button type="button" class="btn btn-danger" (click)="confirmDelete()" [disabled]="isDeleting()">
                @if (isDeleting()) {
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Deleting...
                } @else {
                  Delete
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminProductsComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<IProduct[]>([]);
  isLoading = signal(true);
  error = signal('');
  showDeleteModal = signal(false);
  productToDelete = signal<IProduct | null>(null);
  isDeleting = signal(false);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.error.set('');

    this.productService.getAll({ limit: 100 }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.products.set(response.data);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set('Failed to load products');
      }
    });
  }

  deleteProduct(product: IProduct): void {
    this.productToDelete.set(product);
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.productToDelete.set(null);
  }

  confirmDelete(): void {
    const product = this.productToDelete();
    if (!product?._id) return;

    this.isDeleting.set(true);

    this.productService.delete(product._id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.showDeleteModal.set(false);
        this.productToDelete.set(null);
        this.loadProducts();
      },
      error: (err) => {
        this.isDeleting.set(false);
        alert('Failed to delete product: ' + err.message);
      }
    });
  }
}
