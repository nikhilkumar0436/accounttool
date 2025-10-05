export interface Company {
  id?: number;
  name: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  pan: string;
  email?: string;
  phone?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
