import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';
import { ProductManager } from './features/admin/product-manager/product-manager';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductList)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./features/products/product-detail/product-detail').then(m => m.ProductDetail)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart').then(m => m.Cart)
  },
  {
    path: 'admin',
    component: ProductManager
  },
 
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile').then(m => m.Profile)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
      },
      {
        path: 'signup',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/signup/signup').then(m => m.Signup)
      },
      {
        path: 'verify-otp',
        loadComponent: () => import('./features/auth/verify-otp/verify-otp').then(m => m.VerifyOtp)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPassword)
      },
      {
        path: 'reset-password/:token',
        loadComponent: () => import('./features/auth/reset-password/reset-password').then(m => m.ResetPassword)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      {
        path: 'products',
        loadComponent: () => import('./features/admin/product-manager/product-manager').then(m => m.ProductManager)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/user-manager/user-manager').then(m => m.UserManager)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/admin/order-manager/order-manager').then(m => m.OrderManager)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
