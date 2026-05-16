import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { IProduct } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="mb-4">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/admin">Dashboard</a></li>
          <li class="breadcrumb-item"><a routerLink="/admin/products">Products</a></li>
          <li class="breadcrumb-item active">{{ isEditMode() ? 'Edit' : 'Add' }} Product</li>
        </ol>
      </nav>
      <h1 class="h3 fw-bold">{{ isEditMode() ? 'Edit Product' : 'Add New Product' }}</h1>
    </div>

    @if (isLoading()) {
      <div class="text-center py-5">
        <div class="spinner"></div>
        <p class="text-muted mt-3">Loading...</p>
      </div>
    } @else {
      <div class="row">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              @if (errorMessage()) {
                <div class="alert alert-danger mb-4">{{ errorMessage() }}</div>
              }

              @if (successMessage()) {
                <div class="alert alert-success mb-4">{{ successMessage() }}</div>
              }

              <form (ngSubmit)="onSubmit()" #productForm="ngForm">
                <div class="mb-4">
                  <label for="name" class="form-label">Product Name *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    name="name"
                    [(ngModel)]="product.name"
                    required
                    minlength="3"
                    maxlength="100"
                    placeholder="Enter product name"
                    [disabled]="isSaving()"
                  />
                </div>

                <div class="mb-4">
                  <label for="discription" class="form-label">Description *</label>
                  <textarea
                    class="form-control"
                    id="discription"
                    name="discription"
                    [(ngModel)]="product.discription"
                    required
                    minlength="3"
                    rows="4"
                    placeholder="Enter product description"
                    [disabled]="isSaving()"
                  ></textarea>
                </div>

                <div class="row mb-4">
                  <div class="col-md-6">
                    <label for="price" class="form-label">Price *</label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input
                        type="number"
                        class="form-control"
                        id="price"
                        name="price"
                        [(ngModel)]="product.price"
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        [disabled]="isSaving()"
                      />
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label for="category" class="form-label">Category *</label>
                    <select
                      class="form-select"
                      id="category"
                      name="category"
                      [(ngModel)]="product.category"
                      required
                      [disabled]="isSaving()"
                    >
                      <option value="">Select a category</option>
                      @for (cat of categories; track cat) {
                        <option [value]="cat">{{ cat | titlecase }}</option>
                      }
                    </select>
                  </div>
                </div>

                <div class="mb-4">
                  <label for="image" class="form-label">Image URL *</label>
                  <input
                    type="url"
                    class="form-control"
                    id="image"
                    name="image"
                    [(ngModel)]="product.image"
                    required
                    placeholder="https://example.com/image.jpg"
                    [disabled]="isSaving()"
                  />
                  @if (product.image) {
                    <div class="mt-3">
                      <img 
                        [src]="product.image" 
                        alt="Preview" 
                        class="rounded border"
                        style="max-width: 200px; max-height: 200px; object-fit: cover;"
                      />
                    </div>
                  }
                </div>

                <div class="d-flex gap-3">
                  <button
                    type="submit"
                    class="btn btn-accent"
                    [disabled]="productForm.invalid || isSaving()"
                  >
                    @if (isSaving()) {
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="me-2" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                      </svg>
                      {{ isEditMode() ? 'Update Product' : 'Create Product' }}
                    }
                  </button>
                  <a routerLink="/admin/products" class="btn btn-outline-secondary">
                    Cancel
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h6 class="fw-bold mb-3">Tips</h6>
              <ul class="list-unstyled text-muted small mb-0">
                <li class="mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="me-2 text-success" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                  Product name should be 3-100 characters
                </li>
                <li class="mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="me-2 text-success" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                  Provide a detailed description
                </li>
                <li class="mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="me-2 text-success" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                  Use high-quality product images
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="me-2 text-success" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                  Set competitive pricing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminProductFormComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  product: Partial<IProduct> = {
    name: '',
    discription: '',
    price: 0,
    category: '' as any,
    image: ''
  };

  categories = ['electronics', 'clothing', 'books', 'home', 'beauty', 'sports', 'toys'];
  
  isEditMode = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  productId = '';

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    if (this.productId) {
      this.isEditMode.set(true);
      this.loadProduct();
    }
  }

  loadProduct(): void {
    this.isLoading.set(true);

    this.productService.getOne(this.productId).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success && response.data) {
          this.product = { ...response.data };
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load product');
      }
    });
  }

  onSubmit(): void {
    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const productData = {
      name: this.product.name,
      discription: this.product.discription,
      price: this.product.price,
      category: this.product.category,
      image: this.product.image
    };

    if (this.isEditMode()) {
      this.productService.update(this.productId, productData).subscribe({
        next: (response) => {
          this.isSaving.set(false);
          if (response.success) {
            this.successMessage.set('Product updated successfully!');
            setTimeout(() => this.router.navigate(['/admin/products']), 1500);
          }
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(err.message || 'Failed to update product');
        }
      });
    } else {
      this.productService.create(productData).subscribe({
        next: (response) => {
          this.isSaving.set(false);
          if (response.success) {
            this.successMessage.set('Product created successfully!');
            setTimeout(() => this.router.navigate(['/admin/products']), 1500);
          }
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(err.message || 'Failed to create product');
        }
      });
    }
  }
}
