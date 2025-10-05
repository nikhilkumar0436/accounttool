package com.accounttool.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ledgers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ledger {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String ledgerCode;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LedgerType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LedgerGroup groupName;
    
    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal openingBalance = BigDecimal.ZERO;
    
    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal currentBalance = BigDecimal.ZERO;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum LedgerType {
        ASSET, LIABILITY, INCOME, EXPENSE, EQUITY
    }
    
    public enum LedgerGroup {
        CASH, BANK, SUNDRY_DEBTORS, SUNDRY_CREDITORS, 
        SALES, PURCHASE, DIRECT_EXPENSES, INDIRECT_EXPENSES,
        FIXED_ASSETS, CURRENT_ASSETS, CURRENT_LIABILITIES,
        LONG_TERM_LIABILITIES, CAPITAL, RESERVES
    }
}
