import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>New Company</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="companyForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="form-field-full-width">
              <mat-label>Company Name</mat-label>
              <input matInput formControlName="name" required>
            </mat-form-field>

            <mat-form-field class="form-field-full-width">
              <mat-label>GSTIN</mat-label>
              <input matInput formControlName="gstin" required maxlength="15">
              <mat-hint>15 characters GSTIN number</mat-hint>
            </mat-form-field>

            <mat-form-field class="form-field-full-width">
              <mat-label>PAN</mat-label>
              <input matInput formControlName="pan" required maxlength="10">
            </mat-form-field>

            <mat-form-field class="form-field-full-width">
              <mat-label>Address</mat-label>
              <textarea matInput formControlName="address" required rows="3"></textarea>
            </mat-form-field>

            <mat-form-field class="form-field-full-width">
              <mat-label>City</mat-label>
              <input matInput formControlName="city" required>
            </mat-form-field>

            <mat-form-field class="form-field-full-width">
              <mat-label>State</mat-label>
              <input matInput formControlName="state" required>
            </mat-form-field>

            <mat-form-field class="form-field-full-width">
              <mat-label>Pincode</mat-label>
              <input matInput formControlName="pincode" required maxlength="6">
            </mat-form-field>

            <mat-form-field class="form-field-full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email">
            </mat-form-field>

            <mat-form-field class="form-field-full-width">
              <mat-label>Phone</mat-label>
              <input matInput formControlName="phone">
            </mat-form-field>

            <div class="action-buttons">
              <button mat-raised-button color="primary" type="submit" [disabled]="!companyForm.valid">
                Save
              </button>
              <button mat-raised-button type="button" (click)="cancel()">
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class CompanyFormComponent {
  companyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      gstin: ['', [Validators.required, Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]],
      pan: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      email: ['', Validators.email],
      phone: ['']
    });
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      this.companyService.create(this.companyForm.value).subscribe({
        next: () => {
          this.snackBar.open('Company created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/companies']);
        },
        error: (error) => {
          this.snackBar.open('Error creating company: ' + error.error.message, 'Close', { duration: 5000 });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/companies']);
  }
}
