# API Documentation - Accounting & GST Application

## Base URL
```
http://localhost:8080/api
```

## Authentication

All endpoints except `/auth/login` require JWT authentication.

### Headers
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

## Endpoints

### Authentication

#### Login
```http
POST /auth/login
```

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
  "email": "admin@accounttool.com",
  "role": "ADMIN",
  "companyId": null
}
```

### Companies

#### Get All Companies
```http
GET /companies
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "My Company Pvt Ltd",
    "gstin": "27AAAAA0000A1Z5",
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "pan": "AAAAA0000A",
    "email": "company@example.com",
    "phone": "+91-1234567890",
    "active": true,
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  }
]
```

#### Get Company by ID
```http
GET /companies/{id}
```

#### Create Company
```http
POST /companies
```

**Request Body:**
```json
{
  "name": "My Company Pvt Ltd",
  "gstin": "27AAAAA0000A1Z5",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "pan": "AAAAA0000A",
  "email": "company@example.com",
  "phone": "+91-1234567890"
}
```

**GSTIN Validation Rules:**
- Must be exactly 15 characters
- Format: `[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}`
- First 2 digits: State code
- Next 10 chars: PAN number
- 13th char: Entity number
- 14th char: Always 'Z'
- 15th char: Check digit

#### Update Company
```http
PUT /companies/{id}
```

#### Delete Company (Soft Delete)
```http
DELETE /companies/{id}
```

### Ledgers

#### Get Ledgers by Company
```http
GET /ledgers/company/{companyId}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Sales Account",
    "ledgerCode": "SAL001",
    "type": "INCOME",
    "groupName": "SALES",
    "openingBalance": 0.00,
    "currentBalance": 0.00,
    "active": true,
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  }
]
```

**Ledger Types:**
- `ASSET`
- `LIABILITY`
- `INCOME`
- `EXPENSE`
- `EQUITY`

**Ledger Groups:**
- `CASH`
- `BANK`
- `SUNDRY_DEBTORS`
- `SUNDRY_CREDITORS`
- `SALES`
- `PURCHASE`
- `DIRECT_EXPENSES`
- `INDIRECT_EXPENSES`
- `FIXED_ASSETS`
- `CURRENT_ASSETS`
- `CURRENT_LIABILITIES`
- `LONG_TERM_LIABILITIES`
- `CAPITAL`
- `RESERVES`

#### Create Ledger
```http
POST /ledgers
```

**Request Body:**
```json
{
  "name": "Sales Account",
  "ledgerCode": "SAL001",
  "type": "INCOME",
  "groupName": "SALES",
  "openingBalance": 0.00,
  "company": {
    "id": 1
  }
}
```

### Invoices

#### Get Invoices by Company
```http
GET /invoices/company/{companyId}
```

#### Get Invoices by Type
```http
GET /invoices/company/{companyId}/type/{type}
```

**Types:** `SALES`, `PURCHASE`

#### Get Invoice by ID
```http
GET /invoices/{id}
```

**Response:**
```json
{
  "id": 1,
  "invoiceNumber": "INV-001",
  "type": "SALES",
  "invoiceDate": "2024-01-01",
  "companyId": 1,
  "partyLedgerId": 5,
  "partyGstin": "27BBBBB0000B1Z6",
  "partyAddress": "456 Market Street",
  "partyState": "Maharashtra",
  "subtotal": 10000.00,
  "cgstAmount": 900.00,
  "sgstAmount": 900.00,
  "igstAmount": 0.00,
  "totalAmount": 11800.00,
  "remarks": "Sample invoice",
  "status": "POSTED",
  "items": [
    {
      "id": 1,
      "description": "Product A",
      "hsnCode": "1234",
      "quantity": 10.00,
      "unit": "PCS",
      "rate": 1000.00,
      "amount": 10000.00,
      "cgstRate": 9.00,
      "cgstAmount": 900.00,
      "sgstRate": 9.00,
      "sgstAmount": 900.00,
      "igstRate": 0.00,
      "igstAmount": 0.00,
      "totalAmount": 11800.00
    }
  ],
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

#### Create Invoice
```http
POST /invoices
```

**Request Body:**
```json
{
  "invoiceNumber": "INV-001",
  "type": "SALES",
  "invoiceDate": "2024-01-01",
  "companyId": 1,
  "partyLedgerId": 5,
  "partyGstin": "27BBBBB0000B1Z6",
  "partyAddress": "456 Market Street",
  "partyState": "Maharashtra",
  "remarks": "Sample invoice",
  "items": [
    {
      "description": "Product A",
      "hsnCode": "1234",
      "quantity": 10,
      "unit": "PCS",
      "rate": 1000,
      "cgstRate": 9,
      "sgstRate": 9,
      "igstRate": 0
    }
  ]
}
```

**GST Calculation Logic:**

1. **Same State (Intra-state):** CGST + SGST
   - Company State: `Maharashtra`
   - Party State: `Maharashtra`
   - GST Rate: 18% → CGST 9% + SGST 9%

2. **Different State (Inter-state):** IGST
   - Company State: `Maharashtra`
   - Party State: `Gujarat`
   - GST Rate: 18% → IGST 18%

#### Update Invoice Status
```http
PUT /invoices/{id}/status?status={STATUS}
```

**Status Values:** `DRAFT`, `POSTED`, `CANCELLED`

#### Get GSTR-1 Report Data
```http
GET /invoices/company/{companyId}/gstr1?startDate=2024-01-01&endDate=2024-12-31
```

Returns all sales invoices for the specified period with full GST breakdown.

## GST Rate Options

Common GST rates in India:
- 0% - Essential commodities
- 5% - Essential goods
- 12% - Standard goods
- 18% - Standard goods and services
- 28% - Luxury goods

## Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2024-01-01T00:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid GSTIN format",
  "path": "/api/companies"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2024-01-01T00:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource",
  "path": "/api/invoices"
}
```

### 404 Not Found
```json
{
  "timestamp": "2024-01-01T00:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Company not found",
  "path": "/api/companies/999"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2024-01-01T00:00:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "path": "/api/invoices"
}
```

## Interactive API Documentation

Access the complete interactive API documentation with Swagger UI:

```
http://localhost:8080/swagger-ui.html
```

Features:
- Try out all endpoints directly
- View request/response schemas
- See all available parameters
- Authentication support
- Example values for all fields

## OpenAPI Specification

Download the OpenAPI 3.0 specification:

```
http://localhost:8080/api-docs
```

## Rate Limiting

Currently, there is no rate limiting implemented. In production, consider:
- API rate limiting per user/IP
- Request throttling
- Circuit breakers for external services

## Best Practices

1. **Always use HTTPS in production**
2. **Store JWT tokens securely** (httpOnly cookies or secure storage)
3. **Implement token refresh mechanism** for long sessions
4. **Validate all input data** on client side before API calls
5. **Handle errors gracefully** with user-friendly messages
6. **Log all API calls** for audit trails
7. **Implement pagination** for large data sets
8. **Use appropriate HTTP methods** (GET, POST, PUT, DELETE)
9. **Version your APIs** for backward compatibility
10. **Document all changes** in API versions

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Companies (with token)
```bash
curl -X GET http://localhost:8080/api/companies \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Invoice
```bash
curl -X POST http://localhost:8080/api/invoices \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNumber": "INV-001",
    "type": "SALES",
    "invoiceDate": "2024-01-01",
    "companyId": 1,
    "partyLedgerId": 5,
    "partyState": "Maharashtra",
    "items": [{
      "description": "Product A",
      "quantity": 10,
      "rate": 1000,
      "cgstRate": 9,
      "sgstRate": 9,
      "igstRate": 0
    }]
  }'
```

## Support

For API issues and questions:
- Check Swagger UI for latest API documentation
- Review error messages carefully
- Check server logs for detailed error information
- Open an issue on GitHub with API endpoint and error details
