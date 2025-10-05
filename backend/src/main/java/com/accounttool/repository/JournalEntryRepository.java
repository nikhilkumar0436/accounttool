package com.accounttool.repository;

import com.accounttool.entity.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    List<JournalEntry> findByCompanyId(Long companyId);
    List<JournalEntry> findByCompanyIdAndEntryDateBetween(Long companyId, LocalDate startDate, LocalDate endDate);
}
