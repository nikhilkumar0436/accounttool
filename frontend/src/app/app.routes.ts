import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'companies',
    loadComponent: () => import('./components/company/company-list.component').then(m => m.CompanyListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'companies/new',
    loadComponent: () => import('./components/company/company-form.component').then(m => m.CompanyFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'invoices',
    loadComponent: () => import('./components/invoice/invoice-list.component').then(m => m.InvoiceListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'invoices/new',
    loadComponent: () => import('./components/invoice/invoice-form.component').then(m => m.InvoiceFormComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];
