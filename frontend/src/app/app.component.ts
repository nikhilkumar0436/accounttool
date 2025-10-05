import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary" *ngIf="authService.isAuthenticated()">
      <span>Accounting & GST App</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/dashboard">Dashboard</button>
      <button mat-button [matMenuTriggerFor]="masterMenu">Masters</button>
      <mat-menu #masterMenu="matMenu">
        <button mat-menu-item routerLink="/companies">Companies</button>
        <button mat-menu-item routerLink="/ledgers">Ledgers</button>
      </mat-menu>
      <button mat-button [matMenuTriggerFor]="transactionMenu">Transactions</button>
      <mat-menu #transactionMenu="matMenu">
        <button mat-menu-item routerLink="/invoices">Invoices</button>
      </mat-menu>
      <button mat-button [matMenuTriggerFor]="reportMenu">Reports</button>
      <mat-menu #reportMenu="matMenu">
        <button mat-menu-item routerLink="/reports/gstr1">GSTR-1</button>
        <button mat-menu-item routerLink="/reports/gstr3b">GSTR-3B</button>
      </mat-menu>
      <button mat-icon-button (click)="logout()">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
