import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { GSTInvoiceService } from '../services/gst-invoice.service';
import { GSTInvoice } from '../../shared/models/gst-invoice.model';
import { InvoiceFormComponent } from './invoice-form.component';

@Component({
  selector: 'app-purchase-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule
  ],
  template: `
    <div class="invoice-container">
      <div class="header">
        <h2>Purchase Invoices</h2>
        <button mat-raised-button color="primary" (click)="openInvoiceDialog()">
          <mat-icon>add</mat-icon>
          Record Purchase Invoice
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="invoices" class="invoice-table">
          <ng-container matColumnDef="invoiceNumber">
            <th mat-header-cell *matHeaderCellDef>Invoice #</th>
            <td mat-cell *matCellDef="let invoice">{{ invoice.invoiceNumber }}</td>
          </ng-container>

          <ng-container matColumnDef="invoiceDate">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let invoice">{{ invoice.invoiceDate | date:'dd/MM/yyyy' }}</td>
          </ng-container>

          <ng-container matColumnDef="company">
            <th mat-header-cell *matHeaderCellDef>Company</th>
            <td mat-cell *matCellDef="let invoice">{{ invoice.company?.name || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="party">
            <th mat-header-cell *matHeaderCellDef>Supplier</th>
            <td mat-cell *matCellDef="let invoice">{{ invoice.party?.name || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="subtotal">
            <th mat-header-cell *matHeaderCellDef>Subtotal</th>
            <td mat-cell *matCellDef="let invoice">₹{{ invoice.subtotal | number:'1.2-2' }}</td>
          </ng-container>

          <ng-container matColumnDef="gst">
            <th mat-header-cell *matHeaderCellDef>GST</th>
            <td mat-cell *matCellDef="let invoice">
              <mat-chip-set>
                <mat-chip *ngIf="invoice.cgst > 0" color="accent">CGST: ₹{{ invoice.cgst | number:'1.2-2' }}</mat-chip>
                <mat-chip *ngIf="invoice.sgst > 0" color="accent">SGST: ₹{{ invoice.sgst | number:'1.2-2' }}</mat-chip>
                <mat-chip *ngIf="invoice.igst > 0" color="primary">IGST: ₹{{ invoice.igst | number:'1.2-2' }}</mat-chip>
              </mat-chip-set>
            </td>
          </ng-container>

          <ng-container matColumnDef="totalAmount">
            <th mat-header-cell *matHeaderCellDef>Total</th>
            <td mat-cell *matCellDef="let invoice"><strong>₹{{ invoice.totalAmount | number:'1.2-2' }}</strong></td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let invoice">
              <button mat-icon-button color="primary" (click)="openInvoiceDialog(invoice)" matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteInvoice(invoice)" matTooltip="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div *ngIf="invoices.length === 0" class="no-data">
          <mat-icon>shopping_cart</mat-icon>
          <p>No purchase invoices found. Record your first purchase invoice to get started!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .invoice-container {
      max-width: 1600px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      width: 100%;
      gap: 16px;
    }

    .header h2 {
      margin: 0;
      color: #333;
      flex: 1;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: auto;
    }

    .invoice-table {
      width: 100%;
    }

    .invoice-table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }

    .no-data {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ddd;
    }

    .no-data p {
      margin-top: 16px;
      font-size: 16px;
    }

    mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    mat-chip {
      font-size: 12px;
    }
  `]
})
export class PurchaseInvoiceListComponent implements OnInit {
  invoices: GSTInvoice[] = [];
  displayedColumns: string[] = ['invoiceNumber', 'invoiceDate', 'company', 'party', 'subtotal', 'gst', 'totalAmount', 'actions'];

  constructor(
    private invoiceService: GSTInvoiceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.getGSTInvoices().subscribe({
      next: (invoices) => {
        // Filter for purchase invoices
        this.invoices = invoices.filter(inv => inv.invoiceType === 'PURCHASE');
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.snackBar.open('Failed to load purchase invoices', 'Close', { duration: 3000 });
      }
    });
  }

  openInvoiceDialog(invoice?: GSTInvoice): void {
    const dialogRef = this.dialog.open(InvoiceFormComponent, {
      width: '1000px',
      maxHeight: '90vh',
      data: { invoice, invoiceType: 'PURCHASE' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInvoices();
      }
    });
  }

  deleteInvoice(invoice: GSTInvoice): void {
    if (confirm(`Are you sure you want to delete invoice "${invoice.invoiceNumber}"?`)) {
      this.invoiceService.deleteGSTInvoice(invoice.id!).subscribe({
        next: () => {
          this.snackBar.open('Invoice deleted successfully', 'Close', { duration: 3000 });
          this.loadInvoices();
        },
        error: (error) => {
          console.error('Error deleting invoice:', error);
          this.snackBar.open('Failed to delete invoice', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
