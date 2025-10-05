# Architecture Documentation - Accounting & GST Application

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Angular 17 Application (Port 4200)            │   │
│  │                                                         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │  Login   │  │Dashboard │  │Companies │            │   │
│  │  │Component │  │Component │  │Component │            │   │
│  │  └──────────┘  └──────────┘  └──────────┘            │   │
│  │                                                         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │ Ledgers  │  │ Invoices │  │ Reports  │            │   │
│  │  │Component │  │Component │  │Component │            │   │
│  │  └──────────┘  └──────────┘  └──────────┘            │   │
│  │                                                         │   │
│  │        Angular Material UI Components                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST (JSON)
                              │ JWT Token in Header
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │        Spring Boot 3 REST API (Port 8080)              │   │
│  │                                                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │   │
│  │  │    Auth      │  │   Company    │  │   Ledger    │  │   │
│  │  │  Controller  │  │  Controller  │  │ Controller  │  │   │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │   │
│  │                                                         │   │
│  │  ┌──────────────┐  ┌──────────────┐                   │   │
│  │  │   Invoice    │  │   Report     │                   │   │
│  │  │  Controller  │  │  Controller  │                   │   │
│  │  └──────────────┘  └──────────────┘                   │   │
│  │                                                         │   │
│  │           Swagger/OpenAPI Documentation                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Spring Security + JWT                      │   │
│  │                                                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │   │
│  │  │     JWT      │  │     Auth     │  │    CORS     │  │   │
│  │  │    Filter    │  │    Filter    │  │   Config    │  │   │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │   │
│  │                                                         │   │
│  │        BCrypt Password Encryption                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Service Layer                         │   │
│  │                                                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │   │
│  │  │    Auth      │  │   Company    │  │   Ledger    │  │   │
│  │  │   Service    │  │   Service    │  │  Service    │  │   │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │   │
│  │                                                         │   │
│  │  ┌──────────────┐  ┌──────────────┐                   │   │
│  │  │   Invoice    │  │   Report     │                   │   │
│  │  │   Service    │  │   Service    │                   │   │
│  │  └──────────────┘  └──────────────┘                   │   │
│  │                                                         │   │
│  │  ┌──────────────┐  ┌──────────────┐                   │   │
│  │  │    GSTIN     │  │     GST      │                   │   │
│  │  │  Validator   │  │  Calculator  │                   │   │
│  │  └──────────────┘  └──────────────┘                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PERSISTENCE LAYER                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │          Spring Data JPA Repositories                   │   │
│  │                                                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │   │
│  │  │    User      │  │   Company    │  │   Ledger    │  │   │
│  │  │ Repository   │  │ Repository   │  │ Repository  │  │   │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │   │
│  │                                                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │   │
│  │  │   Invoice    │  │   Product    │  │   Journal   │  │   │
│  │  │ Repository   │  │ Repository   │  │ Repository  │  │   │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │       PostgreSQL 15 Database (Port 5432)                │   │
│  │                                                         │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐       │   │
│  │  │ users  │  │companies│ │ledgers │  │products│       │   │
│  │  └────────┘  └────────┘  └────────┘  └────────┘       │   │
│  │                                                         │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐       │   │
│  │  │invoices│  │invoice │  │journal │  │journal │       │   │
│  │  │        │  │_items  │  │_entries│  │_lines  │       │   │
│  │  └────────┘  └────────┘  └────────┘  └────────┘       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components Hierarchy

```
app.component (Root)
├── login.component
├── dashboard.component
├── company-list.component
│   └── company-form.component
├── ledger-list.component (structure ready)
│   └── ledger-form.component (structure ready)
├── invoice-list.component
│   └── invoice-form.component
└── reports.component (structure ready)
    ├── gstr1-report.component (structure ready)
    └── gstr3b-report.component (structure ready)
```

### Backend Package Structure

