package com.accounttool.service;

import com.accounttool.entity.Ledger;
import com.accounttool.repository.LedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LedgerService {
    
    private final LedgerRepository ledgerRepository;
    
    @Transactional
    public Ledger createLedger(Ledger ledger) {
        ledger.setCurrentBalance(ledger.getOpeningBalance());
        return ledgerRepository.save(ledger);
    }
    
    public List<Ledger> getLedgersByCompany(Long companyId) {
        return ledgerRepository.findByCompanyIdAndActiveTrue(companyId);
    }
    
    public Ledger getLedgerById(Long id) {
        return ledgerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ledger not found"));
    }
    
    @Transactional
    public Ledger updateLedger(Long id, Ledger ledgerDetails) {
        Ledger ledger = getLedgerById(id);
        
        ledger.setName(ledgerDetails.getName());
        ledger.setType(ledgerDetails.getType());
        ledger.setGroupName(ledgerDetails.getGroupName());
        
        return ledgerRepository.save(ledger);
    }
    
    @Transactional
    public void deleteLedger(Long id) {
        Ledger ledger = getLedgerById(id);
        ledger.setActive(false);
        ledgerRepository.save(ledger);
    }
}
