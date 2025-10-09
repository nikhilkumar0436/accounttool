import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LedgerService } from '../services/ledger.service';
import { Ledger } from '../../shared/models/ledger.model';
import { CompanyService } from '../../company/services/company.service';
import { Company } from '../../shared/models/company.model';

@Component({
  selector: 'app-ledger-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.ledger ? 'Edit Ledger' : 'Create Ledger' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="ledgerForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Company</mat-label>
          <mat-select formControlName="companyId" required>
            <mat-option *ngFor="let company of companies" [value]="company.id">
              {{ company.name }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="ledgerForm.get('companyId')?.hasError('required')">
            Company is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Ledger Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter ledger name" required>
          <mat-error *ngIf="ledgerForm.get('name')?.hasError('required')">
            Ledger name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Ledger Type</mat-label>
          <mat-select formControlName="type" required>
            <mat-option value="ASSET">Asset</mat-option>
            <mat-option value="LIABILITY">Liability</mat-option>
            <mat-option value="INCOME">Income</mat-option>
            <mat-option value="EXPENSE">Expense</mat-option>
            <mat-option value="CAPITAL">Capital</mat-option>
          </mat-select>
          <mat-error *ngIf="ledgerForm.get('type')?.hasError('required')">
            Type is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Opening Balance</mat-label>
          <input matInput type="number" formControlName="openingBalance" placeholder="0.00" step="0.01">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Current Balance</mat-label>
          <input matInput type="number" formControlName="currentBalance" placeholder="0.00" step="0.01">
        </mat-form-field>

        <mat-checkbox formControlName="gstApplicable" class="full-width">
          GST Applicable Party Ledger
        </mat-checkbox>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!ledgerForm.valid">
        {{ data.ledger ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
      max-width: 600px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    mat-checkbox {
      margin: 15px 0;
    }
  `]
})
export class LedgerFormComponent implements OnInit {
  ledgerForm: FormGroup;
  companies: Company[] = [];

  constructor(
    private fb: FormBuilder,
    private ledgerService: LedgerService,
    private companyService: CompanyService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<LedgerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ledger?: Ledger }
  ) {
    this.ledgerForm = this.fb.group({
      companyId: [null, Validators.required],
      name: ['', Validators.required],
      type: ['', Validators.required],
      openingBalance: [0],
      currentBalance: [0],
      gstApplicable: [false]
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
    
    if (this.data.ledger) {
      this.ledgerForm.patchValue({
        companyId: this.data.ledger.company?.id,
        name: this.data.ledger.name,
        type: this.data.ledger.type,
        openingBalance: this.data.ledger.openingBalance,
        currentBalance: this.data.ledger.currentBalance,
        gstApplicable: this.data.ledger.gstApplicable
      });
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

  onSubmit(): void {
    if (this.ledgerForm.valid) {
      const ledgerData = {
        ...this.ledgerForm.value,
        company: { id: this.ledgerForm.value.companyId }
      };

      if (this.data.ledger) {
        this.ledgerService.updateLedger(this.data.ledger.id!, ledgerData).subscribe({
          next: (ledger) => {
            this.snackBar.open('Ledger updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(ledger);
          },
          error: (error) => {
            console.error('Error updating ledger:', error);
            this.snackBar.open(error.error?.message || 'Failed to update ledger', 'Close', { duration: 3000 });
          }
        });
      } else {
        this.ledgerService.createLedger(ledgerData).subscribe({
          next: (ledger) => {
            this.snackBar.open('Ledger created successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(ledger);
          },
          error: (error) => {
            console.error('Error creating ledger:', error);
            this.snackBar.open(error.error?.message || 'Failed to create ledger', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
