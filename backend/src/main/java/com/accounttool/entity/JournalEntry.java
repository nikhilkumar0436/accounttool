package com.accounttool.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "journal_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "journal_id", nullable = false)
    private Journal journal;
    
    @ManyToOne
    @JoinColumn(name = "ledger_id", nullable = false)
    private Ledger ledger;
    
    @Column(nullable = false)
    private BigDecimal debit = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private BigDecimal credit = BigDecimal.ZERO;
    
    private String description;
}
