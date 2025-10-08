import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { JournalService } from '../services/journal.service';
import { LedgerService } from '../../ledger/services/ledger.service';
import { CompanyService } from '../../company/services/company.service';
import { Journal } from '../../shared/models/journal.model';
import { Company } from '../../shared/models/company.model';
import { Ledger } from '../../shared/models/ledger.model';

@Component({
  selector: 'app-journal-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.journal ? 'Edit Journal Entry' : 'Create Journal Entry' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="journalForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Company</mat-label>
          <mat-select formControlName="companyId" required (selectionChange)="onCompanyChange()">
            <mat-option *ngFor="let company of companies" [value]="company.id">
              {{ company.name }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="journalForm.get('companyId')?.hasError('required')">
            Company is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" required>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="journalForm.get('date')?.hasError('required')">
            Date is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Narration</mat-label>
          <textarea matInput formControlName="narration" rows="3" placeholder="Enter journal narration" required></textarea>
          <mat-error *ngIf="journalForm.get('narration')?.hasError('required')">
            Narration is required
          </mat-error>
        </mat-form-field>

        <h3>Journal Entries</h3>
        <div formArrayName="entries">
          <div *ngFor="let entry of entries.controls; let i = index" [formGroupName]="i" class="entry-row">
            <mat-form-field appearance="outline" class="flex-field">
              <mat-label>Ledger</mat-label>
              <mat-select formControlName="ledgerId" required>
                <mat-option *ngFor="let ledger of ledgers" [value]="ledger.id">
                  {{ ledger.name }} ({{ ledger.type }})
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="amount-field">
              <mat-label>Debit</mat-label>
              <input matInput type="number" formControlName="debit" step="0.01" min="0">
            </mat-form-field>

            <mat-form-field appearance="outline" class="amount-field">
              <mat-label>Credit</mat-label>
              <input matInput type="number" formControlName="credit" step="0.01" min="0">
            </mat-form-field>

            <mat-form-field appearance="outline" class="flex-field">
              <mat-label>Description</mat-label>
              <input matInput formControlName="description">
            </mat-form-field>

            <button mat-icon-button color="warn" type="button" (click)="removeEntry(i)" *ngIf="entries.length > 2">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

        <button mat-raised-button type="button" (click)="addEntry()" class="add-entry-btn">
          <mat-icon>add</mat-icon>
          Add Entry
        </button>

        <div class="balance-info">
          <div class="balance-row">
            <span>Total Debit:</span>
            <span class="amount">₹{{ getTotalDebit() | number:'1.2-2' }}</span>
          </div>
          <div class="balance-row">
            <span>Total Credit:</span>
            <span class="amount">₹{{ getTotalCredit() | number:'1.2-2' }}</span>
          </div>
          <div class="balance-row" [class.balanced]="isBalanced()" [class.unbalanced]="!isBalanced()">
            <span>Difference:</span>
            <span class="amount">₹{{ getDifference() | number:'1.2-2' }}</span>
          </div>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" 
              [disabled]="!journalForm.valid || !isBalanced()">
        {{ data.journal ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 700px;
      max-width: 900px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    h3 {
      margin: 20px 0 10px 0;
      color: #333;
    }

    .entry-row {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      margin-bottom: 10px;
      padding: 10px;
      background: #f9f9f9;
      border-radius: 4px;
    }

    .flex-field {
      flex: 2;
    }

    .amount-field {
      flex: 1;
    }

    .add-entry-btn {
      margin: 10px 0 20px 0;
    }

    .balance-info {
      background: #e3f2fd;
      padding: 15px;
      border-radius: 4px;
      margin-top: 20px;
    }

    .balance-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-size: 16px;
    }

    .balance-row.balanced {
      color: #4caf50;
      font-weight: bold;
    }

    .balance-row.unbalanced {
      color: #f44336;
      font-weight: bold;
    }

    .amount {
      font-weight: 600;
    }
  `]
})
export class JournalFormComponent implements OnInit {
  journalForm: FormGroup;
  companies: Company[] = [];
  ledgers: Ledger[] = [];

  constructor(
    private fb: FormBuilder,
    private journalService: JournalService,
    private ledgerService: LedgerService,
    private companyService: CompanyService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<JournalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { journal?: Journal }
  ) {
    this.journalForm = this.fb.group({
      companyId: [null, Validators.required],
      date: [new Date(), Validators.required],
      narration: ['', Validators.required],
      entries: this.fb.array([])
    });
  }

  get entries(): FormArray {
    return this.journalForm.get('entries') as FormArray;
  }

  ngOnInit(): void {
    this.loadCompanies();
    
    // Initialize with two empty entries
    if (!this.data.journal) {
      this.addEntry();
      this.addEntry();
    } else {
      // Load existing journal data
      this.journalForm.patchValue({
        companyId: this.data.journal.company?.id,
        date: new Date(this.data.journal.date!),
        narration: this.data.journal.narration
      });
      
      if (this.data.journal.entries) {
        this.data.journal.entries.forEach(entry => {
          this.entries.push(this.fb.group({
            ledgerId: [entry.ledger?.id, Validators.required],
            debit: [entry.debit || 0],
            credit: [entry.credit || 0],
            description: [entry.description || '']
          }));
        });
      }
      
      if (this.data.journal.company?.id) {
        this.loadLedgers(this.data.journal.company.id);
      }
    }
  }

  loadCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.snackBar.open('Failed to load companies', 'Close', { duration: 3000 });
      }
    });
  }

  onCompanyChange(): void {
    const companyId = this.journalForm.get('companyId')?.value;
    if (companyId) {
      this.loadLedgers(companyId);
    }
  }

  loadLedgers(companyId: number): void {
    this.ledgerService.getLedgersByCompany(companyId).subscribe({
      next: (ledgers) => {
        this.ledgers = ledgers;
      },
      error: (error) => {
        console.error('Error loading ledgers:', error);
        this.snackBar.open('Failed to load ledgers', 'Close', { duration: 3000 });
      }
    });
  }

  addEntry(): void {
    const entry = this.fb.group({
      ledgerId: [null, Validators.required],
      debit: [0],
      credit: [0],
      description: ['']
    });
    this.entries.push(entry);
  }

  removeEntry(index: number): void {
    this.entries.removeAt(index);
  }

  getTotalDebit(): number {
    return this.entries.controls.reduce((sum, entry) => {
      return sum + (parseFloat(entry.get('debit')?.value) || 0);
    }, 0);
  }

  getTotalCredit(): number {
    return this.entries.controls.reduce((sum, entry) => {
      return sum + (parseFloat(entry.get('credit')?.value) || 0);
    }, 0);
  }

  getDifference(): number {
    return Math.abs(this.getTotalDebit() - this.getTotalCredit());
  }

  isBalanced(): boolean {
    const diff = this.getDifference();
    return diff < 0.01; // Allow for small floating point differences
  }

  onSubmit(): void {
    if (this.journalForm.valid && this.isBalanced()) {
      const formValue = this.journalForm.value;
      const journalData = {
        company: { id: formValue.companyId },
        date: formValue.date,
        narration: formValue.narration,
        entries: formValue.entries.map((entry: any) => ({
          ledger: { id: entry.ledgerId },
          debit: parseFloat(entry.debit) || 0,
          credit: parseFloat(entry.credit) || 0,
          description: entry.description || ''
        }))
      };

      if (this.data.journal) {
        this.journalService.updateJournal(this.data.journal.id!, journalData).subscribe({
          next: (journal) => {
            this.snackBar.open('Journal entry updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(journal);
          },
          error: (error) => {
            console.error('Error updating journal:', error);
            this.snackBar.open(error.error?.message || 'Failed to update journal entry', 'Close', { duration: 3000 });
          }
        });
      } else {
        this.journalService.createJournal(journalData).subscribe({
          next: (journal) => {
            this.snackBar.open('Journal entry created successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(journal);
          },
          error: (error) => {
            console.error('Error creating journal:', error);
            this.snackBar.open(error.error?.message || 'Failed to create journal entry', 'Close', { duration: 3000 });
          }
        });
      }
    } else if (!this.isBalanced()) {
      this.snackBar.open('Journal entries must be balanced (Total Debit = Total Credit)', 'Close', { duration: 3000 });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
