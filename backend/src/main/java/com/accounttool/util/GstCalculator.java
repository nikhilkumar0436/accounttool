package com.accounttool.util;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class GstCalculator {
    
    /**
     * Calculate GST amounts based on company and party state
     * If same state: CGST + SGST
     * If different state: IGST
     */
    public GstAmount calculateGst(BigDecimal amount, BigDecimal gstRate, String companyState, String partyState) {
        GstAmount gstAmount = new GstAmount();
        
        BigDecimal gstValue = amount.multiply(gstRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        
        if (companyState != null && companyState.equalsIgnoreCase(partyState)) {
            // Same state - CGST + SGST
            BigDecimal halfRate = gstRate.divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);
            BigDecimal halfAmount = gstValue.divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);
            
            gstAmount.setCgstRate(halfRate);
            gstAmount.setCgstAmount(halfAmount);
            gstAmount.setSgstRate(halfRate);
            gstAmount.setSgstAmount(halfAmount);
            gstAmount.setIgstRate(BigDecimal.ZERO);
            gstAmount.setIgstAmount(BigDecimal.ZERO);
        } else {
            // Different state - IGST
            gstAmount.setCgstRate(BigDecimal.ZERO);
            gstAmount.setCgstAmount(BigDecimal.ZERO);
            gstAmount.setSgstRate(BigDecimal.ZERO);
            gstAmount.setSgstAmount(BigDecimal.ZERO);
            gstAmount.setIgstRate(gstRate);
            gstAmount.setIgstAmount(gstValue);
        }
        
        return gstAmount;
    }
    
    public static class GstAmount {
        private BigDecimal cgstRate = BigDecimal.ZERO;
        private BigDecimal cgstAmount = BigDecimal.ZERO;
        private BigDecimal sgstRate = BigDecimal.ZERO;
        private BigDecimal sgstAmount = BigDecimal.ZERO;
        private BigDecimal igstRate = BigDecimal.ZERO;
        private BigDecimal igstAmount = BigDecimal.ZERO;
        
        public BigDecimal getCgstRate() { return cgstRate; }
        public void setCgstRate(BigDecimal cgstRate) { this.cgstRate = cgstRate; }
        
        public BigDecimal getCgstAmount() { return cgstAmount; }
        public void setCgstAmount(BigDecimal cgstAmount) { this.cgstAmount = cgstAmount; }
        
        public BigDecimal getSgstRate() { return sgstRate; }
        public void setSgstRate(BigDecimal sgstRate) { this.sgstRate = sgstRate; }
        
        public BigDecimal getSgstAmount() { return sgstAmount; }
        public void setSgstAmount(BigDecimal sgstAmount) { this.sgstAmount = sgstAmount; }
        
        public BigDecimal getIgstRate() { return igstRate; }
        public void setIgstRate(BigDecimal igstRate) { this.igstRate = igstRate; }
        
        public BigDecimal getIgstAmount() { return igstAmount; }
        public void setIgstAmount(BigDecimal igstAmount) { this.igstAmount = igstAmount; }
        
        public BigDecimal getTotalGst() {
            return cgstAmount.add(sgstAmount).add(igstAmount);
        }
    }
}
