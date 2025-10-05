# Quick Start Guide - Accounting & GST Application

## Fastest Way to Run (Docker Compose)

### Prerequisites
- Docker Desktop installed and running
- Git installed

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/nikhilkumar0436/accounttool.git
cd accounttool
```

2. **Create environment file**
```bash
cp backend/.env.example backend/.env
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Wait for services to start** (about 30-60 seconds)
```bash
docker-compose logs -f
```

5. **Access the application**
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html

6. **Login with default credentials**
```
Username: admin
Password: admin123
```

## Manual Setup (For Development)

### Backend Setup

#### Prerequisites
- Java 17 or higher
- Maven 3.9+
- PostgreSQL 15+ running locally

#### Steps

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create and configure .env file**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=accounttool_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-very-long-secret-key-at-least-256-bits-long-for-production
JWT_EXPIRATION=86400000
```

3. **Create database**
```sql
CREATE DATABASE accounttool_db;
```

4. **Build and run**
```bash
mvn clean install
mvn spring-boot:run
```

5. **Verify backend is running**
- Open: http://localhost:8080/swagger-ui.html
- You should see the API documentation

### Frontend Setup

#### Prerequisites
- Node.js 20 or higher
- npm 10+

#### Steps

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

4. **Access the application**
- Open: http://localhost:4200
- Login with admin/admin123

## First Steps After Login

### 1. Create a Company

1. Navigate to **Companies** from the menu
2. Click **New Company**
3. Fill in the form:
   - Company Name: `My Company Pvt Ltd`
   - GSTIN: `27AAAAA0000A1Z5` (valid format)
   - PAN: `AAAAA0000A`
   - Address: `123 Main Street`
   - City: `Mumbai`
   - State: `Maharashtra`
   - Pincode: `400001`
   - Email: `company@example.com`
   - Phone: `+91-1234567890`
4. Click **Save**

### 2. Create Ledger Accounts

1. Navigate to **Ledgers** from the menu
2. Create essential ledgers:
   - **Sales Account**: Type=INCOME, Group=SALES
   - **Purchase Account**: Type=EXPENSE, Group=PURCHASE
   - **Customer Ledger**: Type=ASSET, Group=SUNDRY_DEBTORS
   - **Supplier Ledger**: Type=LIABILITY, Group=SUNDRY_CREDITORS
   - **Cash Account**: Type=ASSET, Group=CASH

### 3. Create Your First Sales Invoice

1. Navigate to **Invoices** → **New Invoice**
2. Fill in invoice details:
   - Invoice Number: `INV-001`
   - Type: `Sales`
   - Invoice Date: Select date
   - Party State: Select state (if same as company state, CGST+SGST will apply; if different, IGST)
3. Add items:
   - Description: `Product/Service Name`
   - HSN Code: `1234` (optional)
   - Quantity: `10`
   - Rate: `1000`
   - GST Rate: `18%`
4. Click **Save Invoice**
5. View the invoice with automatic GST calculation

### 4. View GST Reports

1. Navigate to **Reports** → **GSTR-1**
2. Select date range
3. View all sales invoices with GST breakdown

## Testing the GST Calculation

### Intra-State Transaction (CGST + SGST)
- Company State: `Maharashtra`
- Party State: `Maharashtra`
- GST Rate: 18%
- Result: CGST 9% + SGST 9%

### Inter-State Transaction (IGST)
- Company State: `Maharashtra`
- Party State: `Gujarat`
- GST Rate: 18%
- Result: IGST 18%

## API Testing with Swagger

1. Open Swagger UI: http://localhost:8080/swagger-ui.html
2. Authenticate:
   - Use `/api/auth/login` endpoint
   - Request body:
     ```json
     {
       "username": "admin",
       "password": "admin123"
     }
     ```
   - Copy the token from response
3. Click **Authorize** button at the top
4. Enter: `Bearer YOUR_TOKEN_HERE`
5. Now you can test all API endpoints

## Stopping the Application

### Docker Compose
```bash
docker-compose down
```

### Manual Setup
- Backend: Press `Ctrl+C` in the terminal running Maven
- Frontend: Press `Ctrl+C` in the terminal running npm

## Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify database credentials in `.env`
- Check if port 8080 is available

### Frontend won't start
- Run `npm install` again
- Delete `node_modules` and reinstall
- Check if port 4200 is available

### Database connection error
- Ensure PostgreSQL is running
- Verify database exists
- Check credentials in `.env` file

### CORS errors
- Ensure frontend is running on http://localhost:4200
- Check CORS settings in `application.properties`

## Next Steps

- Explore the Dashboard
- Create more ledger accounts
- Add products to inventory
- Create purchase invoices
- Generate GST reports
- Review the comprehensive documentation in README.md

## Support

For issues and questions:
- Check README.md for detailed documentation
- Review API documentation at /swagger-ui.html
- Open an issue on GitHub

## Default Credentials

**Important**: Change these credentials in production!

```
Username: admin
Password: admin123
Email: admin@accounttool.com
Role: ADMIN
```
