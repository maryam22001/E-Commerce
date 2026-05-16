import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IProduct, IProductsResponse, IProductResponse } from '../interfaces/product.interface';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;

  getAll(params?: ProductQueryParams): Observable<IProductsResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.sort) httpParams = httpParams.set('sort', params.sort);
      if (params.fields) httpParams = httpParams.set('fields', params.fields);
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.category) httpParams = httpParams.set('category', params.category);
      if (params.minPrice) httpParams = httpParams.set('price[gte]', params.minPrice.toString());
      if (params.maxPrice) httpParams = httpParams.set('price[lte]', params.maxPrice.toString());
    }

    return this.http.get<IProductsResponse>(this.apiUrl, { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  getOne(id: string): Observable<IProductResponse> {
    return this.http.get<IProductResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getDeleted(): Observable<IProductsResponse> {
    return this.http.get<IProductsResponse>(`${this.apiUrl}/deleted`).pipe(
      catchError(this.handleError)
    );
  }

  getStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/status`).pipe(
      catchError(this.handleError)
    );
  }

  create(product: Partial<IProduct>): Observable<IProductResponse> {
    return this.http.post<IProductResponse>(this.apiUrl, product).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, product: Partial<IProduct>): Observable<IProductResponse> {
    return this.http.patch<IProductResponse>(`${this.apiUrl}/${id}`, product).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  softDelete(id: string): Observable<IProductResponse> {
    return this.http.patch<IProductResponse>(`${this.apiUrl}/softDeleted/${id}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}
