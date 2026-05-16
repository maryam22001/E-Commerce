import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Routes that make API calls must use Server or Client rendering
  { path: '', renderMode: RenderMode.Client },
  { path: 'products', renderMode: RenderMode.Client },
  { path: 'products/:id', renderMode: RenderMode.Server },
  { path: 'cart', renderMode: RenderMode.Client },
  
  { path: 'profile', renderMode: RenderMode.Server },
  { path: 'auth/login', renderMode: RenderMode.Client },
  { path: 'auth/signup', renderMode: RenderMode.Client },
  { path: 'auth/verify-otp', renderMode: RenderMode.Client },
  { path: 'auth/forgot-password', renderMode: RenderMode.Client },
  { path: 'auth/reset-password/:token', renderMode: RenderMode.Server },
  { path: 'admin/**', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Client }
];
