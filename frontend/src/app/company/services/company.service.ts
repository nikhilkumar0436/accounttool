import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../../shared/models/company.model';

const API_URL = 'http://localhost:8080/api/companies';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(API_URL);
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(`${API_URL}/${id}`);
  }

  createCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(API_URL, company);
  }

  updateCompany(id: number, company: Company): Observable<Company> {
    return this.http.put<Company>(`${API_URL}/${id}`, company);
  }

  deleteCompany(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }
}
