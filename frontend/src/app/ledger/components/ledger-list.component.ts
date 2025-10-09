import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { LedgerService } from '../services/ledger.service';
import { Ledger } from '../../shared/models/ledger.model';
import { LedgerFormComponent } from './ledger-form.component';

@Component({
  selector: 'app-ledger-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  template: `
    <div class="ledger-container">
      <div class="header">
        <h2>Ledger Management</h2>
        <button mat-raised-button color="primary" (click)="openLedgerDialog()">
          <mat-icon>add</mat-icon>
          Create Ledger
        </button>
      </div>

      <div class="filter-section">
        <mat-form-field appearance="outline">
          <mat-label>Filter by Type</mat-label>
          <mat-select [(ngModel)]="selectedType" (selectionChange)="filterLedgers()">
            <mat-option value="">All Types</mat-option>
            <mat-option value="ASSET">Asset</mat-option>
            <mat-option value="LIABILITY">Liability</mat-option>
            <mat-option value="INCOME">Income</mat-option>
            <mat-option value="EXPENSE">Expense</mat-option>
            <mat-option value="CAPITAL">Capital</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="filteredLedgers" class="ledger-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let ledger">{{ ledger.name }}</td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let ledger">{{ ledger.type }}</td>
          </ng-container>

          <ng-container matColumnDef="company">
            <th mat-header-cell *matHeaderCellDef>Company</th>
            <td mat-cell *matCellDef="let ledger">{{ ledger.company?.name || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="openingBalance">
            <th mat-header-cell *matHeaderCellDef>Opening Balance</th>
            <td mat-cell *matCellDef="let ledger">₹{{ ledger.openingBalance | number:'1.2-2' }}</td>
          </ng-container>

          <ng-container matColumnDef="currentBalance">
            <th mat-header-cell *matHeaderCellDef>Current Balance</th>
            <td mat-cell *matCellDef="let ledger">₹{{ ledger.currentBalance | number:'1.2-2' }}</td>
          </ng-container>

          <ng-container matColumnDef="gstApplicable">
            <th mat-header-cell *matHeaderCellDef>GST Applicable</th>
            <td mat-cell *matCellDef="let ledger">
              <mat-icon *ngIf="ledger.gstApplicable" color="primary">check_circle</mat-icon>
              <mat-icon *ngIf="!ledger.gstApplicable">cancel</mat-icon>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let ledger">
              <button mat-icon-button color="primary" (click)="openLedgerDialog(ledger)" matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteLedger(ledger)" matTooltip="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div *ngIf="filteredLedgers.length === 0" class="no-data">
          <mat-icon>account_balance</mat-icon>
          <p>No ledgers found. Create your first ledger to get started!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ledger-container {
      max-width: 1400px;
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

    .filter-section {
      margin-bottom: 20px;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: auto;
    }

    .ledger-table {
      width: 100%;
    }

    .ledger-table th {
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
  `]
})
export class LedgerListComponent implements OnInit {
  ledgers: Ledger[] = [];
  filteredLedgers: Ledger[] = [];
  selectedType: string = '';
  displayedColumns: string[] = ['name', 'type', 'company', 'openingBalance', 'currentBalance', 'gstApplicable', 'actions'];

  constructor(
    private ledgerService: LedgerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLedgers();
  }

  loadLedgers(): void {
    this.ledgerService.getLedgers().subscribe({
      next: (ledgers) => {
        this.ledgers = ledgers;
        this.filterLedgers();
      },
      error: (error) => {
        console.error('Error loading ledgers:', error);
        this.snackBar.open('Failed to load ledgers', 'Close', { duration: 3000 });
      }
    });
  }

  filterLedgers(): void {
    if (this.selectedType) {
      this.filteredLedgers = this.ledgers.filter(l => l.type === this.selectedType);
    } else {
      this.filteredLedgers = [...this.ledgers];
    }
  }

  openLedgerDialog(ledger?: Ledger): void {
    const dialogRef = this.dialog.open(LedgerFormComponent, {
      width: '600px',
      data: { ledger }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLedgers();
      }
    });
  }

  deleteLedger(ledger: Ledger): void {
    if (confirm(`Are you sure you want to delete ledger "${ledger.name}"?`)) {
      this.ledgerService.deleteLedger(ledger.id!).subscribe({
        next: () => {
          this.snackBar.open('Ledger deleted successfully', 'Close', { duration: 3000 });
          this.loadLedgers();
        },
        error: (error) => {
          console.error('Error deleting ledger:', error);
          this.snackBar.open('Failed to delete ledger', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
