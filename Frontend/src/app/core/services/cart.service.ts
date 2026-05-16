import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../models/product.model';
import { CartItem } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  cart$ = this.cartSubject.asObservable();

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private loadCart(): CartItem[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  }

  private save(items: CartItem[]): void {
    if (this.isBrowser) localStorage.setItem('cart', JSON.stringify(items));
    this.cartSubject.next(items);
  }

  get items(): CartItem[] {
    return this.cartSubject.value;
  }

  get totalItems(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  get totalPrice(): number {
    return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  addToCart(product: Product, quantity = 1): void {
    const items = [...this.items];
    const idx = items.findIndex(i => i.product._id === product._id);
    if (idx > -1) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
    } else {
      items.push({ product, quantity });
    }
    this.save(items);
  }

  removeFromCart(productId: string): void {
    this.save(this.items.filter(i => i.product._id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) { this.removeFromCart(productId); return; }
    this.save(this.items.map(i => i.product._id === productId ? { ...i, quantity } : i));
  }

  clearCart(): void {
    this.save([]);
  }
}
