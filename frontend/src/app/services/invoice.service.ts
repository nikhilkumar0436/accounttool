import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice, InvoiceType, InvoiceStatus } from '../models/invoice.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient) {}

  create(invoice: any): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  getByCompany(companyId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/company/${companyId}`);
  }

  getByType(companyId: number, type: InvoiceType): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/company/${companyId}/type/${type}`);
  }

  getById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, status: InvoiceStatus): Observable<Invoice> {
    const params = new HttpParams().set('status', status);
    return this.http.put<Invoice>(`${this.apiUrl}/${id}/status`, null, { params });
  }

  getGstr1Data(companyId: number, startDate: string, endDate: string): Observable<Invoice[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Invoice[]>(`${this.apiUrl}/company/${companyId}/gstr1`, { params });
  }
}
