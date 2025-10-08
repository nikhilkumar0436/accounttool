import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sales-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="invoice-container">
      <div class="header">
        <h2>Sales Invoices</h2>
      </div>
      
      <mat-card class="info-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>receipt</mat-icon>
          <mat-card-title>Sales Invoices Module</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>This section will manage your GST-compliant sales invoices.</p>
          <h3>Features coming soon:</h3>
          <ul>
            <li>Create sales invoices with multiple line items</li>
            <li>Automatic GST calculation (CGST/SGST for intra-state, IGST for inter-state)</li>
            <li>HSN/SAC code support</li>
            <li>Party/customer selection from ledgers</li>
            <li>Invoice number generation</li>
            <li>Tax breakdown display</li>
            <li>View, edit, and delete invoices</li>
            <li>Print and export options</li>
          </ul>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" disabled>
            <mat-icon>add</mat-icon>
            Create Sales Invoice (Coming Soon)
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .invoice-container {
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
export class SalesInvoiceListComponent {
}
