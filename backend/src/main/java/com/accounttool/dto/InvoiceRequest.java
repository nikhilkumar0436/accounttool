package com.accounttool.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class InvoiceRequest {
    @NotBlank
    private String invoiceNumber;
    
    @NotBlank
    private String type;
    
    @NotNull
    private LocalDate invoiceDate;
    
    @NotNull
    private Long companyId;
    
    @NotNull
    private Long partyLedgerId;
    
    private String partyGstin;
    private String partyAddress;
    private String partyState;
    private String remarks;
    
    @NotNull
    private List<InvoiceItemRequest> items;
    
    @Data
    public static class InvoiceItemRequest {
        private Long productId;
        
        @NotBlank
        private String description;
        
        private String hsnCode;
        
        @NotNull
        private BigDecimal quantity;
        
        private String unit;
        
        @NotNull
        private BigDecimal rate;
        
        @NotNull
        private BigDecimal cgstRate;
        
        @NotNull
        private BigDecimal sgstRate;
        
        @NotNull
        private BigDecimal igstRate;
    }
}
