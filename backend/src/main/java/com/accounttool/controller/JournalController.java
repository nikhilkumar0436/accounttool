package com.accounttool.controller;

import com.accounttool.entity.Journal;
import com.accounttool.entity.User;
import com.accounttool.repository.JournalRepository;
import com.accounttool.repository.UserRepository;
import com.accounttool.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/journals")
public class JournalController {
    @Autowired
    private JournalRepository journalRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    // TEMPORARILY DISABLED - UNCOMMENT TO RE-ENABLE
    // @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Journal>> getAllJournals() {
        return ResponseEntity.ok(journalRepository.findAll());
    }
    
    @GetMapping("/company/{companyId}")
    // TEMPORARILY DISABLED - UNCOMMENT TO RE-ENABLE
    // @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Journal>> getJournalsByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(journalRepository.findByCompanyId(companyId));
    }
    
    @GetMapping("/{id}")
    // TEMPORARILY DISABLED - UNCOMMENT TO RE-ENABLE
    // @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Journal> getJournalById(@PathVariable Long id) {
        return journalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    // TEMPORARILY DISABLED - UNCOMMENT TO RE-ENABLE
    // @PreAuthorize("hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createJournal(@RequestBody Journal journal, Authentication authentication) {
        if (journalRepository.findByJournalNumber(journal.getJournalNumber()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Journal number already exists!");
        }
        
        // TEMPORARILY: Handle null authentication when security is disabled
        if (authentication != null) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            journal.setCreatedBy(user);
        }
        
        // Calculate totals from entries
        BigDecimal totalDebit = journal.getEntries().stream()
                .map(entry -> entry.getDebit())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalCredit = journal.getEntries().stream()
                .map(entry -> entry.getCredit())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        journal.setTotalDebit(totalDebit);
        journal.setTotalCredit(totalCredit);
        
        // Validate balanced journal
        if (totalDebit.compareTo(totalCredit) != 0) {
            return ResponseEntity.badRequest().body("Error: Journal is not balanced! Debits must equal Credits.");
        }
        
        // Set journal reference for all entries
        journal.getEntries().forEach(entry -> entry.setJournal(journal));
        
        return ResponseEntity.ok(journalRepository.save(journal));
    }
    
    @DeleteMapping("/{id}")
    // TEMPORARILY DISABLED - UNCOMMENT TO RE-ENABLE
    // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteJournal(@PathVariable Long id) {
        return journalRepository.findById(id)
                .map(journal -> {
                    journalRepository.delete(journal);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
