package com.accounttool.repository;

import com.accounttool.entity.Ledger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LedgerRepository extends JpaRepository<Ledger, Long> {
    List<Ledger> findByCompanyIdAndActiveTrue(Long companyId);
    List<Ledger> findByCompanyIdAndType(Long companyId, Ledger.LedgerType type);
}
