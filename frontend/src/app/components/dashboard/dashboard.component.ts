import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <h1>Dashboard</h1>
      <p>Welcome, {{ currentUser?.username }}!</p>

      <mat-grid-list cols="4" rowHeight="150px" gutterSize="20px">
        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-content>
              <mat-icon color="primary">business</mat-icon>
              <h3>Companies</h3>
              <p class="count">-</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-content>
              <mat-icon color="accent">account_balance</mat-icon>
              <h3>Ledgers</h3>
              <p class="count">-</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-content>
              <mat-icon color="warn">receipt</mat-icon>
              <h3>Invoices</h3>
              <p class="count">-</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-content>
              <mat-icon>assessment</mat-icon>
              <h3>Reports</h3>
              <p class="count">-</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <mat-card class="info-card">
        <mat-card-header>
          <mat-card-title>Quick Info</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p><strong>User Role:</strong> {{ currentUser?.role }}</p>
          <p *ngIf="currentUser?.companyId"><strong>Company ID:</strong> {{ currentUser?.companyId }}</p>
          <p><strong>GST Features:</strong> CGST, SGST, IGST calculation enabled</p>
          <p><strong>Reports Available:</strong> GSTR-1, GSTR-3B, Trial Balance, P&L, Balance Sheet</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }

    h1 {
      margin-bottom: 10px;
    }

    .dashboard-card {
      width: 100%;
      text-align: center;
    }

    .dashboard-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .dashboard-card h3 {
      margin: 10px 0;
    }

    .dashboard-card .count {
      font-size: 24px;
      font-weight: bold;
      margin: 0;
    }

    .info-card {
      margin-top: 20px;
    }

    .info-card p {
      margin: 10px 0;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser = this.authService.getCurrentUser();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
}
