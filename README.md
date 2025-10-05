# AccountTool - GST Management System

A full-stack Accounting & GST application for India built with Spring Boot 3 + JPA + PostgreSQL (backend) and Angular 17 + Material (frontend).

## Features

### User Management
- JWT-based authentication and authorization
- Role-based access control (Admin, Accountant, User)
- User registration and login

### Company Management
- Create and manage multiple companies
- Store company details including GSTIN, PAN, address
- Configure financial year settings

### Ledger Management
- Create and manage ledgers
- Support for different ledger types (Asset, Liability, Income, Expense, Capital)
- Track opening and current balances
- GST-applicable party ledgers

### Journal Entries
- Create double-entry journal entries
- Automatic validation (debits = credits)
- Link entries to specific ledgers
- Track journal history

### GST Invoice Management
- Sales and Purchase invoice creation
- Automatic GST calculation:
  - **CGST + SGST** for intra-state transactions (same state)
  - **IGST** for inter-state transactions (different states)
- HSN/SAC code support
- Multiple line items per invoice
- Complete tax breakdown

## Technology Stack

### Backend
- **Spring Boot 3.2.0** - Application framework
- **Spring Data JPA** - Data persistence
- **Spring Security** - Authentication and authorization
- **PostgreSQL** - Database
- **JWT (JSON Web Tokens)** - Stateless authentication
- **Lombok** - Reduce boilerplate code
- **Maven** - Build tool

### Frontend
- **Angular 17** - Frontend framework
- **Angular Material** - UI components
- **RxJS** - Reactive programming
- **TypeScript** - Type-safe JavaScript
- **SCSS** - Styling

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 13 or higher
- Maven 3.6 or higher
- npm 9 or higher

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE accounttool;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE accounttool TO postgres;
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Update `src/main/resources/application.properties` with your database credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/accounttool
spring.datasource.username=postgres
spring.datasource.password=postgres
```

Build and run the backend:

```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Initialize Database with Roles

The application requires roles to be initialized. You can do this by inserting them manually or creating a data initialization script:

```sql
INSERT INTO roles (name, description) VALUES 
('ROLE_ADMIN', 'Administrator with full access'),
('ROLE_ACCOUNTANT', 'Accountant with accounting access'),
('ROLE_USER', 'Regular user with read access');
```

### 4. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm start
```

The frontend will start on `http://localhost:4200`

## Usage

### 1. Register a New User

Navigate to `http://localhost:4200/signup` and create a new account.

### 2. Login

Use your credentials to login at `http://localhost:4200/login`

### 3. Create a Company

- Navigate to the Companies section
- Click "Add Company"
- Fill in company details including GSTIN and state
- Save the company

### 4. Create Ledgers

