package com.accounttool.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "journal_entry_lines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntryLine {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journal_entry_id", nullable = false)
    private JournalEntry journalEntry;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ledger_id", nullable = false)
    private Ledger ledger;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;
    
    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal amount = BigDecimal.ZERO;
    
    private String description;
    
    public enum TransactionType {
        DEBIT, CREDIT
    }
}
