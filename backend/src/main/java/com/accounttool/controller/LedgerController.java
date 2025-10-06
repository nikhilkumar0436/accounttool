package com.accounttool.controller;

import com.accounttool.entity.Ledger;
import com.accounttool.repository.LedgerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ledgers")
public class LedgerController {
    @Autowired
    private LedgerRepository ledgerRepository;
    
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Ledger>> getAllLedgers() {
        return ResponseEntity.ok(ledgerRepository.findAll());
    }
    
    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Ledger>> getLedgersByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(ledgerRepository.findByCompanyId(companyId));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Ledger> getLedgerById(@PathVariable Long id) {
        return ledgerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Ledger> createLedger(@RequestBody Ledger ledger) {
        return ResponseEntity.ok(ledgerRepository.save(ledger));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Ledger> updateLedger(@PathVariable Long id, @RequestBody Ledger ledgerDetails) {
        return ledgerRepository.findById(id)
                .map(ledger -> {
                    ledger.setName(ledgerDetails.getName());
                    ledger.setType(ledgerDetails.getType());
                    ledger.setDescription(ledgerDetails.getDescription());
                    ledger.setGstin(ledgerDetails.getGstin());
                    ledger.setIsGstApplicable(ledgerDetails.getIsGstApplicable());
                    ledger.setCurrentBalance(ledgerDetails.getCurrentBalance());
                    return ResponseEntity.ok(ledgerRepository.save(ledger));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteLedger(@PathVariable Long id) {
        return ledgerRepository.findById(id)
                .map(ledger -> {
                    ledgerRepository.delete(ledger);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