- Navigate to the Ledgers section
- Create ledgers for:
  - Assets (Bank, Cash)
  - Liabilities (Loans)
  - Income (Sales)
  - Expenses (Purchases, Rent)
  - Capital (Owner's capital)

### 5. Create Journal Entries

- Navigate to Journal Entries
- Create double-entry bookkeeping entries
- System validates that debits equal credits

### 6. Create GST Invoices

- Navigate to Sales or Purchase Invoices
- Create invoices with multiple line items
- System automatically calculates:
  - CGST + SGST for same-state transactions
  - IGST for inter-state transactions
- View complete tax breakdown

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/{id}` - Get company by ID
- `POST /api/companies` - Create company
- `PUT /api/companies/{id}` - Update company
- `DELETE /api/companies/{id}` - Delete company

### Ledgers
- `GET /api/ledgers` - Get all ledgers
- `GET /api/ledgers/company/{companyId}` - Get ledgers by company
- `POST /api/ledgers` - Create ledger
- `PUT /api/ledgers/{id}` - Update ledger
- `DELETE /api/ledgers/{id}` - Delete ledger

### Journals
- `GET /api/journals` - Get all journals
- `GET /api/journals/company/{companyId}` - Get journals by company
- `POST /api/journals` - Create journal
- `DELETE /api/journals/{id}` - Delete journal

### GST Invoices
- `GET /api/gst-invoices` - Get all invoices
- `GET /api/gst-invoices/company/{companyId}` - Get invoices by company
- `GET /api/gst-invoices/company/{companyId}/type/{type}` - Get invoices by type
- `POST /api/gst-invoices` - Create invoice
- `PUT /api/gst-invoices/{id}` - Update invoice
- `DELETE /api/gst-invoices/{id}` - Delete invoice

## GST Tax Calculation Logic

The system automatically calculates GST based on the location of supply:

### Intra-State Transaction (Same State)
When company state = party state:
- **CGST**: GST Rate ÷ 2
- **SGST**: GST Rate ÷ 2
- **IGST**: 0

Example: For 18% GST
- CGST: 9%
- SGST: 9%

### Inter-State Transaction (Different States)
When company state ≠ party state:
- **CGST**: 0
- **SGST**: 0
- **IGST**: Full GST Rate

Example: For 18% GST
- IGST: 18%

## Project Structure

```
accounttool/
├── backend/
│   ├── src/main/java/com/accounttool/
│   │   ├── config/          # Security and CORS configuration
│   │   ├── controller/      # REST API controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Data repositories
│   │   ├── security/        # JWT and security classes
│   │   └── service/         # Business logic services
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   └── src/app/
│       ├── auth/            # Authentication module
│       ├── company/         # Company management
│       ├── ledger/          # Ledger management
│       ├── journal/         # Journal entries
│       ├── gst-invoice/     # GST invoice management
│       └── shared/          # Shared models and services
└── README.md
```

## Security

- All API endpoints (except authentication) require JWT token
- Passwords are encrypted using BCrypt
- Role-based access control for sensitive operations
- CORS configured for frontend access

## Development

### Backend Development
```bash
cd backend
mvn spring-boot:run
```

### Frontend Development
```bash
cd frontend
npm start
```

### Build for Production

Backend:
```bash
cd backend
mvn clean package
java -jar target/accounttool-backend-1.0.0.jar
```

Frontend:
```bash
cd frontend
npm run build
# Deploy dist/frontend to web server
```

## Troubleshooting

### HTTP Error 0 / Connection Refused

If you see errors like `Http failure response for http://localhost:8080: 0 Unknown Error`:

1. **Ensure the backend is running:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   You should see: `Started AccountToolApplication`

2. **Check if PostgreSQL is running:**
   ```bash
   # On Linux/Mac
   sudo service postgresql status
   
   # On Windows
   pg_ctl status
   ```

3. **Verify backend is accessible:**
   ```bash
   curl http://localhost:8080/api/auth/login
   ```
   Should return: `{"timestamp":...}` (401 error is expected without credentials)

4. **Check CORS configuration:**
   - Backend `application.properties` should have: `cors.allowed.origins=http://localhost:4200`
   - Frontend should connect to: `http://localhost:8080`

5. **Check browser console for detailed errors:**
   - Open Developer Tools (F12)
   - Look for CORS errors or network failures

### Authentication Issues

If you can't login or get 403 errors:

1. **Initialize database roles:**
   ```sql
   INSERT INTO roles (name, description) VALUES 
   ('ROLE_ADMIN', 'Administrator with full access'),
   ('ROLE_ACCOUNTANT', 'Accountant with accounting access'),
   ('ROLE_USER', 'Regular user with read access');
   ```

2. **Check JWT token:**
   - Token should be in sessionStorage
   - Token format: `Bearer xxx.yyy.zzz`

### Company Creation Fails

If you see validation errors:

1. **GSTIN format:** Must be 15 characters, format: `22AAAAA0000A1Z5`
2. **PAN format:** Must be 10 characters, format: `AAAAA9999A`
3. **Email:** Must be valid email format

Check backend logs for detailed error messages.

## License

This project is open source and available under the MIT License.

## Contributors

- AccountTool Development Team

## Support

For issues and questions, please create an issue in the repository.