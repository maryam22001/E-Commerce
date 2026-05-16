import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { Spinner } from '../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-product-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Spinner],
  templateUrl: './product-manager.html'
})
export class ProductManager implements OnInit {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  products: Product[] = [];
  loading = true;
  saving = false;
  deleting: string | null = null;
  error = '';
  success = '';
  showModal = false;
  editingProduct: Product | null = null;

  categories = ['electronics', 'clothing', 'books', 'home', 'beauty', 'sports', 'toys'];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    discription: ['', [Validators.required, Validators.minLength(3)]],
    image: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    category: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]]
  });

  get f() { return this.form.controls; }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.productService.getAll({ limit: 100 }).subscribe({
      next: res => { this.products = res.data || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openAdd(): void {
    this.editingProduct = null;
    this.form.reset({ price: 0 });
    this.showModal = true;
  }

  openEdit(p: Product): void {
    this.editingProduct = p;
    this.form.patchValue({ name: p.name, discription: p.discription, image: p.image, category: p.category, price: p.price });
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const data = this.form.value as Partial<Product>;
    const op = this.editingProduct
      ? this.productService.update(this.editingProduct._id, data)
      : this.productService.create(data);

    op.subscribe({
      next: () => {
        this.success = this.editingProduct ? 'Product updated!' : 'Product created!';
        this.showModal = false;
        this.saving = false;
        this.load();
        setTimeout(() => this.success = '', 3000);
      },
      error: err => {
        this.error = err.error?.message || 'Operation failed.';
        this.saving = false;
      }
    });
  }

  softDelete(id: string): void {
    if (!confirm('Archive this product?')) return;
    this.deleting = id;
    this.productService.softDelete(id).subscribe({
      next: () => { this.load(); this.deleting = null; },
      error: () => { this.deleting = null; }
    });
  }

  hardDelete(id: string): void {
    if (!confirm('Permanently delete this product? This cannot be undone.')) return;
    this.deleting = id;
    this.productService.delete(id).subscribe({
      next: () => { this.load(); this.deleting = null; },
      error: () => { this.deleting = null; }
    });
  }
}