```
com.accounttool
├── AccountingGstApplication.java (Main)
├── config/
│   ├── SecurityConfig.java
│   ├── CorsConfig.java
│   └── DataInitializer.java
├── controller/
│   ├── AuthController.java
│   ├── CompanyController.java
│   ├── LedgerController.java
│   └── InvoiceController.java
├── service/
│   ├── AuthService.java
│   ├── CompanyService.java
│   ├── LedgerService.java
│   └── InvoiceService.java
├── repository/
│   ├── UserRepository.java
│   ├── CompanyRepository.java
│   ├── LedgerRepository.java
│   ├── InvoiceRepository.java
│   ├── ProductRepository.java
│   └── JournalEntryRepository.java
├── entity/
│   ├── User.java
│   ├── Company.java
│   ├── Ledger.java
│   ├── Invoice.java
│   ├── InvoiceItem.java
│   ├── Product.java
│   ├── JournalEntry.java
│   └── JournalEntryLine.java
├── dto/
│   ├── LoginRequest.java
│   ├── LoginResponse.java
│   └── InvoiceRequest.java
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   ├── UserDetailsImpl.java
│   └── UserDetailsServiceImpl.java
└── util/
    ├── GstinValidator.java
    └── GstCalculator.java
```

## Data Flow Diagrams

### Authentication Flow

```
┌──────────┐           ┌──────────┐           ┌──────────┐
│ Angular  │           │  Spring  │           │PostgreSQL│
│ Frontend │           │  Backend │           │ Database │
└────┬─────┘           └────┬─────┘           └────┬─────┘
     │                      │                      │
     │ POST /auth/login     │                      │
     │ {username,password}  │                      │
     ├─────────────────────>│                      │
     │                      │                      │
     │                      │ SELECT user          │
     │                      ├─────────────────────>│
     │                      │                      │
     │                      │<─────────────────────┤
     │                      │ User data            │
     │                      │                      │
     │                      │ Validate password    │
     │                      │ (BCrypt)             │
     │                      │                      │
     │                      │ Generate JWT         │
     │                      │ (with user ID)       │
     │                      │                      │
     │<─────────────────────┤                      │
     │ {token, userInfo}    │                      │
     │                      │                      │
     │ Store token in       │                      │
     │ localStorage         │                      │
     │                      │                      │
```

### Invoice Creation Flow

```
┌──────────┐           ┌──────────┐           ┌──────────┐
│ Angular  │           │  Spring  │           │PostgreSQL│
│ Frontend │           │  Backend │           │ Database │
└────┬─────┘           └────┬─────┘           └────┬─────┘
     │                      │                      │
     │ POST /invoices       │                      │
     │ + JWT Token          │                      │
     ├─────────────────────>│                      │
     │                      │                      │
     │                      │ Validate JWT         │
     │                      │                      │
     │                      │ GET Company          │
     │                      ├─────────────────────>│
     │                      │<─────────────────────┤
     │                      │                      │
     │                      │ GET Party Ledger     │
     │                      ├─────────────────────>│
     │                      │<─────────────────────┤
     │                      │                      │
     │                      │ Calculate GST        │
     │                      │ (CGST/SGST or IGST)  │
     │                      │ based on states      │
     │                      │                      │
     │                      │ INSERT Invoice       │
     │                      ├─────────────────────>│
     │                      │                      │
     │                      │ INSERT Items         │
     │                      ├─────────────────────>│
     │                      │<─────────────────────┤
     │                      │                      │
     │<─────────────────────┤                      │
     │ Invoice with GST     │                      │
     │                      │                      │
```

### GST Calculation Logic

```
                      ┌─────────────────┐
                      │ Invoice Request │
                      └────────┬────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Get Company State    │
                    │ Get Party State      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Compare States       │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
    ┌───────────────────┐         ┌───────────────────┐
    │  States EQUAL     │         │ States DIFFERENT  │
    │  (Intra-state)    │         │  (Inter-state)    │
    └─────────┬─────────┘         └─────────┬─────────┘
              │                               │
              ▼                               ▼
    ┌───────────────────┐         ┌───────────────────┐
    │ CGST = Rate / 2   │         │ CGST = 0          │
    │ SGST = Rate / 2   │         │ SGST = 0          │
    │ IGST = 0          │         │ IGST = Rate       │
    └─────────┬─────────┘         └─────────┬─────────┘
              │                               │
              └───────────────┬───────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │ Calculate Tax Amount │
                    │ Tax = Base × Rate%   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Total = Base + Tax   │
                    └──────────────────────┘
```

