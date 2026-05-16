import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IUser, IUsersResponse, IUserResponse } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  getAll(): Observable<IUsersResponse> {
    return this.http.get<IUsersResponse>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getOne(id: string): Observable<IUserResponse> {
    return this.http.get<IUserResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getDeleted(): Observable<IUsersResponse> {
    return this.http.get<IUsersResponse>(`${this.apiUrl}/deleted`).pipe(
      catchError(this.handleError)
    );
  }

  create(user: Partial<IUser>): Observable<IUserResponse> {
    return this.http.post<IUserResponse>(this.apiUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, user: Partial<IUser>): Observable<IUserResponse> {
    return this.http.patch<IUserResponse>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  softDelete(id: string): Observable<IUserResponse> {
    return this.http.patch<IUserResponse>(`${this.apiUrl}/softDeleted/${id}`, {}).pipe(
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
