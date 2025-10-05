package com.accounttool.service;

import com.accounttool.dto.InvoiceRequest;
import com.accounttool.entity.*;
import com.accounttool.repository.*;
import com.accounttool.util.GstCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    
    private final InvoiceRepository invoiceRepository;
    private final CompanyRepository companyRepository;
    private final LedgerRepository ledgerRepository;
    private final ProductRepository productRepository;
    private final GstCalculator gstCalculator;
    
    @Transactional
    public Invoice createInvoice(InvoiceRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));
        
        Ledger partyLedger = ledgerRepository.findById(request.getPartyLedgerId())
                .orElseThrow(() -> new RuntimeException("Party ledger not found"));
        
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(request.getInvoiceNumber());
        invoice.setType(Invoice.InvoiceType.valueOf(request.getType()));
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setCompany(company);
        invoice.setPartyLedger(partyLedger);
        invoice.setPartyGstin(request.getPartyGstin());
        invoice.setPartyAddress(request.getPartyAddress());
        invoice.setPartyState(request.getPartyState());
        invoice.setRemarks(request.getRemarks());
        invoice.setStatus(Invoice.InvoiceStatus.DRAFT);
        
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalCgst = BigDecimal.ZERO;
        BigDecimal totalSgst = BigDecimal.ZERO;
        BigDecimal totalIgst = BigDecimal.ZERO;
        
        for (InvoiceRequest.InvoiceItemRequest itemReq : request.getItems()) {
            InvoiceItem item = new InvoiceItem();
            item.setInvoice(invoice);
            
            if (itemReq.getProductId() != null) {
                Product product = productRepository.findById(itemReq.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));
                item.setProduct(product);
            }
            
            item.setDescription(itemReq.getDescription());
            item.setHsnCode(itemReq.getHsnCode());
            item.setQuantity(itemReq.getQuantity());
            item.setUnit(itemReq.getUnit());
            item.setRate(itemReq.getRate());
            
            BigDecimal amount = itemReq.getQuantity().multiply(itemReq.getRate());
            item.setAmount(amount);
            
            // Calculate GST based on company and party state
            String companyState = company.getState();
            String partyState = request.getPartyState();
            
            BigDecimal totalGstRate = itemReq.getCgstRate().add(itemReq.getSgstRate()).add(itemReq.getIgstRate());
            GstCalculator.GstAmount gstAmount = gstCalculator.calculateGst(amount, totalGstRate, companyState, partyState);
            
            item.setCgstRate(gstAmount.getCgstRate());
            item.setCgstAmount(gstAmount.getCgstAmount());
            item.setSgstRate(gstAmount.getSgstRate());
            item.setSgstAmount(gstAmount.getSgstAmount());
            item.setIgstRate(gstAmount.getIgstRate());
            item.setIgstAmount(gstAmount.getIgstAmount());
            
            BigDecimal itemTotal = amount.add(gstAmount.getTotalGst());
            item.setTotalAmount(itemTotal);
            
            invoice.getItems().add(item);
            
            subtotal = subtotal.add(amount);
            totalCgst = totalCgst.add(gstAmount.getCgstAmount());
            totalSgst = totalSgst.add(gstAmount.getSgstAmount());
            totalIgst = totalIgst.add(gstAmount.getIgstAmount());
        }
        
        invoice.setSubtotal(subtotal);
        invoice.setCgstAmount(totalCgst);
        invoice.setSgstAmount(totalSgst);
        invoice.setIgstAmount(totalIgst);
        invoice.setTotalAmount(subtotal.add(totalCgst).add(totalSgst).add(totalIgst));
        
        return invoiceRepository.save(invoice);
    }
    
    public List<Invoice> getInvoicesByCompany(Long companyId) {
        return invoiceRepository.findByCompanyId(companyId);
    }
    
    public List<Invoice> getInvoicesByType(Long companyId, Invoice.InvoiceType type) {
        return invoiceRepository.findByCompanyIdAndType(companyId, type);
    }
    
    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
    }
    
    @Transactional
    public Invoice updateInvoiceStatus(Long id, Invoice.InvoiceStatus status) {
        Invoice invoice = getInvoiceById(id);
        invoice.setStatus(status);
        return invoiceRepository.save(invoice);
    }
    
    public List<Invoice> getGstr1Data(Long companyId, LocalDate startDate, LocalDate endDate) {
        // GSTR-1 contains outward supplies (sales)
        return invoiceRepository.findByCompanyIdAndTypeAndInvoiceDateBetween(
                companyId, Invoice.InvoiceType.SALES, startDate, endDate
        );
    }
}
