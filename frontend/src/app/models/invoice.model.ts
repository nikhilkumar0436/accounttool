export interface Invoice {
  id?: number;
  invoiceNumber: string;
  type: InvoiceType;
  invoiceDate: Date;
  companyId: number;
  partyLedgerId: number;
  partyGstin?: string;
  partyAddress?: string;
  partyState?: string;
  subtotal: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
  remarks?: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
}

export enum InvoiceType {
  SALES = 'SALES',
  PURCHASE = 'PURCHASE'
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  CANCELLED = 'CANCELLED'
}

export interface InvoiceItem {
  id?: number;
  productId?: number;
  description: string;
  hsnCode?: string;
  quantity: number;
  unit?: string;
  rate: number;
  amount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalAmount: number;
}
