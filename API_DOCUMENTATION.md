# API Documentation

Complete REST API documentation for AccountTool GST Management System.

Base URL: `http://localhost:8080`

## Authentication

All endpoints (except authentication endpoints) require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### POST /api/auth/login
Login to the system and receive JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "roles": ["ROLE_ADMIN"]
}
```

### POST /api/auth/signup
Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123",
  "email": "john@example.com",
  "fullName": "John Doe",
  "phoneNumber": "+91 9876543210",
  "roles": ["user"]
}
```

**Response:**
```json
{
  "message": "User registered successfully!"
}
```

**Role Options:** `admin`, `accountant`, `user`

---

## Companies API

### GET /api/companies
Get all companies.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": 1,
    "name": "My Business Pvt Ltd",
    "gstin": "27AABCU9603R1ZX",
    "pan": "AABCU9603R",
    "address": "123 Business Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pinCode": "400001",
    "phone": "+91 1234567890",
    "email": "business@example.com",
    "financialYearStart": "2024-04-01",
    "financialYearEnd": "2025-03-31",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

### GET /api/companies/{id}
Get company by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:** Single company object

### POST /api/companies
Create a new company.

**Headers:** `Authorization: Bearer <token>`

**Required Roles:** `ROLE_ACCOUNTANT` or `ROLE_ADMIN`

**Request Body:**
```json
{
  "name": "My Business Pvt Ltd",
  "gstin": "27AABCU9603R1ZX",
  "pan": "AABCU9603R",
  "address": "123 Business Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pinCode": "400001",
  "phone": "+91 1234567890",
  "email": "business@example.com",
  "financialYearStart": "2024-04-01",
  "financialYearEnd": "2025-03-31"
}
```

**Response:** Created company object

### PUT /api/companies/{id}
Update a company.

**Headers:** `Authorization: Bearer <token>`

**Required Roles:** `ROLE_ACCOUNTANT` or `ROLE_ADMIN`

**Request Body:** Same as POST

**Response:** Updated company object

### DELETE /api/companies/{id}
Delete a company.

**Headers:** `Authorization: Bearer <token>`

**Required Roles:** `ROLE_ADMIN`

**Response:** 200 OK

---

## Ledgers API

### GET /api/ledgers
Get all ledgers.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Cash Account",
    "type": "ASSET",
    "company": { "id": 1, "name": "My Business Pvt Ltd" },
    "openingBalance": 10000.00,
    "currentBalance": 15000.00,
    "description": "Cash in hand",
    "isGstApplicable": false,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

### GET /api/ledgers/company/{companyId}
Get all ledgers for a specific company.

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of ledger objects

### GET /api/ledgers/{id}
Get ledger by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:** Single ledger object

### POST /api/ledgers
Create a new ledger.

**Headers:** `Authorization: Bearer <token>`

**Required Roles:** `ROLE_ACCOUNTANT` or `ROLE_ADMIN`

**Request Body:**
```json
{
  "name": "Cash Account",
  "type": "ASSET",
  "company": { "id": 1 },
  "openingBalance": 10000.00,
  "description": "Cash in hand",
  "isGstApplicable": false
}
```

**Ledger Types:** `ASSET`, `LIABILITY`, `INCOME`, `EXPENSE`, `CAPITAL`

**Response:** Created ledger object

### PUT /api/ledgers/{id}
Update a ledger.

**Headers:** `Authorization: Bearer <token>`

**Required Roles:** `ROLE_ACCOUNTANT` or `ROLE_ADMIN`

**Request Body:** Same as POST

**Response:** Updated ledger object

### DELETE /api/ledgers/{id}
Delete a ledger.

**Headers:** `Authorization: Bearer <token>`

**Required Roles:** `ROLE_ADMIN`

**Response:** 200 OK

---

## Journals API

### GET /api/journals
Get all journal entries.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": 1,
    "journalNumber": "JV001",
    "journalDate": "2024-01-15",
    "company": { "id": 1, "name": "My Business Pvt Ltd" },
    "narration": "Opening balance entry",
    "entries": [
      {
        "id": 1,
        "ledger": { "id": 1, "name": "Cash Account" },
        "debit": 10000.00,
        "credit": 0.00,
        "description": "Opening cash"
      },
      {
        "id": 2,
        "ledger": { "id": 5, "name": "Capital Account" },
        "debit": 0.00,
        "credit": 10000.00,
        "description": "Owner's capital"
      }
    ],
    "totalDebit": 10000.00,
    "totalCredit": 10000.00,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

### GET /api/journals/company/{companyId}
Get all journals for a specific company.

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of journal objects

### GET /api/journals/{id}
Get journal by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:** Single journal object

### POST /api/journals
Create a new journal entry.

**Headers:** `Authorization: Bearer <token>`

**Required Roles:** `ROLE_ACCOUNTANT` or `ROLE_ADMIN`

