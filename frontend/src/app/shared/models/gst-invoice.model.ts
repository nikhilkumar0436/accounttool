import { Company } from './company.model';
import { Ledger } from './ledger.model';

export interface GSTInvoice {
  id?: number;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceType: InvoiceType;
  company: Company;
  partyLedger: Ledger;
  partyGstin?: string;
  partyState?: string;
  placeOfSupply?: string;
  items: GSTInvoiceItem[];
  taxableAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  totalAmount?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GSTInvoiceItem {
  id?: number;
  description: string;
  hsnCode?: string;
  quantity: number;
  unit?: string;
  ratePerUnit: number;
  taxableValue: number;
  gstRate: number;
  cgstRate?: number;
  sgstRate?: number;
  igstRate?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  totalAmount?: number;
}

export enum InvoiceType {
  SALES = 'SALES',
  PURCHASE = 'PURCHASE'
}
