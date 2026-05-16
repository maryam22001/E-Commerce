import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, ProductQueryParams } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { IProduct } from '../../interfaces/product.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe],
  template: `
    <div class="container py-5">
      <div class="row">
        <!-- Sidebar Filters -->
        <div class="col-lg-3 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="fw-bold mb-4">Filters</h5>
              
              <!-- Categories -->
              <div class="mb-4">
                <h6 class="fw-semibold mb-3">Category</h6>
                <div class="d-flex flex-column gap-2">
                  <button 
                    class="btn btn-sm text-start"
                    [class.btn-dark]="!selectedCategory()"
                    [class.btn-outline-secondary]="selectedCategory()"
                    (click)="filterByCategory('')"
                  >
                    All Categories
                  </button>
                  @for (cat of categories; track cat.value) {
                    <button 
                      class="btn btn-sm text-start text-capitalize"
                      [class.btn-dark]="selectedCategory() === cat.value"
                      [class.btn-outline-secondary]="selectedCategory() !== cat.value"
                      (click)="filterByCategory(cat.value)"
                    >
                      {{ cat.name }}
                    </button>
                  }
                </div>
              </div>

              <!-- Price Range -->
              <div class="mb-4">
                <h6 class="fw-semibold mb-3">Price Range</h6>
                <div class="row g-2">
                  <div class="col-6">
                    <input 
                      type="number" 
                      class="form-control form-control-sm" 
                      placeholder="Min"
                      [(ngModel)]="minPrice"
                      (change)="applyFilters()"
                    />
                  </div>
                  <div class="col-6">
                    <input 
                      type="number" 
                      class="form-control form-control-sm" 
                      placeholder="Max"
                      [(ngModel)]="maxPrice"
                      (change)="applyFilters()"
                    />
                  </div>
                </div>
              </div>

              <!-- Sort -->
              <div class="mb-4">
                <h6 class="fw-semibold mb-3">Sort By</h6>
                <select class="form-select form-select-sm" [(ngModel)]="sortBy" (change)="applyFilters()">
                  <option value="">Default</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                  <option value="-name">Name: Z-A</option>
                </select>
              </div>

              <button class="btn btn-outline-secondary w-100 btn-sm" (click)="clearFilters()">
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="col-lg-9">
          <!-- Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 class="h3 fw-bold mb-1">
                @if (selectedCategory()) {
                  <span class="text-capitalize">{{ selectedCategory() }}</span>
                } @else {
                  All Products
                }
              </h1>
              <p class="text-muted mb-0">{{ totalCount() }} products found</p>
            </div>
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
            <div class="row g-4">
              @for (product of products(); track product._id || product.id) {
                <div class="col-6 col-md-4">
                  <div class="card h-100 product-card border-0">
                    <a [routerLink]="['/products', product._id || product.id]" class="text-decoration-none">
                      <div class="position-relative overflow-hidden product-image-container">
                        <span class="badge bg-dark position-absolute top-0 end-0 m-2 z-1 text-capitalize">
                          {{ product.category }}
                        </span>
                        <img 
                          [src]="product.image" 
                          class="card-img-top product-image" 
                          [alt]="product.name"
                          loading="lazy"
                        />
                      </div>
                    </a>
                    <div class="card-body d-flex flex-column p-3">
                      <a [routerLink]="['/products', product._id || product.id]" class="text-decoration-none text-dark">
                        <h5 class="card-title fw-semibold text-truncate mb-2" [title]="product.name">
                          {{ product.name }}
                        </h5>
                      </a>
                      <p class="card-text text-muted small mb-3 description-clamp">
                        {{ product.discription || product.description }}
                      </p>
                      <div class="mt-auto">
                        <div class="d-flex align-items-center justify-content-between mb-3">
                          <span class="fw-bold fs-5" style="color: var(--color-accent);">
                            {{ product.price | currency }}
                          </span>
                        </div>
                        <button 
                          class="btn btn-dark w-100 add-to-cart-btn"
                          (click)="addToCart(product, $event)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16">
                            <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z"/>
                            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                          </svg>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              } @empty {
                <div class="col-12 text-center py-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="text-muted mb-3" viewBox="0 0 16 16">
                    <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M8 7.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
                  </svg>
                  <p class="text-muted">No products found matching your criteria.</p>
                  <button class="btn btn-outline-primary" (click)="clearFilters()">Clear Filters</button>
                </div>
              }
            </div>

            <!-- Pagination -->
            @if (totalPages() > 1) {
              <nav class="mt-5">
                <ul class="pagination justify-content-center">
                  <li class="page-item" [class.disabled]="currentPage() === 1">
                    <button class="page-link" (click)="goToPage(currentPage() - 1)">Previous</button>
                  </li>
                  @for (page of paginationArray(); track page) {
                    <li class="page-item" [class.active]="page === currentPage()">
                      <button class="page-link" (click)="goToPage(page)">{{ page }}</button>
                    </li>
                  }
                  <li class="page-item" [class.disabled]="currentPage() === totalPages()">
                    <button class="page-link" (click)="goToPage(currentPage() + 1)">Next</button>
                  </li>
                </ul>
              </nav>
            }
          }
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    @if (showToast()) {
      <div class="toast-container">
        <div class="toast show bg-success text-white">
          <div class="toast-body d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="me-2" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            {{ toastMessage() }}
          </div>
        </div>
      </div>
    }
  `
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products = signal<IProduct[]>([]);
  isLoading = signal(true);
  error = signal('');
  showToast = signal(false);
  toastMessage = signal('');
  
  selectedCategory = signal('');
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy = '';
  
  currentPage = signal(1);
  totalPages = signal(1);
  totalCount = signal(0);
  limit = 12;

  categories = [
    { name: 'Electronics', value: 'electronics' },
    { name: 'Clothing', value: 'clothing' },
    { name: 'Sports', value: 'sports' },
    { name: 'Books', value: 'books' },
    { name: 'Home', value: 'home' },
    { name: 'Beauty', value: 'beauty' },
    { name: 'Toys', value: 'toys' }
  ];

  paginationArray = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
      pages.push(i);
    }
    
    return pages;
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
      if (params['search']) {
        // Handle search
      }
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.error.set('');

    const params: ProductQueryParams = {
      page: this.currentPage(),
      limit: this.limit
    };

    if (this.selectedCategory()) {
      params.category = this.selectedCategory();
    }
    if (this.minPrice) {
      params.minPrice = this.minPrice;
    }
    if (this.maxPrice) {
      params.maxPrice = this.maxPrice;
    }
    if (this.sortBy) {
      params.sort = this.sortBy;
    }

    this.productService.getAll(params).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.products.set(response.data);
          this.totalCount.set(response.count);
          this.totalPages.set(response.page || Math.ceil(response.count / this.limit));
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set('Failed to load products. Please try again.');
      }
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
    this.applyFilters();
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  clearFilters(): void {
    this.selectedCategory.set('');
    this.minPrice = null;
    this.maxPrice = null;
    this.sortBy = '';
    this.currentPage.set(1);
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadProducts();
    }
  }

  addToCart(product: IProduct, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addToCart(product);
    this.showNotification(`${product.name} added to cart!`);
  }

  private showNotification(message: string): void {
    this.toastMessage.set(message);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }
}
