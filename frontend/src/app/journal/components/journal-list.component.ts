import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { JournalService } from '../services/journal.service';
import { Journal } from '../../shared/models/journal.model';
import { JournalFormComponent } from './journal-form.component';

@Component({
  selector: 'app-journal-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  template: `
    <div class="journal-container">
      <div class="header">
        <h2>Journal Entries</h2>
        <button mat-raised-button color="primary" (click)="openJournalDialog()">
          <mat-icon>add</mat-icon>
          Create Journal Entry
        </button>
      </div>
      
      <div class="table-container">
        <table mat-table [dataSource]="journals" class="journal-table">
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Date</th>
            <td mat-cell *matCellDef="let journal">{{ journal.date | date:'dd/MM/yyyy' }}</td>
          </ng-container>

          <ng-container matColumnDef="company">
            <th mat-header-cell *matHeaderCellDef>Company</th>
            <td mat-cell *matCellDef="let journal">{{ journal.company?.name || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="narration">
            <th mat-header-cell *matHeaderCellDef>Narration</th>
            <td mat-cell *matCellDef="let journal">{{ journal.narration }}</td>
          </ng-container>

          <ng-container matColumnDef="totalAmount">
            <th mat-header-cell *matHeaderCellDef>Total Amount</th>
            <td mat-cell *matCellDef="let journal">₹{{ getTotalAmount(journal) | number:'1.2-2' }}</td>
          </ng-container>

          <ng-container matColumnDef="entries">
            <th mat-header-cell *matHeaderCellDef>Entries</th>
            <td mat-cell *matCellDef="let journal">{{ journal.entries?.length || 0 }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let journal">
              <button mat-icon-button color="primary" (click)="openJournalDialog(journal)" matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="accent" (click)="viewDetails(journal)" matTooltip="View Details">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteJournal(journal)" matTooltip="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div *ngIf="journals.length === 0" class="no-data">
          <mat-icon>book</mat-icon>
          <p>No journal entries found. Create your first journal entry to get started!</p>
        </div>
      </div>

      <!-- Details Panel -->
      <mat-expansion-panel *ngIf="selectedJournal" class="details-panel">
        <mat-expansion-panel-header>
          <mat-panel-title>
            Journal Entry Details - {{ selected Journal.date | date:'dd/MM/yyyy' }}
          </mat-panel-title>
        </mat-expansion-panel-header>

        <div class="details-content">
          <p><strong>Company:</strong> {{ selectedJournal.company?.name }}</p>
          <p><strong>Narration:</strong> {{ selectedJournal.narration }}</p>
          
          <h4>Entries:</h4>
          <table class="entries-table">
            <thead>
              <tr>
                <th>Ledger</th>
                <th>Description</th>
                <th>Debit</th>
                <th>Credit</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let entry of selectedJournal.entries">
                <td>{{ entry.ledger?.name }}</td>
                <td>{{ entry.description || '-' }}</td>
                <td class="amount">{{ entry.debit ? ('₹' + (entry.debit | number:'1.2-2')) : '-' }}</td>
                <td class="amount">{{ entry.credit ? ('₹' + (entry.credit | number:'1.2-2')) : '-' }}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2"><strong>Total</strong></td>
                <td class="amount"><strong>₹{{ getTotalDebit(selectedJournal) | number:'1.2-2' }}</strong></td>
                <td class="amount"><strong>₹{{ getTotalCredit(selectedJournal) | number:'1.2-2' }}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </mat-expansion-panel>
    </div>
  `,
  styles: [`
    .journal-container {
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

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: auto;
      margin-bottom: 20px;
    }

    .journal-table {
      width: 100%;
    }

    .journal-table th {
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

    .details-panel {
      margin-top: 20px;
    }

    .details-content {
      padding: 20px;
    }

    .details-content p {
      margin: 10px 0;
    }

    .details-content h4 {
      margin: 20px 0 10px 0;
      color: #333;
    }

    .entries-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    .entries-table th,
    .entries-table td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: left;
    }

    .entries-table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }

    .entries-table .amount {
      text-align: right;
    }

    .entries-table .total-row {
      background-color: #e3f2fd;
      font-weight: bold;
    }
  `]
})
export class JournalListComponent implements OnInit {
  journals: Journal[] = [];
  selectedJournal: Journal | null = null;
  displayedColumns: string[] = ['date', 'company', 'narration', 'totalAmount', 'entries', 'actions'];

  constructor(
    private journalService: JournalService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadJournals();
  }

  loadJournals(): void {
    this.journalService.getJournals().subscribe({
      next: (journals) => {
        this.journals = journals;
      },
      error: (error) => {
        console.error('Error loading journals:', error);
        this.snackBar.open('Failed to load journal entries', 'Close', { duration: 3000 });
      }
    });
  }

  getTotalAmount(journal: Journal): number {
    if (!journal.entries) return 0;
    return journal.entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  }

  getTotalDebit(journal: Journal): number {
    if (!journal.entries) return 0;
    return journal.entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  }

  getTotalCredit(journal: Journal): number {
    if (!journal.entries) return 0;
    return journal.entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  }

  openJournalDialog(journal?: Journal): void {
    const dialogRef = this.dialog.open(JournalFormComponent, {
      width: '900px',
      maxHeight: '90vh',
      data: { journal }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadJournals();
        this.selectedJournal = null;
      }
    });
  }

  viewDetails(journal: Journal): void {
    this.selectedJournal = journal;
  }

  deleteJournal(journal: Journal): void {
    if (confirm(`Are you sure you want to delete this journal entry?`)) {
      this.journalService.deleteJournal(journal.id!).subscribe({
        next: () => {
          this.snackBar.open('Journal entry deleted successfully', 'Close', { duration: 3000 });
          this.loadJournals();
          if (this.selectedJournal?.id === journal.id) {
            this.selectedJournal = null;
          }
        },
        error: (error) => {
          console.error('Error deleting journal:', error);
          this.snackBar.open('Failed to delete journal entry', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
