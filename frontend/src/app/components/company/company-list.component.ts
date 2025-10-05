import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Companies</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="action-buttons">
            <button mat-raised-button color="primary" routerLink="/companies/new">
              <mat-icon>add</mat-icon> New Company
            </button>
          </div>

          <div class="table-container">
            <table mat-table [dataSource]="companies" class="mat-elevation-z8">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let company">{{ company.name }}</td>
              </ng-container>

              <ng-container matColumnDef="gstin">
                <th mat-header-cell *matHeaderCellDef>GSTIN</th>
                <td mat-cell *matCellDef="let company">{{ company.gstin }}</td>
              </ng-container>

              <ng-container matColumnDef="state">
                <th mat-header-cell *matHeaderCellDef>State</th>
                <td mat-cell *matCellDef="let company">{{ company.state }}</td>
              </ng-container>

              <ng-container matColumnDef="pan">
                <th mat-header-cell *matHeaderCellDef>PAN</th>
                <td mat-cell *matCellDef="let company">{{ company.pan }}</td>
              </ng-container>

              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Phone</th>
                <td mat-cell *matCellDef="let company">{{ company.phone }}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let company">
                  <button mat-icon-button color="primary">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .action-buttons {
      margin-bottom: 20px;
    }

    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
    }
  `]
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];
  displayedColumns = ['name', 'gstin', 'state', 'pan', 'phone', 'actions'];

  constructor(
    private companyService: CompanyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getAll().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (error) => {
        console.error('Error loading companies', error);
      }
    });
  }
}
