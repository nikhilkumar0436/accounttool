export interface Company {
  id?: number;
  name: string;
  gstin: string;
  pan?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  phone?: string;
  email?: string;
  financialYearStart?: string;
  financialYearEnd?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
