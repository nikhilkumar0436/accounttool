import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Invoices</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="action-buttons">
            <button mat-raised-button color="primary" routerLink="/invoices/new">
              <mat-icon>add</mat-icon> New Invoice
            </button>
          </div>

          <div class="table-container">
            <table mat-table [dataSource]="invoices" class="mat-elevation-z8">
              <ng-container matColumnDef="invoiceNumber">
                <th mat-header-cell *matHeaderCellDef>Invoice #</th>
                <td mat-cell *matCellDef="let invoice">{{ invoice.invoiceNumber }}</td>
              </ng-container>

              <ng-container matColumnDef="type">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let invoice">
                  <mat-chip [color]="invoice.type === 'SALES' ? 'primary' : 'accent'">
                    {{ invoice.type }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="invoiceDate">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let invoice">{{ invoice.invoiceDate | date }}</td>
              </ng-container>

              <ng-container matColumnDef="subtotal">
                <th mat-header-cell *matHeaderCellDef>Subtotal</th>
                <td mat-cell *matCellDef="let invoice">₹{{ invoice.subtotal | number:'1.2-2' }}</td>
              </ng-container>

              <ng-container matColumnDef="cgst">
                <th mat-header-cell *matHeaderCellDef>CGST</th>
                <td mat-cell *matCellDef="let invoice">₹{{ invoice.cgstAmount | number:'1.2-2' }}</td>
              </ng-container>

              <ng-container matColumnDef="sgst">
                <th mat-header-cell *matHeaderCellDef>SGST</th>
                <td mat-cell *matCellDef="let invoice">₹{{ invoice.sgstAmount | number:'1.2-2' }}</td>
              </ng-container>

              <ng-container matColumnDef="igst">
                <th mat-header-cell *matHeaderCellDef>IGST</th>
                <td mat-cell *matCellDef="let invoice">₹{{ invoice.igstAmount | number:'1.2-2' }}</td>
              </ng-container>

              <ng-container matColumnDef="totalAmount">
                <th mat-header-cell *matHeaderCellDef>Total</th>
                <td mat-cell *matCellDef="let invoice"><strong>₹{{ invoice.totalAmount | number:'1.2-2' }}</strong></td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let invoice">
                  <mat-chip [color]="getStatusColor(invoice.status)">
                    {{ invoice.status }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let invoice">
                  <button mat-icon-button color="primary">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .action-buttons {
      margin-bottom: 20px;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
    }
  `]
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  displayedColumns = ['invoiceNumber', 'type', 'invoiceDate', 'subtotal', 'cgst', 'sgst', 'igst', 'totalAmount', 'status', 'actions'];

  constructor(
    private invoiceService: InvoiceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.companyId) {
      this.invoiceService.getByCompany(currentUser.companyId).subscribe({
        next: (data) => {
          this.invoices = data;
        },
        error: (error) => {
          console.error('Error loading invoices', error);
        }
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'POSTED': return 'primary';
      case 'DRAFT': return 'accent';
      case 'CANCELLED': return 'warn';
      default: return '';
    }
  }
}
