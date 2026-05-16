import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';
import { Spinner } from '../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Spinner],
  templateUrl: './product-detail.html'
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product: Product | null = null;
  loading = true;
  error = '';
  quantity = 1;
  added = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Product not found';
      this.loading = false;
      return;
    }

    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.product = products.find((product: Product & { id?: number }) => product.id === Number(id)) || null;
        if (!this.product) {
          this.error = 'Product not found';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Product error';
        this.loading = false;
      }
    });
  }

  addToCart(): void {
    if (!this.product) return;
    this.cartService.addToCart(this.product, this.quantity);
    this.added = true;
    setTimeout(() => this.added = false, 2000);
  }
}
