import { Company } from './company.model';

export interface Ledger {
  id?: number;
  name: string;
  type: LedgerType;
  company: Company;
  openingBalance?: number;
  currentBalance?: number;
  description?: string;
  gstin?: string;
  isGstApplicable?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum LedgerType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  CAPITAL = 'CAPITAL'
}