**Request Body:**
```json
{
  "journalNumber": "JV001",
  "journalDate": "2024-01-15",
  "company": { "id": 1 },
  "narration": "Opening balance entry",
  "entries": [
    {
      "ledger": { "id": 1 },
      "debit": 10000.00,
      "credit": 0.00,
      "description": "Opening cash"
    },
    {
      "ledger": { "id": 5 },
      "debit": 0.00,
      "credit": 10000.00,
      "description": "Owner's capital"
    }
  ]
}
```

**Note:** Total debits must equal total credits. The system validates this automatically.

**Response:** Created journal object or error if not balanced

### DELETE /api/journals/{id}
Delete a journal entry.

**Headers:** `Authorization: Bearer <token>`

**Required Roles:** `ROLE_ADMIN`

**Response:** 200 OK

---

## GST Invoices API

### GET /api/gst-invoices
Get all GST invoices.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": 1,
    "invoiceNumber": "INV001",
    "invoiceDate": "2024-01-15",
    "invoiceType": "SALES",
    "company": { "id": 1, "name": "My Business Pvt Ltd" },
    "partyLedger": { "id": 10, "name": "Customer ABC" },
    "partyGstin": "29AABCU9603R1ZX",
    "partyState": "Karnataka",
    "placeOfSupply": "Karnataka",
    "items": [
      {
        "id": 1,
        "description": "Product A",
        "hsnCode": "1234",
        "quantity": 10,
        "unit": "NOS",
        "ratePerUnit": 1000.00,
        "taxableValue": 10000.00,
        "gstRate": 18.00,
        "cgstRate": 0.00,
        "sgstRate": 0.00,
        "igstRate": 18.00,
        "cgstAmount": 0.00,
        "sgstAmount": 0.00,
        "igstAmount": 1800.00,
        "totalAmount": 11800.00
      }
    ],
    "taxableAmount": 10000.00,
    "cgstAmount": 0.00,
    "sgstAmount": 0.00,
    "igstAmount": 1800.00,
    "totalAmount": 11800.00,
    "notes": "Payment due in 30 days",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

### GET /api/gst-invoices/company/{companyId}
Get all invoices for a specific company.

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of invoice objects

### GET /api/gst-invoices/company/{companyId}/type/{type}
Get invoices by company and type.

**Headers:** `Authorization: Bearer <token>`

**Path Parameters:** 
- `type`: `SALES` or `PURCHASE`

**Response:** Array of invoice objects

### GET /api/gst-invoices/{id}
Get invoice by ID.

**Headers:** `Authorization: Bearer <token>`

**Response:** Single invoice object

### POST /api/gst-invoices
Create a new GST invoice.

**Headers:** `Authorization: Bearer <token>`

**Required Roles:** `ROLE_ACCOUNTANT` or `ROLE_ADMIN`

**Request Body:**
```json
{
  "invoiceNumber": "INV001",
  "invoiceDate": "2024-01-15",
  "invoiceType": "SALES",
  "company": { "id": 1 },
  "partyLedger": { "id": 10 },
  "partyGstin": "29AABCU9603R1ZX",
  "partyState": "Karnataka",
  "placeOfSupply": "Karnataka",
  "items": [
    {
      "description": "Product A",
      "hsnCode": "1234",
      "quantity": 10,
      "unit": "NOS",
      "ratePerUnit": 1000.00,
      "taxableValue": 10000.00,
      "gstRate": 18.00
    }
  ],
  "notes": "Payment due in 30 days"
}
```

**GST Calculation:**
- If company state = party state: CGST + SGST (GST rate split equally)
- If company state ≠ party state: IGST (full GST rate)

Example: 18% GST
- Same state: CGST 9% + SGST 9%
- Different state: IGST 18%

**Response:** Created invoice with calculated GST amounts

### PUT /api/gst-invoices/{id}
Update a GST invoice.

**Headers:** `Authorization: Bearer <token>`

**Required Roles:** `ROLE_ACCOUNTANT` or `ROLE_ADMIN`

**Request Body:** Same as POST

**Response:** Updated invoice with recalculated GST amounts

### DELETE /api/gst-invoices/{id}
Delete a GST invoice.

**Headers:** `Authorization: Bearer <token>`

**Required Roles:** `ROLE_ADMIN`

**Response:** 200 OK

---

## Error Responses

All endpoints return standard error responses:

### 400 Bad Request
```json
{
  "message": "Error: Username is already taken!"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "message": "Access Denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error occurred"
}
```

---

## Postman Collection

You can import this API into Postman using the following steps:

1. Create a new collection named "AccountTool API"
2. Add environment variables:
   - `baseUrl`: `http://localhost:8080`
   - `token`: (will be set after login)
3. For each endpoint, add the request with proper headers
4. Use `{{baseUrl}}` and `{{token}}` in your requests

### Example Login Request in Postman:
```
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Example Company Request in Postman:
```
GET {{baseUrl}}/api/companies
Authorization: Bearer {{token}}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider implementing rate limiting using Spring Cloud Gateway or similar solutions.

## API Versioning

Current API version: v1 (no version prefix in URL)

Future versions may use URL versioning: `/api/v2/...`
