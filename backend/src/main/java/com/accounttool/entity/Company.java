package com.accounttool.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    
    @NotBlank(message = "Company name is required")
    @Column(nullable = false)
    private String name;
    
    @NotBlank(message = "GSTIN is required")
    @Pattern(regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$", 
             message = "Invalid GSTIN format. Format: 22AAAAA0000A1Z5")
    @Column(name = "gstin", unique = true, nullable = false)
    private String gstin; // GST Identification Number
    
    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", 
             message = "Invalid PAN format. Format: AAAAA9999A")
    @Column(name = "pan", unique = true)
    private String pan; // PAN Number
    
    private String address;
    
    private String city;
    
    private String state;
    
    @Column(name = "pin_code")
    private String pinCode;
    
    private String phone;
    
    @Email(message = "Invalid email format")
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
