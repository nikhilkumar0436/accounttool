import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary">
        <button mat-icon-button (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span>AccountTool - GST Management System</span>
        <span class="spacer"></span>
        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
          {{ currentUser?.username }}
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            Logout
          </button>
        </mat-menu>
      </mat-toolbar>

      <mat-sidenav-container>
        <mat-sidenav #sidenav mode="side" opened>
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard/companies" routerLinkActive="active">
              <mat-icon>business</mat-icon>
              <span>Companies</span>
            </a>
            <a mat-list-item routerLink="/dashboard/ledgers" routerLinkActive="active">
              <mat-icon>account_balance</mat-icon>
              <span>Ledgers</span>
            </a>
            <a mat-list-item routerLink="/dashboard/journals" routerLinkActive="active">
              <mat-icon>book</mat-icon>
              <span>Journal Entries</span>
            </a>
            <a mat-list-item routerLink="/dashboard/sales-invoices" routerLinkActive="active">
              <mat-icon>receipt</mat-icon>
              <span>Sales Invoices</span>
            </a>
            <a mat-list-item routerLink="/dashboard/purchase-invoices" routerLinkActive="active">
              <mat-icon>shopping_cart</mat-icon>
              <span>Purchase Invoices</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content>
          <div class="content">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .dashboard-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .spacer {
      flex: 1 1 auto;
    }

    mat-sidenav-container {
      flex: 1;
    }

    mat-sidenav {
      width: 250px;
    }

    mat-nav-list a {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    mat-nav-list a.active {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .content {
      padding: 20px;
    }
  `]
})
export class DashboardComponent {
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
