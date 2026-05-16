import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductFilters } from '../models/product.model';
import { ApiResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/products`;

  getAll(filters: ProductFilters = {}): Observable<ApiResponse<Product[]>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, String(val));
      }
    });
    return this.http.get<ApiResponse<Product[]>>(this.base, { params });
  }

  getOne(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.base}/${id}`);
  }

  create(data: Partial<Product>): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.base, data);
  }

  update(id: string, data: Partial<Product>): Observable<ApiResponse<Product>> {
    return this.http.patch<ApiResponse<Product>>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  softDelete(id: string): Observable<ApiResponse<Product>> {
    return this.http.patch<ApiResponse<Product>>(`${this.base}/softDeleted/${id}`, {});
  }
}
