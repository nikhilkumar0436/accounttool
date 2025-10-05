import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Journal } from '../../shared/models/journal.model';

const API_URL = 'http://localhost:8080/api/journals';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  constructor(private http: HttpClient) {}

  getAllJournals(): Observable<Journal[]> {
    return this.http.get<Journal[]>(API_URL);
  }

  getJournalsByCompany(companyId: number): Observable<Journal[]> {
    return this.http.get<Journal[]>(`${API_URL}/company/${companyId}`);
  }

  getJournalById(id: number): Observable<Journal> {
    return this.http.get<Journal>(`${API_URL}/${id}`);
  }

  createJournal(journal: Journal): Observable<Journal> {
    return this.http.post<Journal>(API_URL, journal);
  }

  deleteJournal(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
}
