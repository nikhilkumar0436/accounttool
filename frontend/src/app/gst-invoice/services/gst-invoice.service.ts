import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GSTInvoice, InvoiceType } from '../../shared/models/gst-invoice.model';

const API_URL = 'http://localhost:8080/api/gst-invoices';

@Injectable({
  providedIn: 'root'
})
export class GSTInvoiceService {
  constructor(private http: HttpClient) {}

  getAllInvoices(): Observable<GSTInvoice[]> {
    return this.http.get<GSTInvoice[]>(API_URL);
  }

  getInvoicesByCompany(companyId: number): Observable<GSTInvoice[]> {
    return this.http.get<GSTInvoice[]>(`${API_URL}/company/${companyId}`);
  }

  getInvoicesByCompanyAndType(companyId: number, type: InvoiceType): Observable<GSTInvoice[]> {
    return this.http.get<GSTInvoice[]>(`${API_URL}/company/${companyId}/type/${type}`);
  }

  getInvoiceById(id: number): Observable<GSTInvoice> {
    return this.http.get<GSTInvoice>(`${API_URL}/${id}`);
  }

  createInvoice(invoice: GSTInvoice): Observable<GSTInvoice> {
    return this.http.post<GSTInvoice>(API_URL, invoice);
  }

  updateInvoice(id: number, invoice: GSTInvoice): Observable<GSTInvoice> {
    return this.http.put<GSTInvoice>(`${API_URL}/${id}`, invoice);
  }

  deleteInvoice(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
}
