import { Component, inject, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ICartItem } from '../../interfaces/cart.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <div class="container py-5">
      <h1 class="h2 fw-bold mb-4">Shopping Cart</h1>

      @if (cartItems().length === 0) {
        <div class="text-center py-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="text-muted mb-4" viewBox="0 0 16 16">
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
          </svg>
          <h4 class="text-muted mb-3">Your cart is empty</h4>
          <p class="text-muted mb-4">Looks like you haven&apos;t added any products yet.</p>
          <a routerLink="/products" class="btn btn-accent">
            Start Shopping
          </a>
        </div>
      } @else {
        <div class="row g-4">
          <!-- Cart Items -->
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm">
              <div class="card-body p-0">
                @for (item of cartItems(); track getItemId(item); let idx = $index) {
                  @if (idx > 0) {
                    <hr class="my-0">
                  }
                  <div class="p-4">
                    <div class="row align-items-center g-3">
                      <!-- Product Image -->
                      <div class="col-3 col-md-2">
                        <a [routerLink]="['/products', getItemId(item)]">
                          <img 
                            [src]="item.product.image" 
                            [alt]="item.product.name"
                            class="img-fluid rounded"
                            style="aspect-ratio: 1; object-fit: cover;"
                          />
                        </a>
                      </div>

                      <!-- Product Info -->
                      <div class="col-9 col-md-4">
                        <a [routerLink]="['/products', getItemId(item)]" class="text-decoration-none text-dark">
                          <h6 class="fw-semibold mb-1">{{ item.product.name }}</h6>
                        </a>
                        <span class="badge bg-secondary text-capitalize">{{ item.product.category }}</span>
                      </div>

                      <!-- Quantity Controls -->
                      <div class="col-6 col-md-3">
                        <div class="d-flex align-items-center">
                          <button 
                            class="btn btn-sm btn-outline-secondary"
                            (click)="updateQuantity(getItemId(item), item.quantity - 1)"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                            </svg>
                          </button>
                          <span class="mx-3 fw-semibold">{{ item.quantity }}</span>
                          <button 
                            class="btn btn-sm btn-outline-secondary"
                            (click)="updateQuantity(getItemId(item), item.quantity + 1)"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <!-- Price & Remove -->
                      <div class="col-6 col-md-3 text-end">
                        <div class="fw-bold mb-2" style="color: var(--color-accent);">
                          {{ item.product.price * item.quantity | currency }}
                        </div>
                        <button 
                          class="btn btn-sm btn-link text-danger p-0"
                          (click)="removeItem(getItemId(item))"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Clear Cart -->
            <div class="mt-3 d-flex justify-content-between">
              <a routerLink="/products" class="btn btn-outline-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-2" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                </svg>
                Continue Shopping
              </a>
              <button class="btn btn-outline-danger" (click)="clearCart()">
                Clear Cart
              </button>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="col-lg-4">
            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <h5 class="fw-bold mb-4">Order Summary</h5>
                
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Subtotal ({{ totalItems() }} items)</span>
                  <span>{{ subtotal() | currency }}</span>
                </div>
                
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Shipping</span>
                  <span class="text-success">Free</span>
                </div>
                
                <hr>
                
                <div class="d-flex justify-content-between mb-4">
                  <span class="fw-bold">Total</span>
                  <span class="fw-bold fs-4" style="color: var(--color-accent);">
                    {{ subtotal() | currency }}
                  </span>
                </div>

                <button class="btn btn-accent w-100 btn-lg" (click)="proceedToCheckout()">
                  Proceed to Checkout
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="ms-2" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                  </svg>
                </button>

                <div class="text-center mt-3">
                  <small class="text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="me-1" viewBox="0 0 16 16">
                      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
                    </svg>
                    Secure checkout
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Checkout Modal -->
    @if (showCheckoutModal()) {
      <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h5 class="modal-title fw-bold">Order Placed!</h5>
              <button type="button" class="btn-close" (click)="closeCheckoutModal()"></button>
            </div>
            <div class="modal-body text-center py-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="text-success mb-4" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
              <h4 class="mb-3">Thank you for your order!</h4>
              <p class="text-muted mb-0">
                Your order has been placed successfully. 
                You will receive a confirmation email shortly.
              </p>
            </div>
            <div class="modal-footer border-0 justify-content-center">
              <a routerLink="/products" class="btn btn-accent" (click)="closeCheckoutModal()">
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class CartComponent {
  private cartService = inject(CartService);

  cartItems = this.cartService.items;
  totalItems = this.cartService.totalItems;
  subtotal = this.cartService.totalPrice;

  showCheckoutModal = computed(() => this._showCheckoutModal);
  private _showCheckoutModal = false;

  getItemId(item: ICartItem): string {
    return item.product._id || item.product.id || '';
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  proceedToCheckout(): void {
    // Since there's no order endpoint in the backend, we simulate checkout
    this._showCheckoutModal = true;
    this.cartService.clearCart();
  }

  closeCheckoutModal(): void {
    this._showCheckoutModal = false;
  }
}
