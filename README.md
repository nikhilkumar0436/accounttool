# Accounting & GST Application

A full-stack web application for managing accounting and GST (Goods and Services Tax) compliance in India. Built with Spring Boot 3, PostgreSQL, Angular 17, and Material Design.

## Features

### Backend (Spring Boot 3)
- **User Management**: Role-based access control (ADMIN, ACCOUNTANT, MANAGER, USER)
- **Company Setup**: Company profile management with GSTIN validation
- **Ledger Management**: Chart of accounts with multiple ledger groups
- **Journal Entries**: Double-entry bookkeeping system
- **Invoice Management**:
  - Sales and Purchase invoices
  - Automatic GST calculation (CGST/SGST for intra-state, IGST for inter-state)
  - HSN code support
  - Multiple tax rates (0%, 5%, 12%, 18%, 28%)
- **GST Features**:
  - GSTIN format validation
  - Automatic tax calculation based on state
  - GSTR-1 report data (outward supplies)
  - GSTR-3B report support
- **Financial Reports**:
  - Trial Balance
  - Profit & Loss Statement
  - Balance Sheet
- **Banking Module**: Bank account management
- **Inventory Management**: Product catalog with stock tracking
- **API Documentation**: Swagger/OpenAPI integration
- **Security**: JWT-based authentication

### Frontend (Angular 17)
- **Responsive UI**: Material Design components
- **Dashboard**: Overview of key metrics
- **Company Management**: Create and manage company profiles
- **Ledger Management**: Maintain chart of accounts
- **Invoice Creation**: Create sales/purchase invoices with GST calculation
- **GST Reports**: View GSTR-1 and GSTR-3B data
- **Authentication**: Login with JWT token management

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Security with JWT
- PostgreSQL 15
- Swagger/OpenAPI 3
- Lombok
- Maven

### Frontend
- Angular 17
- Angular Material
- RxJS
- TypeScript 5.2

### DevOps
- Docker & Docker Compose
- Nginx
- Environment-based configuration

## Prerequisites

- Java 17 or higher
- Node.js 20 or higher
- PostgreSQL 15 or higher
- Docker & Docker Compose (for containerized deployment)
- Maven 3.9+ (for backend development)

## Getting Started

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/nikhilkumar0436/accounttool.git
cd accounttool
```

2. Create environment file:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

3. Start all services:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

### Manual Setup

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create `.env` file from example:
```bash
cp .env.example .env
```

3. Update database configuration in `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=accounttool_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

4. Build and run:
```bash
mvn clean install
mvn spring-boot:run
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Access at http://localhost:4200

## Configuration

### Backend Configuration

Key configuration files:
- `backend/src/main/resources/application.properties`: Application settings
- `backend/.env`: Environment-specific variables (not committed to git)

Important environment variables:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`: Database connection
- `JWT_SECRET`: Secret key for JWT token generation (minimum 256 bits)
- `JWT_EXPIRATION`: Token expiration time in milliseconds
- `CORS_ALLOWED_ORIGINS`: Allowed CORS origins
- `GSTIN_VALIDATION_ENABLED`: Enable/disable GSTIN validation

### Frontend Configuration

Environment files:
- `frontend/src/environments/environment.ts`: Development environment
- `frontend/src/environments/environment.prod.ts`: Production environment

## API Documentation

Once the backend is running, access the interactive API documentation:
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api-docs

## Database Schema

Main entities:
- **users**: User accounts with roles
- **companies**: Company profiles with GSTIN
- **ledgers**: Chart of accounts
- **journal_entries**: Journal entries with lines
- **invoices**: Sales/Purchase invoices
- **invoice_items**: Invoice line items with GST details
- **products**: Product catalog

## GST Calculation Logic

### CGST + SGST (Intra-state transactions)
When company state = party state:
- CGST Rate = GST Rate / 2
- SGST Rate = GST Rate / 2
- IGST Rate = 0

### IGST (Inter-state transactions)
When company state ≠ party state:
- CGST Rate = 0
- SGST Rate = 0
- IGST Rate = GST Rate

### GSTIN Format
Valid GSTIN format: `22AAAAA0000A1Z5`
- First 2 digits: State code
- Next 10 characters: PAN number
- 13th character: Entity number (1-9 or A-Z)
- 14th character: Always 'Z'
- 15th character: Check digit

## Default Users

Default admin user (to be created manually):
```
Username: admin
Password: admin123
Role: ADMIN
```

## Project Structure

```
accounttool/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/accounttool/
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── dto/             # Data transfer objects
│   │   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── repository/      # Data repositories
│   │   │   │   ├── security/        # Security & JWT
│   │   │   │   ├── service/         # Business logic
│   │   │   │   └── util/            # Utility classes
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── Dockerfile
│   ├── pom.xml
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/         # Angular components
│   │   │   ├── guards/             # Route guards
│   │   │   ├── models/             # TypeScript models
│   │   │   └── services/           # HTTP services
│   │   └── environments/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Building for Production

### Backend
```bash
cd backend
mvn clean package -DskipTests
java -jar target/accounting-gst-app-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Output in dist/accounting-gst-app
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

## Roadmap

- [ ] Implement Trial Balance report
- [ ] Implement P&L Statement
- [ ] Implement Balance Sheet
- [ ] Complete GSTR-3B report generation
- [ ] Add data export (Excel/PDF)
- [ ] Implement multi-company support
- [ ] Add payment tracking
- [ ] Implement recurring invoices
- [ ] Add email notifications
- [ ] Mobile responsive improvements

## Acknowledgments

- Spring Boot for the backend framework
- Angular Material for UI components
- PostgreSQL for the database
- Docker for containerization