import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Product } from '../../../core/models/product.model';
import { Spinner } from '../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-product-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './product-manager.html'
})
export class ProductManagerComponent implements OnInit {
  products: any[] = [];
  productForm!: FormGroup;
  isEditMode = false;
  currentProductId: string | null = null;
  private apiUrl = 'http://localhost:8080/products';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  // Initialize the Reactive Form with validations
  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      discription: ['', [Validators.required]],
      category: ['', [Validators.required]],
      image: ['', [Validators.required]]
    });
  }

  // Fetch products from the backend API
  loadProducts(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data: any) => {
        // Automatically handles both straight array or wrapped responses like data.products
        this.products = data.data || data.products || data;
      },
      error: (err) => console.error('Failed to load products:', err)
    });
  }

  // Handle Form Submission (Both Add and Update)
  onSubmit(): void {
    if (this.productForm.invalid) return;

    // Ensure price is sent as a strict Number, not a string
    const productData = {
      ...this.productForm.value,
      price: Number(this.productForm.value.price)
    };

    if (this.isEditMode && this.currentProductId) {
      // Update existing product
      this.http.patch(`${this.apiUrl}/${this.currentProductId}`, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.resetForm();
          alert('Product updated successfully!');
        },
        error: (err) => {
          console.error('Error updating product:', err);
          let backendError = err.message;
          if (err.error) {
            if (Array.isArray(err.error.errors)) {
              backendError = err.error.errors.map((e: any) => `${e.param || e.path || 'Field'}: ${e.msg || e.message}`).join('\n');
            } else if (err.error.details) {
              backendError = err.error.details.map((e: any) => e.message).join('\n');
            } else {
              backendError = err.error.message || JSON.stringify(err.error);
            }
          }
          alert('Failed to update product:\n\n' + backendError);
        }
      });
    } else {
      // Add a new product
      this.http.post(this.apiUrl, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.resetForm();
          alert('Product added successfully!');
        },
        error: (err) => {
          console.error('Error adding product:', err);          let backendError = err.message;
          if (err.error) {
            if (Array.isArray(err.error.errors)) {
              backendError = err.error.errors.map((e: any) => `${e.param || e.path || 'Field'}: ${e.msg || e.message}`).join('\n');
            } else if (err.error.details) {
              backendError = err.error.details.map((e: any) => e.message).join('\n');
            } else {
              backendError = err.error.message || JSON.stringify(err.error);
            }
          }
          alert('Failed to add product:\n\n' + backendError);
        }
      });
    }
  }

  // Fill form fields with existing product data for editing
  onEdit(product: any): void {
    this.isEditMode = true;
    this.currentProductId = product._id || product.id;
    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      discription: product.discription,
      category: product.category,
      image: product.image
    });
  }

  // Delete product action
  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          // Instantly filter out from UI view
          this.products = this.products.filter(p => (p as any)._id !== id && (p as any).id !== id);
          alert('Product deleted successfully!');
        },
        error: (err) => console.error('Error deleting product:', err)
      });
    }
  }

  // Reset state
  resetForm(): void {
    this.isEditMode = false;
    this.currentProductId = null;
    this.productForm.reset({
      name: '',
      price: 0,
      discription: '',
      category: '',
      image: ''
    });
  }
}
