package com.accounttool.repository;

import com.accounttool.entity.Ledger;
import com.accounttool.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LedgerRepository extends JpaRepository<Ledger, Long> {
    List<Ledger> findByCompany(Company company);
    
    // Optimized query with JOIN FETCH to eagerly load company
    @Query("SELECT l FROM Ledger l " +
           "LEFT JOIN FETCH l.company " +
           "WHERE l.company.id = :companyId " +
           "ORDER BY l.name")
    List<Ledger> findByCompanyId(@Param("companyId") Long companyId);
    
    // Optimized query for all ledgers with company
    @Query("SELECT l FROM Ledger l " +
           "LEFT JOIN FETCH l.company " +
           "ORDER BY l.name")
    List<Ledger> findAllWithCompany();
}
