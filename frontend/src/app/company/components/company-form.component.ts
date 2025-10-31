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
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>GSTIN</mat-label>
          <input matInput formControlName="gstin" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>PAN</mat-label>
          <input matInput formControlName="pan">
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
      gstin: ['', Validators.required],
      pan: [''],
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
          error: () => this.snackBar.open('Failed to update company', 'Close', { duration: 3000 })
        });
      } else {
        this.companyService.createCompany(company).subscribe({
          next: () => {
            this.snackBar.open('Company created successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: () => this.snackBar.open('Failed to create company', 'Close', { duration: 3000 })
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
