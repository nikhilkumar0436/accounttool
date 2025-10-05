package com.accounttool.controller;

import com.accounttool.entity.Ledger;
import com.accounttool.service.LedgerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ledgers")
@RequiredArgsConstructor
@Tag(name = "Ledgers", description = "Ledger account management APIs")
public class LedgerController {
    
    private final LedgerService ledgerService;
    
    @PostMapping
    @Operation(summary = "Create new ledger", description = "Create a new ledger account")
    public ResponseEntity<Ledger> createLedger(@Valid @RequestBody Ledger ledger) {
        Ledger created = ledgerService.createLedger(ledger);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @GetMapping("/company/{companyId}")
    @Operation(summary = "Get ledgers by company", description = "Retrieve all active ledgers for a company")
    public ResponseEntity<List<Ledger>> getLedgersByCompany(@PathVariable Long companyId) {
        List<Ledger> ledgers = ledgerService.getLedgersByCompany(companyId);
        return ResponseEntity.ok(ledgers);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get ledger by ID", description = "Retrieve a specific ledger by its ID")
    public ResponseEntity<Ledger> getLedgerById(@PathVariable Long id) {
        Ledger ledger = ledgerService.getLedgerById(id);
        return ResponseEntity.ok(ledger);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update ledger", description = "Update an existing ledger")
    public ResponseEntity<Ledger> updateLedger(
            @PathVariable Long id,
            @Valid @RequestBody Ledger ledger) {
        Ledger updated = ledgerService.updateLedger(id, ledger);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete ledger", description = "Soft delete a ledger")
    public ResponseEntity<Void> deleteLedger(@PathVariable Long id) {
        ledgerService.deleteLedger(id);
        return ResponseEntity.noContent().build();
    }
}
