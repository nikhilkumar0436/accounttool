import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login.component';
import { SignupComponent } from './auth/components/signup.component';
import { DashboardComponent } from './shared/components/dashboard.component';
import { CompanyListComponent } from './company/components/company-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'companies', pathMatch: 'full' },
      { path: 'companies', component: CompanyListComponent },
      { path: 'ledgers', component: CompanyListComponent }, // Placeholder
      { path: 'journals', component: CompanyListComponent }, // Placeholder
      { path: 'sales-invoices', component: CompanyListComponent }, // Placeholder
      { path: 'purchase-invoices', component: CompanyListComponent } // Placeholder
    ]
  }
];
