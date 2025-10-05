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
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String productCode;
    
    @Column(length = 8)
    private String hsnCode;
    
    @Column(length = 1000)
    private String description;
    
    private String unit = "PCS";
    
    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal saleRate = BigDecimal.ZERO;
    
    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal purchaseRate = BigDecimal.ZERO;
    
    @Column(precision = 5, scale = 2, nullable = false)
    private BigDecimal gstRate = BigDecimal.ZERO;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal currentStock = BigDecimal.ZERO;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal minStock = BigDecimal.ZERO;
    
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
}
