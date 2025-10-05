import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InvoiceService } from '../../services/invoice.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>New Invoice</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="invoiceForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field class="form-field-half">
                <mat-label>Invoice Number</mat-label>
                <input matInput formControlName="invoiceNumber" required>
              </mat-form-field>

              <mat-form-field class="form-field-half">
                <mat-label>Invoice Type</mat-label>
                <mat-select formControlName="type" required>
                  <mat-option value="SALES">Sales</mat-option>
                  <mat-option value="PURCHASE">Purchase</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field class="form-field-half">
                <mat-label>Invoice Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="invoiceDate" required>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <mat-form-field class="form-field-half">
                <mat-label>Party State</mat-label>
                <input matInput formControlName="partyState" required>
              </mat-form-field>
            </div>

            <h3>Items</h3>
            <div formArrayName="items">
              <div *ngFor="let item of items.controls; let i = index" [formGroupName]="i" class="item-group">
                <div class="form-row">
                  <mat-form-field class="form-field-full-width">
                    <mat-label>Description</mat-label>
                    <input matInput formControlName="description" required>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field class="form-field-quarter">
                    <mat-label>HSN Code</mat-label>
                    <input matInput formControlName="hsnCode">
                  </mat-form-field>

                  <mat-form-field class="form-field-quarter">
                    <mat-label>Quantity</mat-label>
                    <input matInput type="number" formControlName="quantity" required>
                  </mat-form-field>

                  <mat-form-field class="form-field-quarter">
                    <mat-label>Rate</mat-label>
                    <input matInput type="number" formControlName="rate" required>
                  </mat-form-field>

                  <mat-form-field class="form-field-quarter">
                    <mat-label>GST Rate (%)</mat-label>
                    <mat-select formControlName="gstRate" required>
                      <mat-option [value]="0">0%</mat-option>
                      <mat-option [value]="5">5%</mat-option>
                      <mat-option [value]="12">12%</mat-option>
                      <mat-option [value]="18">18%</mat-option>
                      <mat-option [value]="28">28%</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <button mat-icon-button color="warn" type="button" (click)="removeItem(i)" *ngIf="items.length > 1">
                  <mat-icon>delete</mat-icon>
                </button>
                <hr>
              </div>
            </div>

            <button mat-button type="button" (click)="addItem()">
              <mat-icon>add</mat-icon> Add Item
            </button>

            <div class="action-buttons">
              <button mat-raised-button color="primary" type="submit" [disabled]="!invoiceForm.valid">
                Save Invoice
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

    .form-row {
      display: flex;
      gap: 15px;
      width: 100%;
    }

    .form-field-half {
      flex: 1;
    }

    .form-field-quarter {
      flex: 1;
    }

    .form-field-full-width {
      width: 100%;
    }

    .item-group {
      border: 1px solid #ddd;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 4px;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class InvoiceFormComponent {
  invoiceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    const currentUser = this.authService.getCurrentUser();
    
    this.invoiceForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
      type: ['SALES', Validators.required],
      invoiceDate: [new Date(), Validators.required],
      companyId: [currentUser?.companyId || 1],
      partyLedgerId: [1],
      partyState: ['', Validators.required],
      items: this.fb.array([this.createItem()])
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      hsnCode: [''],
      quantity: [1, [Validators.required, Validators.min(0.01)]],
      unit: ['PCS'],
      rate: [0, [Validators.required, Validators.min(0)]],
      gstRate: [18, Validators.required]
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      const formValue = this.invoiceForm.value;
      
      const invoiceData = {
        ...formValue,
        items: formValue.items.map((item: any) => ({
          ...item,
          cgstRate: item.gstRate / 2,
          sgstRate: item.gstRate / 2,
          igstRate: 0
        }))
      };

      this.invoiceService.create(invoiceData).subscribe({
        next: () => {
          this.snackBar.open('Invoice created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/invoices']);
        },
        error: (error) => {
          this.snackBar.open('Error creating invoice: ' + error.error.message, 'Close', { duration: 5000 });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/invoices']);
  }
}
