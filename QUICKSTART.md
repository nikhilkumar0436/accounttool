# Quick Start Guide

This guide will help you get the AccountTool GST Management System up and running in minutes.

## Prerequisites Check

Before starting, ensure you have:
- ✅ Java 17+ installed (`java -version`)
- ✅ Node.js 18+ installed (`node -v`)
- ✅ PostgreSQL 13+ installed and running
- ✅ Maven 3.6+ installed (`mvn -v`)

## Step 1: Database Setup (2 minutes)

1. Open PostgreSQL command line or pgAdmin
2. Run these commands:

```sql
CREATE DATABASE accounttool;
```

3. The application will create all tables automatically on first run.

## Step 2: Backend Setup (3 minutes)

1. Open terminal and navigate to backend directory:
```bash
cd backend
```

2. The default credentials are already configured in `application.properties`:
   - Database: `accounttool`
   - Username: `postgres`
   - Password: `postgres`

   If your PostgreSQL uses different credentials, update `src/main/resources/application.properties`

3. Start the backend:
```bash
mvn spring-boot:run
```

Wait for the message: `Started AccountToolApplication`

The backend is now running at `http://localhost:8080`

## Step 3: Initialize Roles (1 minute)

With the backend running, the tables are created. Now initialize the roles:

1. Open a new terminal
2. Connect to PostgreSQL:
```bash
psql -U postgres -d accounttool
```

3. Insert roles:
```sql
INSERT INTO roles (name, description) VALUES 
('ROLE_ADMIN', 'Administrator with full access'),
('ROLE_ACCOUNTANT', 'Accountant with accounting access'),
('ROLE_USER', 'Regular user with read access');
```

4. Exit: `\q`

## Step 4: Frontend Setup (2 minutes)

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies (first time only):
```bash
npm install
```

3. Start the frontend:
```bash
npm start
```

The frontend will open automatically at `http://localhost:4200`

## Step 5: First Login (1 minute)

1. Open your browser to `http://localhost:4200`

2. Click "Sign Up" and create your first admin account:
   - Username: `admin`
   - Email: `admin@example.com`
   - Password: `admin123`
   - Full Name: `Admin User`

3. Login with your new credentials

## Step 6: Create Your First Company (2 minutes)

1. After login, you'll see the dashboard
2. Click "Companies" in the sidebar
3. Click "Add Company" button
4. Fill in the form:
   - Company Name: `My Business Pvt Ltd`
   - GSTIN: `27AABCU9603R1ZX` (example)
   - PAN: `AABCU9603R` (example)
   - Address: Your business address
   - City: Your city
   - State: `Maharashtra` (or your state)
   - PIN Code: `400001`
   - Phone: `+91 1234567890`
   - Email: `business@example.com`
   - Financial Year Start: `2024-04-01`
   - Financial Year End: `2025-03-31`

5. Click "Save"

🎉 **Congratulations!** Your accounting system is now set up!

## Next Steps

Now that your system is running, you can:

1. **Create Ledgers**: Set up your chart of accounts
   - Assets (Bank, Cash)
   - Liabilities (Loans)
   - Income (Sales)
   - Expenses (Purchases, Rent)
   - Capital (Owner's capital)

2. **Create Journal Entries**: Record financial transactions

3. **Create GST Invoices**: 
   - Sales invoices for your customers
   - Purchase invoices from suppliers
   - Automatic GST calculation (CGST/SGST/IGST)

## Troubleshooting

### Backend won't start?
- Check if PostgreSQL is running: `psql -U postgres`
- Verify database exists: `\l` in psql
- Check application.properties has correct credentials

### Frontend won't start?
- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`

### Can't login?
- Verify you created an account via signup
- Check backend console for errors
- Verify roles were inserted in database

### Database errors?
- Make sure PostgreSQL is running
- Check connection settings in application.properties
- Verify database user has proper permissions

## Default Ports

- Backend API: `http://localhost:8080`
- Frontend UI: `http://localhost:4200`
- PostgreSQL: `localhost:5432`

## Support

For detailed documentation, see [README.md](README.md)

For issues, check the console output for error messages.
