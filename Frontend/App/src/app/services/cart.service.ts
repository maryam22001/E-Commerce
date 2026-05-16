import { Injectable, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IProduct } from '../interfaces/product.interface';
import { ICart, ICartItem } from '../interfaces/cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly CART_KEY = 'ecommerce_cart';
  
  private cartSignal = signal<ICartItem[]>([]);
  
  items = this.cartSignal.asReadonly();
  
  totalItems = computed(() => 
    this.cartSignal().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  totalPrice = computed(() => 
    this.cartSignal().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );
  
  cart = computed<ICart>(() => ({
    items: this.cartSignal(),
    totalItems: this.totalItems(),
    totalPrice: this.totalPrice()
  }));

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.CART_KEY);
      if (stored) {
        try {
          const items = JSON.parse(stored) as ICartItem[];
          this.cartSignal.set(items);
        } catch {
          this.cartSignal.set([]);
        }
      }
    }
  }

  private saveCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.CART_KEY, JSON.stringify(this.cartSignal()));
    }
  }

  addToCart(product: IProduct, quantity: number = 1): void {
    const items = [...this.cartSignal()];
    const productId = product._id || product.id;
    const existingIndex = items.findIndex(item => 
      (item.product._id || item.product.id) === productId
    );

    if (existingIndex > -1) {
      items[existingIndex] = {
        ...items[existingIndex],
        quantity: items[existingIndex].quantity + quantity
      };
    } else {
      items.push({ product, quantity });
    }

    this.cartSignal.set(items);
    this.saveCart();
  }

  removeFromCart(productId: string): void {
    const items = this.cartSignal().filter(item => 
      (item.product._id || item.product.id) !== productId
    );
    this.cartSignal.set(items);
    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const items = this.cartSignal().map(item => {
      if ((item.product._id || item.product.id) === productId) {
        return { ...item, quantity };
      }
      return item;
    });

    this.cartSignal.set(items);
    this.saveCart();
  }

  clearCart(): void {
    this.cartSignal.set([]);
    this.saveCart();
  }

  getItemQuantity(productId: string): number {
    const item = this.cartSignal().find(i => 
      (i.product._id || i.product.id) === productId
    );
    return item?.quantity || 0;
  }

  isInCart(productId: string): boolean {
    return this.cartSignal().some(item => 
      (item.product._id || item.product.id) === productId
    );
  }
}
