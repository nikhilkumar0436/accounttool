package com.accounttool.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "gst_invoice_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GSTInvoiceItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "invoice_id", nullable = false)
    private GSTInvoice invoice;
    
    @Column(nullable = false)
    private String description;
    
    @Column(name = "hsn_code")
    private String hsnCode; // HSN/SAC code
    
    private BigDecimal quantity = BigDecimal.ONE;
    
    private String unit = "NOS";
    
    @Column(name = "rate_per_unit")
    private BigDecimal ratePerUnit = BigDecimal.ZERO;
    
    @Column(name = "taxable_value")
    private BigDecimal taxableValue = BigDecimal.ZERO;
    
    @Column(name = "gst_rate")
    private BigDecimal gstRate = BigDecimal.ZERO; // e.g., 18 for 18%
    
    @Column(name = "cgst_rate")
    private BigDecimal cgstRate = BigDecimal.ZERO;
    
    @Column(name = "sgst_rate")
    private BigDecimal sgstRate = BigDecimal.ZERO;
    
    @Column(name = "igst_rate")
    private BigDecimal igstRate = BigDecimal.ZERO;
    
    @Column(name = "cgst_amount")
    private BigDecimal cgstAmount = BigDecimal.ZERO;
    
    @Column(name = "sgst_amount")
    private BigDecimal sgstAmount = BigDecimal.ZERO;
    
    @Column(name = "igst_amount")
    private BigDecimal igstAmount = BigDecimal.ZERO;
    
    @Column(name = "total_amount")
    private BigDecimal totalAmount = BigDecimal.ZERO;
}
