import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { CartItem } from '../../core/models/order.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);
  items: CartItem[] = [];

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => this.items = items);
  }

  updateQty(productId: string, qty: number): void {
    this.cartService.updateQuantity(productId, qty);
  }

  remove(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
