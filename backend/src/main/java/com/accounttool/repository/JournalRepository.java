package com.accounttool.repository;

import com.accounttool.entity.Journal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface JournalRepository extends JpaRepository<Journal, Long> {
    Optional<Journal> findByJournalNumber(String journalNumber);
    List<Journal> findByCompanyId(Long companyId);
}
