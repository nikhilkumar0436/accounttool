import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login.component';
import { SignupComponent } from './auth/components/signup.component';
import { DashboardComponent } from './shared/components/dashboard.component';
import { CompanyListComponent } from './company/components/company-list.component';
import { LedgerListComponent } from './ledger/components/ledger-list.component';
import { JournalListComponent } from './journal/components/journal-list.component';
import { SalesInvoiceListComponent } from './gst-invoice/components/sales-invoice-list.component';
import { PurchaseInvoiceListComponent } from './gst-invoice/components/purchase-invoice-list.component';

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
      { path: 'ledgers', component: LedgerListComponent },
      { path: 'journals', component: JournalListComponent },
      { path: 'sales-invoices', component: SalesInvoiceListComponent },
      { path: 'purchase-invoices', component: PurchaseInvoiceListComponent }
    ]
  }
];
