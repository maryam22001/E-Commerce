import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../interfaces/iproduct';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="product-card">
      <a [routerLink]="['/product', product._id || product.id]" class="product-image">
        @if (product.image) {
          <img [src]="product.image" [alt]="product.name">
        } @else {
          <div class="no-image">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
          </div>
        }
      </a>
      <div class="product-info">
        @if (product.category) {
          <span class="category">{{ product.category }}</span>
        }
        <a [routerLink]="['/product', product._id || product.id]" class="product-name">{{ product.name }}</a>
        <div class="product-footer">
          <span class="price">{{ product.price | currency }}</span>
          <button 
            class="add-to-cart" 
            (click)="onAddToCart($event)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .product-card:hover {
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      transform: translateY(-4px);
    }
    .product-image {
      display: block;
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
      background: var(--muted);
    }
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .product-card:hover .product-image img {
      transform: scale(1.05);
    }
    .no-image {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--muted-foreground);
    }
    .product-info {
      padding: 1rem;
    }
    .category {
      font-size: 0.75rem;
      color: var(--muted-foreground);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .product-name {
      display: block;
      font-weight: 500;
      color: var(--foreground);
      text-decoration: none;
      margin-top: 0.25rem;
      margin-bottom: 0.75rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .product-name:hover {
      color: var(--primary);
    }
    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .price {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--foreground);
    }
    .add-to-cart {
      padding: 0.5rem;
      background: var(--primary);
      color: var(--primary-foreground);
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .add-to-cart:hover:not(:disabled) {
      opacity: 0.9;
      transform: scale(1.05);
    }
    .add-to-cart:disabled {
      background: var(--muted);
      color: var(--muted-foreground);
      cursor: not-allowed;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: IProduct;
  @Output() addToCart = new EventEmitter<IProduct>();

  onAddToCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }
}
