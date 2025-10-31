# Performance Improvements

This document outlines the performance improvements made to the AccountTool application.

## 1. JWT Secret Key Caching

**Problem**: The JWT secret key was being recreated on every request using `Keys.hmacShaKeyFor()`, which is an expensive cryptographic operation.

**Solution**: Added `@PostConstruct` method to cache the secret key once during bean initialization.

**Impact**: 
- Reduces CPU overhead on every authenticated request
- Eliminates redundant cryptographic key generation
- Improves authentication filter performance

**File**: `backend/src/main/java/com/accounttool/security/JwtUtils.java`

## 2. N+1 Query Problem Resolution

**Problem**: Entities with relationships (GSTInvoice, Journal, Ledger) were causing N+1 queries when fetching related data:
- Fetching invoices would trigger additional queries for items, company, and party ledger
- Fetching journals would trigger additional queries for entries and ledgers

**Solution**: Added custom JPQL queries with `JOIN FETCH` to eagerly load related entities in a single query.

**Impact**:
- Reduced database round trips from O(n) to O(1)
- Significantly improved response time for list endpoints
- Better database connection pool utilization

**Files**:
- `backend/src/main/java/com/accounttool/repository/GSTInvoiceRepository.java`
- `backend/src/main/java/com/accounttool/repository/JournalRepository.java`
- `backend/src/main/java/com/accounttool/repository/LedgerRepository.java`

## 3. Data Caching

**Problem**: Frequently accessed, rarely changing data (companies, user details) were being fetched from database on every request.

**Solution**: Implemented Spring Cache abstraction with in-memory caching for:
- Company lookup by ID and GSTIN
- User details during authentication

**Impact**:
- Reduced database load for read-heavy operations
- Faster authentication response time
- Improved scalability for concurrent users

**Files**:
- `backend/src/main/java/com/accounttool/config/CacheConfig.java`
- `backend/src/main/java/com/accounttool/repository/CompanyRepository.java`
- `backend/src/main/java/com/accounttool/security/UserDetailsServiceImpl.java`

## 4. Database Indexes

**Problem**: Queries filtering by commonly used columns (company_id, invoice_type, dates) were doing full table scans.

**Solution**: Added composite and single-column indexes on:
- `ledgers.name` - For quick name-based lookups
- `journals.journal_date` - For date range queries
- `journals.journal_number` - For invoice number lookups
- `gst_invoices.invoice_date` - For date filtering
- `gst_invoices.invoice_type` - For type filtering
- `gst_invoices.company_id, invoice_type` - Composite index for combined filtering
- `journal_entries.ledger_id` - For ledger-based queries

**Impact**:
- Faster query execution for filtered results
- Reduced database I/O
- Better query plan optimization by database engine

**File**: `backend/src/main/resources/schema.sql`

## 5. Pagination Support

**Problem**: All list endpoints were returning entire datasets, which could be very large for companies with many transactions.

**Solution**: Added paginated query methods to repositories for:
- GST Invoices by company
- GST Invoices by company and type
- Journals by company

**Impact**:
- Reduced memory usage on server and client
- Faster response times for large datasets
- Better user experience with progressive loading

**Files**:
- `backend/src/main/java/com/accounttool/repository/GSTInvoiceRepository.java`
- `backend/src/main/java/com/accounttool/repository/JournalRepository.java`

## 6. Read-Only Transactions

**Problem**: UserDetailsService was using default transaction settings which included write locks.

**Solution**: Marked the `loadUserByUsername` method with `@Transactional(readOnly = true)`.

**Impact**:
- Allows database to optimize for read operations
- Reduces lock contention
- Improves concurrency for authentication requests

**File**: `backend/src/main/java/com/accounttool/security/UserDetailsServiceImpl.java`

## Performance Recommendations for Future

### 1. Implement Redis Cache
For production environments, consider replacing the in-memory cache with Redis for:
- Distributed caching across multiple application instances
- Better cache eviction strategies
- Persistence of cache data

### 2. Add Connection Pooling Configuration
Configure HikariCP with appropriate settings:
```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
```

### 3. Implement Query Result Caching
Consider caching frequently accessed query results for:
- Dashboard statistics
- Report data
- Aggregated calculations

### 4. Add Database Query Monitoring
Implement query performance monitoring to identify slow queries:
- Use Spring Boot Actuator
- Add logging for slow queries (>100ms)
- Use database query analyzer tools

### 5. Optimize BigDecimal Operations
Consider batch processing for calculations involving multiple items to reduce object creation overhead.

### 6. Implement Async Processing
For non-critical operations like:
- Email notifications
- Report generation
- Audit logging

### 7. Add API Response Compression
Enable GZIP compression for API responses to reduce network transfer time.

### 8. Frontend Optimization
- Implement virtual scrolling for large lists
- Add debouncing for search inputs
- Lazy load components and routes
- Implement service workers for offline capability

## Testing Performance Improvements

To measure the impact of these improvements:

1. **Load Testing**: Use tools like Apache JMeter or Gatling to simulate concurrent users
2. **Query Analysis**: Enable Hibernate query logging to verify N+1 issues are resolved
3. **Profiling**: Use Java profilers (VisualVM, YourKit) to identify remaining bottlenecks
4. **Database Metrics**: Monitor query execution times and connection pool usage
5. **APM Tools**: Consider using Application Performance Monitoring tools like New Relic or Datadog

## Maintenance Notes

1. **Cache Invalidation**: When company or user data is updated, ensure cache is invalidated
2. **Index Maintenance**: Monitor index usage and remove unused indexes
3. **Query Review**: Periodically review slow query logs and optimize as needed
4. **Version Upgrades**: Keep dependencies updated for performance improvements and security patches
