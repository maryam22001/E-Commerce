import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/users`;

  getAll(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(this.base);
  }

  getOne(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.base}/${id}`);
  }

  update(id: string, data: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  softDelete(id: string): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.base}/softDeleted/${id}`, {});
  }
}
