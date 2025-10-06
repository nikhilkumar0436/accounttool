package com.accounttool.controller;

import com.accounttool.entity.Company;
import com.accounttool.entity.GSTInvoice;
import com.accounttool.entity.User;
import com.accounttool.repository.CompanyRepository;
import com.accounttool.repository.GSTInvoiceRepository;
import com.accounttool.repository.UserRepository;
import com.accounttool.security.UserDetailsImpl;
import com.accounttool.service.GSTCalculationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/gst-invoices")
public class GSTInvoiceController {
    @Autowired
    private GSTInvoiceRepository invoiceRepository;
    
    @Autowired
    private CompanyRepository companyRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GSTCalculationService gstCalculationService;
    
    @GetMapping
    // TEMPORARILY DISABLED - UNCOMMENT TO RE-ENABLE
    // @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<GSTInvoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceRepository.findAll());
    }
    
    @GetMapping("/company/{companyId}")
    // TEMPORARILY DISABLED - UNCOMMENT TO RE-ENABLE
    // @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<GSTInvoice>> getInvoicesByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(invoiceRepository.findByCompanyId(companyId));
    }
    
    @GetMapping("/company/{companyId}/type/{type}")
    // TEMPORARILY DISABLED - UNCOMMENT TO RE-ENABLE
    // @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<GSTInvoice>> getInvoicesByCompanyAndType(
            @PathVariable Long companyId, 
            @PathVariable GSTInvoice.InvoiceType type) {
        return ResponseEntity.ok(invoiceRepository.findByCompanyIdAndInvoiceType(companyId, type));
    }
    
    @GetMapping("/{id}")
    // TEMPORARILY DISABLED - UNCOMMENT TO RE-ENABLE
    // @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<GSTInvoice> getInvoiceById(@PathVariable Long id) {
        return invoiceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    // TEMPORARILY DISABLED - UNCOMMENT TO RE-ENABLE
    // @PreAuthorize("hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createInvoice(@RequestBody GSTInvoice invoice, Authentication authentication) {
        if (invoiceRepository.findByInvoiceNumber(invoice.getInvoiceNumber()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Invoice number already exists!");
        }
        
        // TEMPORARILY: Handle null authentication when security is disabled
        if (authentication != null) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            invoice.setCreatedBy(user);
        }
        
        // Get company details for GST calculation
        Company company = companyRepository.findById(invoice.getCompany().getId())
                .orElseThrow(() -> new RuntimeException("Company not found"));
        
        String companyState = company.getState();
        String partyState = invoice.getPartyState();
        
        // Calculate GST for each item
        invoice.getItems().forEach(item -> {
            item.setInvoice(invoice);
            gstCalculationService.calculateItemGST(item, companyState, partyState);
        });
        
        // Calculate invoice totals
        gstCalculationService.calculateInvoiceTotals(invoice);
        
        return ResponseEntity.ok(invoiceRepository.save(invoice));
    }
    
    @PutMapping("/{id}")
    // TEMPORARILY DISABLED - UNCOMMENT TO RE-ENABLE
    // @PreAuthorize("hasAuthority('ROLE_ACCOUNTANT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateInvoice(@PathVariable Long id, @RequestBody GSTInvoice invoiceDetails) {
        return invoiceRepository.findById(id)
                .map(invoice -> {
                    // Get company details for GST calculation
                    Company company = companyRepository.findById(invoiceDetails.getCompany().getId())
                            .orElseThrow(() -> new RuntimeException("Company not found"));
                    
                    String companyState = company.getState();
                    String partyState = invoiceDetails.getPartyState();
                    
                    invoice.setInvoiceDate(invoiceDetails.getInvoiceDate());
                    invoice.setPartyLedger(invoiceDetails.getPartyLedger());
                    invoice.setPartyGstin(invoiceDetails.getPartyGstin());
                    invoice.setPartyState(partyState);
                    invoice.setPlaceOfSupply(invoiceDetails.getPlaceOfSupply());
                    invoice.setNotes(invoiceDetails.getNotes());
                    
                    // Clear existing items and add new ones
                    invoice.getItems().clear();
                    invoiceDetails.getItems().forEach(item -> {
                        item.setInvoice(invoice);
                        gstCalculationService.calculateItemGST(item, companyState, partyState);
                        invoice.getItems().add(item);
                    });
                    
                    // Calculate invoice totals
                    gstCalculationService.calculateInvoiceTotals(invoice);
                    
                    return ResponseEntity.ok(invoiceRepository.save(invoice));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    // TEMPORARILY DISABLED - UNCOMMENT TO RE-ENABLE
    // @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteInvoice(@PathVariable Long id) {
        return invoiceRepository.findById(id)
                .map(invoice -> {
                    invoiceRepository.delete(invoice);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
