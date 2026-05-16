import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { IProduct } from '../../interfaces/product.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="hero-title text-balance">Discover Amazing Products at Unbeatable Prices</h1>
            <p class="hero-subtitle text-pretty">Shop the latest trends in electronics, fashion, sports gear and more. 
               Quality guaranteed with fast delivery to your doorstep.</p>
            <div class="d-flex flex-wrap gap-3">
              <a routerLink="/products" class="btn btn-accent btn-lg px-4">
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="ms-2" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                </svg>
              </a>
              <a routerLink="/products" [queryParams]="{category: 'electronics'}" class="btn btn-outline-light btn-lg px-4">
                View Electronics
              </a>
            </div>
          </div>
          <div class="col-lg-6 d-none d-lg-block text-center">
            <div class="position-relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" fill="currentColor" class="opacity-25" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-5">
      <div class="container">
        <h2 class="h3 fw-bold mb-4">Shop by Category</h2>
        <div class="d-flex flex-wrap gap-2">
          @for (cat of categories; track cat.name) {
            <a 
              [routerLink]="['/products']" 
              [queryParams]="{category: cat.value}"
              class="category-pill text-decoration-none"
            >
              {{ cat.name }}
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-5 bg-white">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="h3 fw-bold mb-0">Featured Products</h2>
          <a routerLink="/products" class="btn btn-link text-decoration-none">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="ms-1" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
            </svg>
          </a>
        </div>

        @if (isLoading()) {
          <div class="text-center py-5">
            <div class="spinner"></div>
            <p class="text-muted mt-3">Loading products...</p>
          </div>
        } @else if (error()) {
          <div class="alert alert-warning">
            {{ error() }}
            <button class="btn btn-sm btn-outline-warning ms-2" (click)="loadProducts()">Retry</button>
          </div>
        } @else {
          <div class="row g-4">
            @for (product of featuredProducts(); track product._id || product.id) {
              <div class="col-6 col-md-4 col-lg-3">
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
                <p class="text-muted">No products available at the moment.</p>
              </div>
            }
          </div>
        }
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4">
            <div class="text-center p-4">
              <div class="mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" style="color: var(--color-accent);" viewBox="0 0 16 16">
                  <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                </svg>
              </div>
              <h5 class="fw-bold">Free Shipping</h5>
              <p class="text-muted mb-0">Free shipping on orders over $50</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="text-center p-4">
              <div class="mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" style="color: var(--color-accent);" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                </svg>
              </div>
              <h5 class="fw-bold">24/7 Support</h5>
              <p class="text-muted mb-0">Get help whenever you need it</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="text-center p-4">
              <div class="mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" style="color: var(--color-accent);" viewBox="0 0 16 16">
                  <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z"/>
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/>
                </svg>
              </div>
              <h5 class="fw-bold">Money Back</h5>
              <p class="text-muted mb-0">30-day money back guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </section>

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
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  featuredProducts = signal<IProduct[]>([]);
  isLoading = signal(true);
  error = signal('');
  showToast = signal(false);
  toastMessage = signal('');

  categories = [
    { name: 'Electronics', value: 'electronics' },
    { name: 'Clothing', value: 'clothing' },
    { name: 'Sports', value: 'sports' },
    { name: 'Books', value: 'books' },
    { name: 'Home', value: 'home' },
    { name: 'Beauty', value: 'beauty' },
    { name: 'Toys', value: 'toys' }
  ];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.error.set('');

    this.productService.getAll({ limit: 8 }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.featuredProducts.set(response.data);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set('Failed to load products. Please try again.');
      }
    });
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
