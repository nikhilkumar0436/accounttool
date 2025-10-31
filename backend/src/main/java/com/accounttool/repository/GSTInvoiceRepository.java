package com.accounttool.repository;

import com.accounttool.entity.GSTInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GSTInvoiceRepository extends JpaRepository<GSTInvoice, Long> {
    Optional<GSTInvoice> findByInvoiceNumber(String invoiceNumber);
    
    // Optimized query with JOIN FETCH to avoid N+1 queries
    @Query("SELECT DISTINCT i FROM GSTInvoice i " +
           "LEFT JOIN FETCH i.items " +
           "LEFT JOIN FETCH i.company " +
           "LEFT JOIN FETCH i.partyLedger " +
           "WHERE i.company.id = :companyId")
    List<GSTInvoice> findByCompanyId(@Param("companyId") Long companyId);
    
    // Optimized query with JOIN FETCH for type filtering
    @Query("SELECT DISTINCT i FROM GSTInvoice i " +
           "LEFT JOIN FETCH i.items " +
           "LEFT JOIN FETCH i.company " +
           "LEFT JOIN FETCH i.partyLedger " +
           "WHERE i.company.id = :companyId AND i.invoiceType = :invoiceType")
    List<GSTInvoice> findByCompanyIdAndInvoiceType(
        @Param("companyId") Long companyId, 
        @Param("invoiceType") GSTInvoice.InvoiceType invoiceType
    );
    
    // Optimized query for getting all invoices
    @Query("SELECT DISTINCT i FROM GSTInvoice i " +
           "LEFT JOIN FETCH i.items " +
           "LEFT JOIN FETCH i.company " +
           "LEFT JOIN FETCH i.partyLedger")
    List<GSTInvoice> findAllWithDetails();
    
    // Optimized query for single invoice by ID
    @Query("SELECT i FROM GSTInvoice i " +
           "LEFT JOIN FETCH i.items " +
           "LEFT JOIN FETCH i.company " +
           "LEFT JOIN FETCH i.partyLedger " +
           "WHERE i.id = :id")
    Optional<GSTInvoice> findByIdWithDetails(@Param("id") Long id);
}
