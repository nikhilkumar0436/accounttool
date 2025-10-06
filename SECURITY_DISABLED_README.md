# ⚠️ SECURITY TEMPORARILY DISABLED

**WARNING:** JWT authentication and authorization have been temporarily disabled for testing purposes.

## What Was Disabled

1. **SecurityConfig.java**
   - `@EnableMethodSecurity` annotation commented out
   - JWT token filter disabled
   - All endpoints set to `permitAll()`

2. **All Controllers**
   - All `@PreAuthorize` annotations commented out
   - CompanyController, LedgerController, JournalController, GSTInvoiceController

## How to Re-Enable Security

### Step 1: Re-enable SecurityConfig

In `backend/src/main/java/com/accounttool/config/SecurityConfig.java`:

1. **Uncomment** the `@EnableMethodSecurity` annotation:
   ```java
   @Configuration
   @EnableWebSecurity
   @EnableMethodSecurity  // ← UNCOMMENT THIS
   public class SecurityConfig {
   ```

2. **Replace the filterChain method** with the commented original configuration:
   - Comment out the current `permitAll()` configuration
   - Uncomment the original security configuration (lines starting with `/* ORIGINAL SECURITY CONFIGURATION`)

### Step 2: Re-enable @PreAuthorize Annotations

In all controller files, uncomment the `@PreAuthorize` annotations:

1. **CompanyController.java** - Uncomment 5 annotations
2. **LedgerController.java** - Uncomment 6 annotations  
3. **JournalController.java** - Uncomment 4 annotations
4. **GSTInvoiceController.java** - Uncomment 7 annotations

Look for comments:
```java
// TEMPORARILY DISABLED - UNCOMMENT TO RE-ENABLE
// @PreAuthorize("...")
```

Remove the comment markers (`//`) from the `@PreAuthorize` line.

### Step 3: Restart the Backend

```bash
cd backend
mvn clean spring-boot:run
```

## Testing Without Security

While security is disabled:
- All API endpoints are accessible without authentication
- No JWT token is required
- You can test company creation, ledger management, etc. directly
- The `createdBy` field will be null for new records

## Important Notes

- **DO NOT deploy to production** with security disabled
- This is only for temporary testing and debugging
- Re-enable security as soon as testing is complete
- All changes are clearly marked with "TEMPORARILY DISABLED" comments

## Current State

✅ Security is DISABLED
✅ All endpoints are open
✅ No authentication required
✅ Ready for testing

When done testing, follow the steps above to re-enable security.
