import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product, ProductFilters } from '../../../core/models/product.model';
import { Spinner } from '../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Spinner],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit, OnDestroy {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  products: Product[] = [];
  loading = true;
  error = '';
  addedProductId = '';

  // Filters
  searchQuery = '';
  selectedCategory = '';
  selectedSort = '-createdAt';
  minPrice = '';
  maxPrice = '';

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  limit = 12;

  categories = ['electronics', 'clothing', 'books', 'home', 'beauty', 'sports', 'toys'];
  sortOptions = [
    { label: 'Newest', value: '-createdAt' },
    { label: 'Oldest', value: 'createdAt' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
    { label: 'Name A-Z', value: 'name' },
  ];

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.selectedCategory = params.get('category') || '';
      this.searchQuery = params.get('search') || '';
      this.currentPage = +(params.get('page') || 1);
      this.loadProducts();
    });

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(val => this.applySearch(val));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.loading = true;
    const filters: ProductFilters = {
      page: this.currentPage,
      limit: this.limit,
      sort: this.selectedSort,
    };
    if (this.selectedCategory) filters['category'] = this.selectedCategory;
    if (this.searchQuery) filters['search'] = this.searchQuery;
    if (this.minPrice) filters['price[gte]'] = +this.minPrice;
    if (this.maxPrice) filters['price[lte]'] = +this.maxPrice;

    this.productService.getAll(filters).subscribe({
      next: res => {
        this.products = res.data || [];
        this.totalCount = res.count || 0;
        this.totalPages = res.page || Math.ceil(this.totalCount / this.limit);
        this.loading = false;
      },
      error: err => {
        this.error = err.error?.message || 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  onSearchChange(val: string): void {
    this.searchSubject.next(val);
  }

  applySearch(val: string): void {
    this.currentPage = 1;
    this.router.navigate([], {
      queryParams: { search: val || null, category: this.selectedCategory || null, page: 1 },
      queryParamsHandling: 'merge'
    });
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    this.router.navigate([], {
      queryParams: { category: this.selectedCategory || null, page: 1 },
      queryParamsHandling: 'merge'
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.searchQuery = '';
    this.selectedSort = '-createdAt';
    this.minPrice = '';
    this.maxPrice = '';
    this.currentPage = 1;
    this.router.navigate(['/products']);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.router.navigate([], { queryParams: { page }, queryParamsHandling: 'merge' });
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  addToCart(product: Product, event: Event): void {
    event.preventDefault();
    this.cartService.addToCart(product);
    this.addedProductId = product._id;
    setTimeout(() => this.addedProductId = '', 1500);
  }
}