## Database Schema

### Entity Relationships

```
┌─────────────┐         ┌─────────────┐
│    User     │────────>│   Company   │
│             │  N:1    │             │
└─────────────┘         └──────┬──────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
                    ▼          ▼          ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │   Ledger    │ │  Invoice    │ │  Product    │
            │             │ │             │ │             │
            └─────────────┘ └──────┬──────┘ └─────────────┘
                                   │
                                   │ 1:N
                                   ▼
                            ┌─────────────┐
                            │InvoiceItem  │
                            └─────────────┘

┌─────────────┐         ┌─────────────┐
│JournalEntry │────────>│ JournalLine │
│             │  1:N    │             │
└─────────────┘         └─────────────┘
```

### Table Relationships

```sql
users
├── id (PK)
├── username (UNIQUE)
├── password (ENCRYPTED)
├── role (ENUM)
└── company_id (FK) → companies.id

companies
├── id (PK)
├── gstin (UNIQUE, VALIDATED)
├── state (FOR GST CALCULATION)
└── active (BOOLEAN)

ledgers
├── id (PK)
├── company_id (FK) → companies.id
├── type (ENUM: ASSET, LIABILITY, INCOME, EXPENSE, EQUITY)
└── group_name (ENUM: 14 groups)

invoices
├── id (PK)
├── company_id (FK) → companies.id
├── party_ledger_id (FK) → ledgers.id
├── type (ENUM: SALES, PURCHASE)
├── party_state (FOR GST CALCULATION)
├── cgst_amount
├── sgst_amount
└── igst_amount

invoice_items
├── id (PK)
├── invoice_id (FK) → invoices.id
├── product_id (FK) → products.id
├── cgst_rate, cgst_amount
├── sgst_rate, sgst_amount
└── igst_rate, igst_amount
```

## Security Architecture

### JWT Flow

```
1. User Login
   ↓
2. Validate Credentials
   ↓
3. Generate JWT with:
   - User ID (subject)
   - Issued At
   - Expiration
   - Signature (HMAC-SHA256)
   ↓
4. Return Token
   ↓
5. Client stores token
   ↓
6. Include in Authorization header:
   "Bearer {token}"
   ↓
7. Server validates:
   - Signature
   - Expiration
   - Claims
   ↓
8. Extract User ID
   ↓
9. Load User Details
   ↓
10. Set Authentication Context
```

### Security Layers

```
┌─────────────────────────────────────┐
│   Request from Client               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   CORS Filter                       │
│   - Check Origin                    │
│   - Add CORS Headers                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   JWT Authentication Filter         │
│   - Extract Token                   │
│   - Validate Signature              │
│   - Check Expiration                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Authorization Filter              │
│   - Load User Details               │
│   - Check Authorities               │
│   - Set Security Context            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Controller Methods                │
│   - @PreAuthorize annotations       │
│   - Role checks                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Business Logic                    │
└─────────────────────────────────────┘
```

## Deployment Architecture (Docker)

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Host                             │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              accounttool-network (Bridge)             │ │
│  │                                                       │ │
│  │  ┌─────────────────┐  ┌─────────────────┐           │ │
│  │  │   PostgreSQL    │  │   Backend       │           │ │
│  │  │   Container     │  │   Container     │           │ │
│  │  │   Port: 5432    │  │   Port: 8080    │           │ │
│  │  │                 │  │                 │           │ │
│  │  │  postgres:15    │  │  Spring Boot 3  │           │ │
│  │  │   -alpine       │  │   + JPA         │           │ │
│  │  │                 │  │                 │           │ │
│  │  └────────┬────────┘  └────────┬────────┘           │ │
│  │           │                     │                    │ │
│  │           │ Database Connection │                    │ │
│  │           └─────────────────────┘                    │ │
│  │                                                       │ │
│  │  ┌─────────────────┐                                 │ │
│  │  │   Frontend      │                                 │ │
│  │  │   Container     │                                 │ │
│  │  │   Port: 80      │                                 │ │
│  │  │                 │                                 │ │
│  │  │  Angular 17 +   │                                 │ │
│  │  │  Nginx          │                                 │ │
│  │  │                 │                                 │ │
│  │  └────────┬────────┘                                 │ │
│  │           │                                          │ │
│  │           │ Proxy /api → backend:8080               │ │
│  │           │                                          │ │
│  └───────────┼──────────────────────────────────────────┘ │
│              │                                            │
└──────────────┼────────────────────────────────────────────┘
               │
               │ Port Mapping
               │
