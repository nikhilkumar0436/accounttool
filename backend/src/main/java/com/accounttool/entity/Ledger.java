package com.accounttool.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
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
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LedgerType type;
    
    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    
    @Column(name = "opening_balance")
    private BigDecimal openingBalance = BigDecimal.ZERO;
    
    @Column(name = "current_balance")
    private BigDecimal currentBalance = BigDecimal.ZERO;
    
    private String description;
    
    @Column(name = "gstin")
    private String gstin; // For party ledgers
    
    @Column(name = "is_gst_applicable")
    private Boolean isGstApplicable = false;
    
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
    
    public enum LedgerType {
        ASSET,
        LIABILITY,
        INCOME,
        EXPENSE,
        CAPITAL
    }
}
