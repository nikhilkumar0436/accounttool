export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  companyId?: number;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  MANAGER = 'MANAGER',
  USER = 'USER'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
  companyId?: number;
}
