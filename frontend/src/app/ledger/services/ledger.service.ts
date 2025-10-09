import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ledger } from '../../shared/models/ledger.model';

const API_URL = 'http://localhost:8080/api/ledgers';

@Injectable({
  providedIn: 'root'
})
export class LedgerService {
  constructor(private http: HttpClient) {}

  getAllLedgers(): Observable<Ledger[]> {
    return this.http.get<Ledger[]>(API_URL);
  }

  getLedgersByCompany(companyId: number): Observable<Ledger[]> {
    return this.http.get<Ledger[]>(`${API_URL}/company/${companyId}`);
  }

  getLedgerById(id: number): Observable<Ledger> {
    return this.http.get<Ledger>(`${API_URL}/${id}`);
  }

  createLedger(ledger: Ledger): Observable<Ledger> {
    return this.http.post<Ledger>(API_URL, ledger);
  }

  updateLedger(id: number, ledger: Ledger): Observable<Ledger> {
    return this.http.put<Ledger>(`${API_URL}/${id}`, ledger);
  }

  deleteLedger(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
}
