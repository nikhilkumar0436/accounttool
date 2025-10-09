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
import { GSTInvoiceService } from '../services/gst-invoice.service';
import { LedgerService } from '../../ledger/services/ledger.service';
import { CompanyService } from '../../company/services/company.service';
import { GSTCalculationService } from '../services/gst-calculation.service';
import { GSTInvoice } from '../../shared/models/gst-invoice.model';
import { Company } from '../../shared/models/company.model';
import { Ledger } from '../../shared/models/ledger.model';

@Component({
  selector: 'app-invoice-form',
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
    <h2 mat-dialog-title>{{ data.invoice ? 'Edit' : 'Create' }} {{ data.invoiceType === 'SALES' ? 'Sales' : 'Purchase' }} Invoice</h2>
    <mat-dialog-content>
      <form [formGroup]="invoiceForm">
        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Company</mat-label>
            <mat-select formControlName="companyId" required (selectionChange)="onCompanyChange()">
              <mat-option *ngFor="let company of companies" [value]="company.id">
                {{ company.name }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="invoiceForm.get('companyId')?.hasError('required')">
              Company is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>{{ data.invoiceType === 'SALES' ? 'Customer' : 'Supplier' }}</mat-label>
            <mat-select formControlName="partyId" required>
              <mat-option *ngFor="let party of parties" [value]="party.id">
                {{ party.name }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="invoiceForm.get('partyId')?.hasError('required')">
              Party is required
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Invoice Number</mat-label>
            <input matInput formControlName="invoiceNumber" placeholder="INV-001" required>
            <mat-error *ngIf="invoiceForm.get('invoiceNumber')?.hasError('required')">
              Invoice number is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Invoice Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="invoiceDate" required>
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="invoiceForm.get('invoiceDate')?.hasError('required')">
              Date is required
            </mat-error>
          </mat-form-field>
        </div>

        <h3>Invoice Items</h3>
        <div formArrayName="items">
          <div *ngFor="let item of items.controls; let i = index" [formGroupName]="i" class="item-row">
            <mat-form-field appearance="outline" class="item-desc">
              <mat-label>Description</mat-label>
              <input matInput formControlName="description" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="item-hsn">
              <mat-label>HSN/SAC</mat-label>
              <input matInput formControlName="hsnCode">
            </mat-form-field>

            <mat-form-field appearance="outline" class="item-qty">
              <mat-label>Quantity</mat-label>
              <input matInput type="number" formControlName="quantity" (input)="calculateItemTotal(i)" min="1" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="item-price">
              <mat-label>Unit Price</mat-label>
              <input matInput type="number" formControlName="ratePerUnit" (input)="calculateItemTotal(i)" step="0.01" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="item-gst">
              <mat-label>GST %</mat-label>
              <mat-select formControlName="gstRate" (selectionChange)="calculateItemTotal(i)" required>
                <mat-option [value]="0">0%</mat-option>
                <mat-option [value]="5">5%</mat-option>
                <mat-option [value]="12">12%</mat-option>
                <mat-option [value]="18">18%</mat-option>
                <mat-option [value]="28">28%</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="item-total">
              <mat-label>Total</mat-label>
              <input matInput type="number" formControlName="totalAmount" readonly>
            </mat-form-field>

            <button mat-icon-button color="warn" type="button" (click)="removeItem(i)" *ngIf="items.length > 1">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

        <button mat-raised-button type="button" (click)="addItem()" class="add-item-btn">
          <mat-icon>add</mat-icon>
          Add Item
        </button>

        <div class="summary-section">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span class="amount">₹{{ getSubtotal() | number:'1.2-2' }}</span>
          </div>
          <div class="summary-row tax-row" *ngIf="isIntraState()">
            <span>CGST ({{ getTotalGstRate() / 2 }}%):</span>
            <span class="amount">₹{{ getCGST() | number:'1.2-2' }}</span>
          </div>
          <div class="summary-row tax-row" *ngIf="isIntraState()">
            <span>SGST ({{ getTotalGstRate() / 2 }}%):</span>
            <span class="amount">₹{{ getSGST() | number:'1.2-2' }}</span>
          </div>
          <div class="summary-row tax-row" *ngIf="!isIntraState()">
            <span>IGST ({{ getTotalGstRate() }}%):</span>
            <span class="amount">₹{{ getIGST() | number:'1.2-2' }}</span>
          </div>
          <div class="summary-row total-row">
            <span><strong>Grand Total:</strong></span>
            <span class="amount"><strong>₹{{ getGrandTotal() | number:'1.2-2' }}</strong></span>
          </div>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!invoiceForm.valid">
        {{ data.invoice ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 800px;
      max-width: 1000px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .form-row {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }

    .half-width {
      flex: 1;
    }

    h3 {
      margin: 25px 0 15px 0;
      color: #333;
    }

    .item-row {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      margin-bottom: 15px;
      padding: 15px;
      background: #f9f9f9;
      border-radius: 4px;
    }

    .item-desc {
      flex: 3;
    }

    .item-hsn {
      flex: 1.5;
    }

    .item-qty,
    .item-price,
    .item-gst,
    .item-total {
      flex: 1;
    }

    .add-item-btn {
      margin: 10px 0 20px 0;
    }

    .summary-section {
      background: #e3f2fd;
      padding: 20px;
      border-radius: 4px;
      margin-top: 25px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 16px;
    }

    .summary-row.tax-row {
      color: #1976d2;
      padding-left: 20px;
    }

    .summary-row.total-row {
      border-top: 2px solid #1976d2;
      margin-top: 10px;
      padding-top: 15px;
      font-size: 18px;
    }

    .amount {
      font-weight: 600;
      min-width: 120px;
      text-align: right;
    }
  `]
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm: FormGroup;
  companies: Company[] = [];
  parties: Ledger[] = [];
  selectedCompany: Company | null = null;

  constructor(
    private fb: FormBuilder,
    private invoiceService: GSTInvoiceService,
    private ledgerService: LedgerService,
    private companyService: CompanyService,
    private gstCalculationService: GSTCalculationService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<InvoiceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { invoice?: GSTInvoice, invoiceType: string }
  ) {
    this.invoiceForm = this.fb.group({
      companyId: [null, Validators.required],
      partyId: [null, Validators.required],
      invoiceNumber: ['', Validators.required],
      invoiceDate: [new Date(), Validators.required],
      items: this.fb.array([])
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.loadCompanies();
    
    if (!this.data.invoice) {
      this.addItem();
    } else {
      // Load existing invoice data
      this.invoiceForm.patchValue({
        companyId: this.data.invoice.company?.id,
        partyId: this.data.invoice.partyLedger?.id,
        invoiceNumber: this.data.invoice.invoiceNumber,
        invoiceDate: new Date(this.data.invoice.invoiceDate!)
      });
      
      if (this.data.invoice.items) {
        this.data.invoice.items.forEach(item => {
          this.items.push(this.fb.group({
            description: [item.description, Validators.required],
            hsnCode: [item.hsnCode || ''],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            ratePerUnit: [item.ratePerUnit, [Validators.required, Validators.min(0)]],
            gstRate: [item.gstRate, Validators.required],
            totalAmount: [item.totalAmount]
          }));
        });
      }
      
      if (this.data.invoice.company?.id) {
        this.loadParties(this.data.invoice.company.id);
        this.loadCompanyDetails(this.data.invoice.company.id);
      }
    }
  }

  loadCompanies(): void {
    this.companyService.getAllCompanies().subscribe({
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
    const companyId = this.invoiceForm.get('companyId')?.value;
    if (companyId) {
      this.loadParties(companyId);
      this.loadCompanyDetails(companyId);
      // Recalculate GST for all items
      for (let i = 0; i < this.items.length; i++) {
        this.calculateItemTotal(i);
      }
    }
  }

  loadCompanyDetails(companyId: number): void {
    const company = this.companies.find(c => c.id === companyId);
    if (company) {
      this.selectedCompany = company;
    }
  }

  loadParties(companyId: number): void {
    this.ledgerService.getLedgersByCompany(companyId).subscribe({
      next: (ledgers) => {
        // Filter for party ledgers (typically Asset or Liability type, and GST applicable)
        this.parties = ledgers.filter(l => l.gstApplicable);
      },
      error: (error) => {
        console.error('Error loading parties:', error);
        this.snackBar.open('Failed to load parties', 'Close', { duration: 3000 });
      }
    });
  }

  addItem(): void {
    const item = this.fb.group({
      description: ['', Validators.required],
      hsnCode: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      ratePerUnit: [0, [Validators.required, Validators.min(0)]],
      gstRate: [18, Validators.required],
      totalAmount: [0]
    });
    this.items.push(item);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  calculateItemTotal(index: number): void {
    const item = this.items.at(index);
    const quantity = item.get('quantity')?.value || 0;
    const ratePerUnit = item.get('ratePerUnit')?.value || 0;
    const gstRate = item.get('gstRate')?.value || 0;
    
    const subtotal = quantity * ratePerUnit;
    const gstAmount = (subtotal * gstRate) / 100;
    const total = subtotal + gstAmount;
    
    item.patchValue({ totalAmount: total }, { emitEvent: false });
  }

  getSubtotal(): number {
    return this.items.controls.reduce((sum, item) => {
      const qty = item.get('quantity')?.value || 0;
      const price = item.get('ratePerUnit')?.value || 0;
      return sum + (qty * price);
    }, 0);
  }

  getTotalGstRate(): number {
    // Get weighted average GST rate
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    
    const weightedGst = this.items.controls.reduce((sum, item) => {
      const qty = item.get('quantity')?.value || 0;
      const price = item.get('ratePerUnit')?.value || 0;
      const gstRate = item.get('gstRate')?.value || 0;
      const itemSubtotal = qty * price;
      return sum + (itemSubtotal * gstRate);
    }, 0);
    
    return weightedGst / subtotal;
  }

  isIntraState(): boolean {
    // Check if company and party are in the same state
    if (!this.selectedCompany) return true;
    
    const partyId = this.invoiceForm.get('partyId')?.value;
    const party = this.parties.find(p => p.id === partyId);
    
    // For simplicity, assume intra-state if we can't determine
    // In real app, you'd check company.state === party.state
    return true; // Default to intra-state
  }

  getCGST(): number {
    const subtotal = this.getSubtotal();
    const gstRate = this.getTotalGstRate();
    return (subtotal * (gstRate / 2)) / 100;
  }

  getSGST(): number {
    return this.getCGST(); // SGST = CGST for intra-state
  }

  getIGST(): number {
    const subtotal = this.getSubtotal();
    const gstRate = this.getTotalGstRate();
    return (subtotal * gstRate) / 100;
  }

  getGrandTotal(): number {
    return this.items.controls.reduce((sum, item) => {
      return sum + (item.get('totalAmount')?.value || 0);
    }, 0);
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      const formValue = this.invoiceForm.value;
      const invoiceData = {
        company: { id: formValue.companyId },
        partyLedger: { id: formValue.partyId },
        invoiceType: this.data.invoiceType,
        invoiceNumber: formValue.invoiceNumber,
        invoiceDate: formValue.invoiceDate,
        subtotal: this.getSubtotal(),
        cgst: this.isIntraState() ? this.getCGST() : 0,
        sgst: this.isIntraState() ? this.getSGST() : 0,
        igst: !this.isIntraState() ? this.getIGST() : 0,
        totalAmount: this.getGrandTotal(),
        items: formValue.items.map((item: any) => ({
          description: item.description,
          hsnCode: item.hsnCode || null,
          quantity: parseInt(item.quantity),
          ratePerUnit: parseFloat(item.ratePerUnit),
          gstRate: parseFloat(item.gstRate),
          totalAmount: parseFloat(item.totalAmount)
        }))
      };

      if (this.data.invoice) {
        this.invoiceService.updateInvoice(this.data.invoice.id!, invoiceData).subscribe({
          next: (invoice) => {
            this.snackBar.open('Invoice updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(invoice);
          },
          error: (error) => {
            console.error('Error updating invoice:', error);
            this.snackBar.open(error.error?.message || 'Failed to update invoice', 'Close', { duration: 3000 });
          }
        });
      } else {
        this.invoiceService.createInvoice(invoiceData).subscribe({
          next: (invoice) => {
            this.snackBar.open('Invoice created successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(invoice);
          },
          error: (error) => {
            console.error('Error creating invoice:', error);
            this.snackBar.open(error.error?.message || 'Failed to create invoice', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
