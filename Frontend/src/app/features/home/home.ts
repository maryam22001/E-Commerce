import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { Spinner } from '../../shared/components/spinner/spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, Spinner],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  featuredProducts: Product[] = [];
  loading = true;
  addedProductId = '';

  categories = [
    { name: 'Electronics', slug: 'electronics', icon: 'bi-cpu', color: '#e3f2fd' },
    { name: 'Clothing', slug: 'clothing', icon: 'bi-bag', color: '#fce4ec' },
    { name: 'Sports', slug: 'sports', icon: 'bi-trophy', color: '#e8f5e9' },
    { name: 'Home', slug: 'home', icon: 'bi-house', color: '#fff8e1' },
    { name: 'Books', slug: 'books', icon: 'bi-book', color: '#f3e5f5' },
    { name: 'Beauty', slug: 'beauty', icon: 'bi-stars', color: '#fbe9e7' },
  ];

  ngOnInit(): void {
    this.productService.getAll({ limit: 8 }).subscribe({
      next: res => {
        this.featuredProducts = res.data || [];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.addedProductId = product._id;
    setTimeout(() => this.addedProductId = '', 1500);
  }
}
