import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ledger-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="ledger-container">
      <div class="header">
        <h2>Ledger Management</h2>
      </div>
      
      <mat-card class="info-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>account_balance</mat-icon>
          <mat-card-title>Ledgers Module</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>This section will manage your Chart of Accounts and Ledgers.</p>
          <h3>Features coming soon:</h3>
          <ul>
            <li>Create and manage ledgers (Asset, Liability, Income, Expense, Capital)</li>
            <li>Set opening and current balances</li>
            <li>Mark ledgers as GST-applicable party ledgers</li>
            <li>View ledger details and transaction history</li>
            <li>Filter and search ledgers by type</li>
          </ul>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" disabled>
            <mat-icon>add</mat-icon>
            Create Ledger (Coming Soon)
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .ledger-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h2 {
      margin: 0;
      color: #333;
    }

    .info-card {
      margin: 20px 0;
    }

    .info-card ul {
      margin: 10px 0;
      padding-left: 20px;
    }

    .info-card li {
      margin: 8px 0;
      color: #555;
    }

    .info-card h3 {
      margin-top: 15px;
      color: #1976d2;
    }
  `]
})
export class LedgerListComponent {
}
