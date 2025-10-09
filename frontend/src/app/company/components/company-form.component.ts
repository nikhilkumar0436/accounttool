import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CompanyService } from '../services/company.service';
import { Company } from '../../shared/models/company.model';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Company' : 'Add Company' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="companyForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Company Name</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="companyForm.get('name')?.hasError('required')">
            Company name is required
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>GSTIN</mat-label>
          <input matInput formControlName="gstin" required>
          <mat-hint>Format: 22AAAAA0000A1Z5</mat-hint>
          <mat-error *ngIf="companyForm.get('gstin')?.hasError('required')">
            GSTIN is required
          </mat-error>
          <mat-error *ngIf="companyForm.get('gstin')?.hasError('pattern')">
            Invalid GSTIN format
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>PAN</mat-label>
          <input matInput formControlName="pan">
          <mat-hint>Format: AAAAA9999A</mat-hint>
          <mat-error *ngIf="companyForm.get('pan')?.hasError('pattern')">
            Invalid PAN format
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Address</mat-label>
          <input matInput formControlName="address">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>City</mat-label>
          <input matInput formControlName="city">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>State</mat-label>
          <input matInput formControlName="state">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>PIN Code</mat-label>
          <input matInput formControlName="pinCode">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email">
          <mat-error *ngIf="companyForm.get('email')?.hasError('email')">
            Invalid email format
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Financial Year Start</mat-label>
          <input matInput formControlName="financialYearStart" placeholder="YYYY-MM-DD">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Financial Year End</mat-label>
          <input matInput formControlName="financialYearEnd" placeholder="YYYY-MM-DD">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="!companyForm.valid" (click)="onSave()">
        Save
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 10px;
    }
  `]
})
export class CompanyFormComponent implements OnInit {
  companyForm: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private dialogRef: MatDialogRef<CompanyFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Company
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      gstin: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
      ]],
      pan: ['', [
        Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
      ]],
      address: [''],
      city: [''],
      state: [''],
      pinCode: [''],
      phone: [''],
      email: ['', Validators.email],
      financialYearStart: [''],
      financialYearEnd: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEdit = true;
      this.companyForm.patchValue(this.data);
    }
  }

  onSave(): void {
    if (this.companyForm.valid) {
      const company: Company = this.companyForm.value;
      
      if (this.isEdit && this.data.id) {
        this.companyService.updateCompany(this.data.id, company).subscribe({
          next: () => {
            this.snackBar.open('Company updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            const errorMessage = this.extractErrorMessage(error);
            this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
          }
        });
      } else {
        this.companyService.createCompany(company).subscribe({
          next: () => {
            this.snackBar.open('Company created successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            const errorMessage = this.extractErrorMessage(error);
            this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
          }
        });
      }
    }
  }

  private extractErrorMessage(error: any): string {
    // Check if error has a structured response
    if (error.error) {
      // Check for validation errors
      if (error.error.validationErrors) {
        const validationErrors = error.error.validationErrors;
        const errorMessages = Object.keys(validationErrors)
          .map(key => `${key}: ${validationErrors[key]}`)
          .join(', ');
        return `Validation failed: ${errorMessages}`;
      }
      
      // Check for general error message
      if (error.error.message) {
        return error.error.message;
      }
      
      // Check if error.error is a string
      if (typeof error.error === 'string') {
        return error.error;
      }
    }
    
    // Check for error message at top level
    if (error.message) {
      return error.message;
    }
    
    // Default error message
    return 'Failed to save company. Please try again.';
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
