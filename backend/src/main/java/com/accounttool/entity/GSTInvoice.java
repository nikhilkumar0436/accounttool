package com.accounttool.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "gst_invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GSTInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "invoice_number", unique = true, nullable = false)
    private String invoiceNumber;
    
    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "invoice_type", nullable = false)
    private InvoiceType invoiceType;
    
    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    
    @ManyToOne
    @JoinColumn(name = "party_ledger_id", nullable = false)
    private Ledger partyLedger;
    
    @Column(name = "party_gstin")
    private String partyGstin;
    
    @Column(name = "party_state")
    private String partyState;
    
    @Column(name = "place_of_supply")
    private String placeOfSupply;
    
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GSTInvoiceItem> items = new ArrayList<>();
    
    @Column(name = "taxable_amount")
    private BigDecimal taxableAmount = BigDecimal.ZERO;
    
    @Column(name = "cgst_amount")
    private BigDecimal cgstAmount = BigDecimal.ZERO;
    
    @Column(name = "sgst_amount")
    private BigDecimal sgstAmount = BigDecimal.ZERO;
    
    @Column(name = "igst_amount")
    private BigDecimal igstAmount = BigDecimal.ZERO;
    
    @Column(name = "total_amount")
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    private String notes;
    
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum InvoiceType {
        SALES,
        PURCHASE
    }
}
