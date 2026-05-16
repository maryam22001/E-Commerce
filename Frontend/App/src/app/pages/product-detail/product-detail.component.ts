import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { IProduct } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe],
  template: `
    <div class="container py-5">
      @if (isLoading()) {
        <div class="text-center py-5">
          <div class="spinner"></div>
          <p class="text-muted mt-3">Loading product details...</p>
        </div>
      } @else if (error()) {
        <div class="text-center py-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="text-danger mb-3" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
          </svg>
          <h4>{{ error() }}</h4>
          <a routerLink="/products" class="btn btn-outline-primary mt-3">Back to Products</a>
        </div>
      } @else if (product()) {
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-4">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a routerLink="/">Home</a></li>
            <li class="breadcrumb-item"><a routerLink="/products">Products</a></li>
            <li class="breadcrumb-item">
              <a [routerLink]="['/products']" [queryParams]="{category: product()!.category}" class="text-capitalize">
                {{ product()!.category }}
              </a>
            </li>
            <li class="breadcrumb-item active">{{ product()!.name }}</li>
          </ol>
        </nav>

        <div class="row g-5">
          <!-- Product Image -->
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm overflow-hidden">
              <div class="position-relative">
                <span class="badge bg-dark position-absolute top-0 end-0 m-3 text-capitalize fs-6">
                  {{ product()!.category }}
                </span>
                <img 
                  [src]="product()!.image" 
                  [alt]="product()!.name"
                  class="img-fluid w-100"
                  style="aspect-ratio: 1; object-fit: cover;"
                />
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="col-lg-6">
            <h1 class="h2 fw-bold mb-3">{{ product()!.name }}</h1>
            
            <div class="d-flex align-items-center gap-3 mb-4">
              <span class="h2 fw-bold mb-0" style="color: var(--color-accent);">
                {{ product()!.price | currency }}
              </span>
            </div>

            <p class="text-muted mb-4 fs-5">
              {{ product()!.discription || product()!.description }}
            </p>

            <!-- Quantity Selector -->
            <div class="mb-4">
              <label class="form-label fw-semibold">Quantity</label>
              <div class="d-flex align-items-center gap-3">
                <button 
                  class="btn btn-outline-secondary"
                  (click)="decreaseQuantity()"
                  [disabled]="quantity() <= 1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                  </svg>
                </button>
                <span class="fw-bold fs-5" style="min-width: 50px; text-align: center;">
                  {{ quantity() }}
                </span>
                <button 
                  class="btn btn-outline-secondary"
                  (click)="increaseQuantity()"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Add to Cart Button -->
            <div class="d-flex gap-3 mb-4">
              <button 
                class="btn btn-accent btn-lg flex-grow-1"
                (click)="addToCart()"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="me-2" viewBox="0 0 16 16">
                  <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9z"/>
                  <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                </svg>
                Add to Cart
              </button>
            </div>

            @if (isInCart()) {
              <div class="alert alert-success d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="me-2" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                <span>This item is in your cart ({{ cartQuantity() }} added)</span>
                <a routerLink="/cart" class="ms-auto btn btn-sm btn-success">View Cart</a>
              </div>
            }

            <!-- Product Features -->
            <div class="border-top pt-4 mt-4">
              <div class="row g-3">
                <div class="col-6">
                  <div class="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="text-success me-2" viewBox="0 0 16 16">
                      <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                    </svg>
                    <span class="small">Free Shipping</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="text-success me-2" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                    <span class="small">30-Day Returns</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="text-success me-2" viewBox="0 0 16 16">
                      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
                      <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                    </svg>
                    <span class="small">Secure Payment</span>
                  </div>
                </div>
                <div class="col-6">
                  <div class="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="text-success me-2" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                    </svg>
                    <span class="small">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
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
export class ProductDetailComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  product = signal<IProduct | null>(null);
  isLoading = signal(true);
  error = signal('');
  quantity = signal(1);
  showToast = signal(false);
  toastMessage = signal('');

  isInCart = signal(false);
  cartQuantity = signal(0);

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.error.set('Product not found');
      this.isLoading.set(false);
    }
  }

  loadProduct(id: string): void {
    this.isLoading.set(true);
    this.error.set('');

    this.productService.getOne(id).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success && response.data) {
          this.product.set(response.data);
          this.updateCartStatus();
        } else {
          this.error.set('Product not found');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set('Failed to load product. Please try again.');
      }
    });
  }

  updateCartStatus(): void {
    const prod = this.product();
    if (prod) {
      const productId = prod._id || prod.id || '';
      this.isInCart.set(this.cartService.isInCart(productId));
      this.cartQuantity.set(this.cartService.getItemQuantity(productId));
    }
  }

  increaseQuantity(): void {
    this.quantity.update(q => q + 1);
  }

  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart(): void {
    const prod = this.product();
    if (prod) {
      this.cartService.addToCart(prod, this.quantity());
      this.updateCartStatus();
      this.showNotification(`${prod.name} added to cart!`);
    }
  }

  private showNotification(message: string): void {
    this.toastMessage.set(message);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 3000);
  }
}
