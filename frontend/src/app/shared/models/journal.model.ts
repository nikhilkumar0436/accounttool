import { Company } from './company.model';
import { Ledger } from './ledger.model';

export interface Journal {
  id?: number;
  journalNumber: string;
  journalDate: string;
  company: Company;
  narration?: string;
  entries: JournalEntry[];
  totalDebit?: number;
  totalCredit?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JournalEntry {
  id?: number;
  ledger: Ledger;
  debit: number;
  credit: number;
  description?: string;
}
