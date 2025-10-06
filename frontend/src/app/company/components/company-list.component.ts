import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyService } from '../services/company.service';
import { Company } from '../../shared/models/company.model';
import { CompanyFormComponent } from './company-form.component';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <div class="header-content">
          <mat-card-title>Companies</mat-card-title>
          <button mat-raised-button color="primary" (click)="openDialog()">
            <mat-icon>add</mat-icon> Add Company
          </button>
        </div>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="companies" class="mat-elevation-z8">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let company">{{company.name}}</td>
          </ng-container>

          <ng-container matColumnDef="gstin">
            <th mat-header-cell *matHeaderCellDef>GSTIN</th>
            <td mat-cell *matCellDef="let company">{{company.gstin}}</td>
          </ng-container>

          <ng-container matColumnDef="state">
            <th mat-header-cell *matHeaderCellDef>State</th>
            <td mat-cell *matCellDef="let company">{{company.state}}</td>
          </ng-container>

          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef>Phone</th>
            <td mat-cell *matCellDef="let company">{{company.phone}}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let company">
              <button mat-icon-button (click)="editCompany(company)" matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteCompany(company.id)" matTooltip="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      margin: 20px;
    }

    mat-card-header {
      margin-bottom: 20px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 16px;
    }

    mat-card-title {
      margin: 0;
      flex: 1;
    }

    table {
      width: 100%;
    }
  `]
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  displayedColumns: string[] = ['name', 'gstin', 'state', 'phone', 'actions'];

  constructor(
    private companyService: CompanyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getAllCompanies().subscribe({
      next: (data) => this.companies = data,
      error: (error) => this.snackBar.open('Failed to load companies', 'Close', { duration: 3000 })
    });
  }

  openDialog(company?: Company): void {
    const dialogRef = this.dialog.open(CompanyFormComponent, {
      width: '600px',
      data: company
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCompanies();
      }
    });
  }

  editCompany(company: Company): void {
    this.openDialog(company);
  }

  deleteCompany(id?: number): void {
    if (id && confirm('Are you sure you want to delete this company?')) {
      this.companyService.deleteCompany(id).subscribe({
        next: () => {
          this.snackBar.open('Company deleted successfully', 'Close', { duration: 3000 });
          this.loadCompanies();
        },
        error: (error) => this.snackBar.open('Failed to delete company', 'Close', { duration: 3000 })
      });
    }
  }
}
