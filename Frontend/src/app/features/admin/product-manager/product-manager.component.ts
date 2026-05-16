import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './product-manager.html'
})
export class ProductManagerComponent implements OnInit {
  products: any[] = [];
  categories: string[] = ['Electronics', 'Clothing', 'Home', 'Books', 'Other'];

  form: FormGroup;
  showModal = false;
  editingProduct: any = null;

  loading = false;
  saving = false;
  deleting: string | null = null;

  success = '';
  error = '';

  // Replace this with your actual backend URL/port
  private apiUrl = 'http://localhost:3000/products';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      discription: ['', Validators.required], // Matched spelling to your HTML
      image: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        this.products = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  openAdd(): void {
    this.editingProduct = null;
    this.form.reset({ category: '', price: 0 });
    this.showModal = true;
  }

  openEdit(product: any): void {
    this.editingProduct = product;
    this.form.patchValue(product);
    this.showModal = true;
  }

  save(): void {
    if (this.form.invalid) return;

    this.saving = true;
    this.success = '';
    this.error = '';

    const productData = this.form.value;
    const request = this.editingProduct
      ? this.http.patch(`${this.apiUrl}/${this.editingProduct._id}`, productData)
      : this.http.post(this.apiUrl, productData);

    request.subscribe({
      next: () => {
        this.success = `Product successfully ${this.editingProduct ? 'updated' : 'added'}!`;
        this.showModal = false;
        this.saving = false;
        this.loadProducts(); // Refresh table
      },
      error: (err) => {
        this.error = 'An error occurred while saving the product.';
        this.saving = false;
      }
    });
  }

  softDelete(id: string): void {
    this.deleting = id;
    this.http.patch(`${this.apiUrl}/softDeleted/${id}`, {}).subscribe({
      next: () => {
        this.success = 'Product archived successfully.';
        this.deleting = null;
        this.loadProducts();
      }
    });
  }

  hardDelete(id: string): void {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;

    this.deleting = id;
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.success = 'Product deleted permanently.';
        this.deleting = null;
        this.loadProducts();
      }
    });
  }
}
