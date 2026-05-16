import { Injectable, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { 
  IUser, 
  IAuthResponse, 
  ILoginRequest, 
  ISignupRequest, 
  IVerifyOtpRequest,
  IForgotPasswordRequest,
  IResetPasswordRequest
} from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  
  currentUser$ = this.currentUserSubject.asObservable();
  token$ = this.tokenSubject.asObservable();
  
  isLoggedIn = signal(false);
  isAdmin = signal(false);
  user = signal<IUser | null>(null);

  constructor() {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as IUser;
          this.tokenSubject.next(token);
          this.currentUserSubject.next(user);
          this.isLoggedIn.set(true);
          this.isAdmin.set(user.role === 'admin');
          this.user.set(user);
        } catch {
          this.clearAuth();
        }
      }
    }
  }

  private saveAuth(token: string, user: IUser): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.tokenSubject.next(token);
    this.currentUserSubject.next(user);
    this.isLoggedIn.set(true);
    this.isAdmin.set(user.role === 'admin');
    this.user.set(user);
  }

  private clearAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
    this.isLoggedIn.set(false);
    this.isAdmin.set(false);
    this.user.set(null);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  signup(data: ISignupRequest): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/signup`, data).pipe(
      catchError(this.handleError)
    );
  }

  verifyOtp(data: IVerifyOtpRequest): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/verify-otp`, data).pipe(
      tap(response => {
        if (response.success && response.token && response.data) {
          this.saveAuth(response.token, response.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  login(data: ILoginRequest): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        if (response.success && response.token && response.data) {
          this.saveAuth(response.token, response.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  forgotPassword(data: IForgotPasswordRequest): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/forgot-password`, data).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(token: string, data: IResetPasswordRequest): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/resetPassword/${token}`, data).pipe(
      catchError(this.handleError)
    );
  }

  logout(): Observable<IAuthResponse> {
    return this.http.get<IAuthResponse>(`${this.apiUrl}/logout`).pipe(
      tap(() => this.clearAuth()),
      catchError(this.handleError)
    );
  }

  logoutLocal(): void {
    this.clearAuth();
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
