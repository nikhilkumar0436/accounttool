package com.accounttool.repository;

import com.accounttool.entity.Journal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface JournalRepository extends JpaRepository<Journal, Long> {
    Optional<Journal> findByJournalNumber(String journalNumber);
    
    // Optimized query with JOIN FETCH to avoid N+1 queries
    @Query("SELECT DISTINCT j FROM Journal j " +
           "LEFT JOIN FETCH j.entries e " +
           "LEFT JOIN FETCH e.ledger " +
           "LEFT JOIN FETCH j.company " +
           "WHERE j.company.id = :companyId")
    List<Journal> findByCompanyId(@Param("companyId") Long companyId);
    
    // Optimized query for getting all journals
    @Query("SELECT DISTINCT j FROM Journal j " +
           "LEFT JOIN FETCH j.entries e " +
           "LEFT JOIN FETCH e.ledger " +
           "LEFT JOIN FETCH j.company")
    List<Journal> findAllWithDetails();
    
    // Optimized query for single journal by ID
    @Query("SELECT j FROM Journal j " +
           "LEFT JOIN FETCH j.entries e " +
           "LEFT JOIN FETCH e.ledger " +
           "LEFT JOIN FETCH j.company " +
           "WHERE j.id = :id")
    Optional<Journal> findByIdWithDetails(@Param("id") Long id);
}
