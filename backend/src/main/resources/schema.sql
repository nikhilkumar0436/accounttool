-- Database Schema for AccountTool GST Management System
-- This file documents the database structure
-- Tables are automatically created by Hibernate/JPA

-- Note: This is a reference schema. The actual tables are created by Hibernate.
-- Run this only if you want to create the schema manually.

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- User-Role mapping table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gstin VARCHAR(15) UNIQUE NOT NULL,
    pan VARCHAR(10) UNIQUE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pin_code VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(100),
    financial_year_start VARCHAR(10),
    financial_year_end VARCHAR(10),
    created_by BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Ledgers table
CREATE TABLE IF NOT EXISTS ledgers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    company_id BIGINT NOT NULL,
    opening_balance DECIMAL(19,2) DEFAULT 0,
    current_balance DECIMAL(19,2) DEFAULT 0,
    description TEXT,
    gstin VARCHAR(15),
    is_gst_applicable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Journals table
CREATE TABLE IF NOT EXISTS journals (
    id BIGSERIAL PRIMARY KEY,
    journal_number VARCHAR(50) UNIQUE NOT NULL,
    journal_date DATE NOT NULL,
    company_id BIGINT NOT NULL,
    narration TEXT,
    total_debit DECIMAL(19,2) DEFAULT 0,
    total_credit DECIMAL(19,2) DEFAULT 0,
    created_by BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Journal Entries table
CREATE TABLE IF NOT EXISTS journal_entries (
    id BIGSERIAL PRIMARY KEY,
    journal_id BIGINT NOT NULL,
    ledger_id BIGINT NOT NULL,
    debit DECIMAL(19,2) DEFAULT 0,
    credit DECIMAL(19,2) DEFAULT 0,
    description TEXT,
    FOREIGN KEY (journal_id) REFERENCES journals(id) ON DELETE CASCADE,
    FOREIGN KEY (ledger_id) REFERENCES ledgers(id)
);

-- GST Invoices table
CREATE TABLE IF NOT EXISTS gst_invoices (
    id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    invoice_type VARCHAR(20) NOT NULL,
    company_id BIGINT NOT NULL,
    party_ledger_id BIGINT NOT NULL,
    party_gstin VARCHAR(15),
    party_state VARCHAR(100),
    place_of_supply VARCHAR(100),
    taxable_amount DECIMAL(19,2) DEFAULT 0,
    cgst_amount DECIMAL(19,2) DEFAULT 0,
    sgst_amount DECIMAL(19,2) DEFAULT 0,
    igst_amount DECIMAL(19,2) DEFAULT 0,
    total_amount DECIMAL(19,2) DEFAULT 0,
    notes TEXT,
    created_by BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (party_ledger_id) REFERENCES ledgers(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- GST Invoice Items table
CREATE TABLE IF NOT EXISTS gst_invoice_items (
    id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    description VARCHAR(255) NOT NULL,
    hsn_code VARCHAR(20),
    quantity DECIMAL(19,2) DEFAULT 1,
    unit VARCHAR(20) DEFAULT 'NOS',
    rate_per_unit DECIMAL(19,2) DEFAULT 0,
    taxable_value DECIMAL(19,2) DEFAULT 0,
    gst_rate DECIMAL(5,2) DEFAULT 0,
    cgst_rate DECIMAL(5,2) DEFAULT 0,
    sgst_rate DECIMAL(5,2) DEFAULT 0,
    igst_rate DECIMAL(5,2) DEFAULT 0,
    cgst_amount DECIMAL(19,2) DEFAULT 0,
    sgst_amount DECIMAL(19,2) DEFAULT 0,
    igst_amount DECIMAL(19,2) DEFAULT 0,
    total_amount DECIMAL(19,2) DEFAULT 0,
    FOREIGN KEY (invoice_id) REFERENCES gst_invoices(id) ON DELETE CASCADE
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
('ROLE_ADMIN', 'Administrator with full access'),
('ROLE_ACCOUNTANT', 'Accountant with accounting access'),
('ROLE_USER', 'Regular user with read access')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_companies_gstin ON companies(gstin);
CREATE INDEX IF NOT EXISTS idx_ledgers_company ON ledgers(company_id);
CREATE INDEX IF NOT EXISTS idx_ledgers_name ON ledgers(name);
CREATE INDEX IF NOT EXISTS idx_journals_company ON journals(company_id);
CREATE INDEX IF NOT EXISTS idx_journals_date ON journals(journal_date);
CREATE INDEX IF NOT EXISTS idx_journals_number ON journals(journal_number);
CREATE INDEX IF NOT EXISTS idx_journal_entries_journal ON journal_entries(journal_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_ledger ON journal_entries(ledger_id);
CREATE INDEX IF NOT EXISTS idx_gst_invoices_company ON gst_invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_gst_invoices_date ON gst_invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_gst_invoices_type ON gst_invoices(invoice_type);
CREATE INDEX IF NOT EXISTS idx_gst_invoices_company_type ON gst_invoices(company_id, invoice_type);
CREATE INDEX IF NOT EXISTS idx_gst_invoices_number ON gst_invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_gst_invoice_items_invoice ON gst_invoice_items(invoice_id);
