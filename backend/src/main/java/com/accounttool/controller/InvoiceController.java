package com.accounttool.controller;

import com.accounttool.dto.InvoiceRequest;
import com.accounttool.entity.Invoice;
import com.accounttool.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoices", description = "Invoice management APIs with GST calculations")
public class InvoiceController {
    
    private final InvoiceService invoiceService;
    
    @PostMapping
    @Operation(summary = "Create new invoice", description = "Create a new sales or purchase invoice with GST calculation")
    public ResponseEntity<Invoice> createInvoice(@Valid @RequestBody InvoiceRequest request) {
        Invoice invoice = invoiceService.createInvoice(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(invoice);
    }
    
    @GetMapping("/company/{companyId}")
    @Operation(summary = "Get invoices by company", description = "Retrieve all invoices for a company")
    public ResponseEntity<List<Invoice>> getInvoicesByCompany(@PathVariable Long companyId) {
        List<Invoice> invoices = invoiceService.getInvoicesByCompany(companyId);
        return ResponseEntity.ok(invoices);
    }
    
    @GetMapping("/company/{companyId}/type/{type}")
    @Operation(summary = "Get invoices by type", description = "Retrieve invoices by type (SALES or PURCHASE)")
    public ResponseEntity<List<Invoice>> getInvoicesByType(
            @PathVariable Long companyId,
            @PathVariable Invoice.InvoiceType type) {
        List<Invoice> invoices = invoiceService.getInvoicesByType(companyId, type);
        return ResponseEntity.ok(invoices);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get invoice by ID", description = "Retrieve a specific invoice by its ID")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        Invoice invoice = invoiceService.getInvoiceById(id);
        return ResponseEntity.ok(invoice);
    }
    
    @PutMapping("/{id}/status")
    @Operation(summary = "Update invoice status", description = "Update the status of an invoice")
    public ResponseEntity<Invoice> updateInvoiceStatus(
            @PathVariable Long id,
            @RequestParam Invoice.InvoiceStatus status) {
        Invoice invoice = invoiceService.updateInvoiceStatus(id, status);
        return ResponseEntity.ok(invoice);
    }
    
    @GetMapping("/company/{companyId}/gstr1")
    @Operation(summary = "Get GSTR-1 data", description = "Retrieve sales invoices for GSTR-1 report")
    public ResponseEntity<List<Invoice>> getGstr1Data(
            @PathVariable Long companyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Invoice> invoices = invoiceService.getGstr1Data(companyId, startDate, endDate);
        return ResponseEntity.ok(invoices);
    }
}