┌──────────────┼────────────────────────────────────────────┐
│              │                                            │
│  Host Ports: │                                            │
│              │                                            │
│  4200 ───────┴───> Frontend Container (80)               │
│  8080 ───────────> Backend Container (8080)              │
│  5432 ───────────> PostgreSQL Container (5432)           │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

## API Request Flow

```
Client Request
     │
     ├─> Angular HTTP Client
     │        │
     │        ├─> Auth Interceptor (add JWT)
     │        │
     │        └─> HTTP Request
     │              │
     │              ▼
     └─> Spring Boot REST API
              │
              ├─> JWT Filter (validate token)
              │
              ├─> Controller (handle request)
              │        │
              │        ├─> @Valid (validate input)
              │        │
              │        └─> Service Layer
              │                 │
              │                 ├─> Business Logic
              │                 │
              │                 ├─> Utility Classes
              │                 │   (GSTIN validation, GST calc)
              │                 │
              │                 └─> Repository Layer
              │                          │
              │                          └─> JPA/Hibernate
              │                                   │
              │                                   └─> PostgreSQL
              │                                          │
              │<─────────────────────────────────────────┘
              │
              └─> JSON Response
                   │
                   └─> Client receives data
```

## Technology Integration

```
┌────────────────────────────────────────────────────┐
│                Frontend Stack                      │
├────────────────────────────────────────────────────┤
│ Angular 17           │ Framework                   │
│ TypeScript 5.2       │ Language                    │
│ Angular Material     │ UI Components               │
│ RxJS                 │ Reactive Programming        │
│ Angular Router       │ Navigation                  │
│ HttpClient           │ HTTP Communication          │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│                Backend Stack                       │
├────────────────────────────────────────────────────┤
│ Spring Boot 3.2      │ Framework                   │
│ Spring Data JPA      │ Data Access                 │
│ Spring Security      │ Authentication              │
│ JWT (jjwt)           │ Token Management            │
│ Lombok               │ Boilerplate Reduction       │
│ Swagger/OpenAPI      │ API Documentation           │
│ PostgreSQL Driver    │ Database Connection         │
│ BCrypt               │ Password Encryption         │
│ Dotenv               │ Configuration Management    │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│              Infrastructure Stack                  │
├────────────────────────────────────────────────────┤
│ Docker               │ Containerization            │
│ Docker Compose       │ Multi-container Management  │
│ PostgreSQL 15        │ Database                    │
│ Nginx                │ Web Server / Reverse Proxy  │
│ Maven                │ Build Tool                  │
│ npm                  │ Package Manager             │
└────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
```
        Load Balancer
              │
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
Backend-1  Backend-2  Backend-3
    │         │         │
    └─────────┼─────────┘
              │
              ▼
        PostgreSQL
        (with replica)
```

### Caching Strategy (Future)
```
Client → CDN → Nginx → Backend → Redis → PostgreSQL
                                  (Cache)
```

### Microservices Evolution (Future)
```
API Gateway
    │
    ├─> Auth Service
    ├─> Company Service
    ├─> Invoice Service
    ├─> Report Service
    └─> GST Calculation Service
```

## Conclusion

The architecture is designed for:
- ✅ Separation of concerns
- ✅ Security first
- ✅ Scalability
- ✅ Maintainability
- ✅ Docker deployment
- ✅ API-first design
- ✅ Responsive UI
- ✅ GST compliance
