package com.accounttool.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "gstin", unique = true, nullable = false)
    private String gstin; // GST Identification Number
    
    @Column(name = "pan", unique = true)
    private String pan; // PAN Number
    
    private String address;
    
    private String city;
    
    private String state;
    
    @Column(name = "pin_code")
    private String pinCode;
    
    private String phone;
    
    private String email;
    
    @Column(name = "financial_year_start")
    private String financialYearStart; // e.g., "2024-04-01"
    
    @Column(name = "financial_year_end")
    private String financialYearEnd; // e.g., "2025-03-31"
    
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
}
