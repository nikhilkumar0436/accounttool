package com.accounttool.service;

import com.accounttool.entity.GSTInvoice;
import com.accounttool.entity.GSTInvoiceItem;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class GSTCalculationService {
    
    /**
     * Calculate GST for an invoice item based on supply location
     * If same state: CGST + SGST
     * If different state: IGST
     */
    public void calculateItemGST(GSTInvoiceItem item, String companyState, String partyState) {
        BigDecimal taxableValue = item.getTaxableValue();
        BigDecimal gstRate = item.getGstRate();
        
        boolean isSameState = companyState != null && companyState.equalsIgnoreCase(partyState);
        
        if (isSameState) {
            // Intra-state: CGST + SGST (split GST rate equally)
            BigDecimal halfRate = gstRate.divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);
            item.setCgstRate(halfRate);
            item.setSgstRate(halfRate);
            item.setIgstRate(BigDecimal.ZERO);
            
            BigDecimal cgst = taxableValue.multiply(halfRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal sgst = taxableValue.multiply(halfRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            
            item.setCgstAmount(cgst);
            item.setSgstAmount(sgst);
            item.setIgstAmount(BigDecimal.ZERO);
        } else {
            // Inter-state: IGST
            item.setIgstRate(gstRate);
            item.setCgstRate(BigDecimal.ZERO);
            item.setSgstRate(BigDecimal.ZERO);
            
            BigDecimal igst = taxableValue.multiply(gstRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            
            item.setIgstAmount(igst);
            item.setCgstAmount(BigDecimal.ZERO);
            item.setSgstAmount(BigDecimal.ZERO);
        }
        
        BigDecimal totalGst = item.getCgstAmount().add(item.getSgstAmount()).add(item.getIgstAmount());
        item.setTotalAmount(taxableValue.add(totalGst));
    }
    
    /**
     * Calculate invoice totals from items
     */
    public void calculateInvoiceTotals(GSTInvoice invoice) {
        BigDecimal taxableAmount = BigDecimal.ZERO;
        BigDecimal cgstAmount = BigDecimal.ZERO;
        BigDecimal sgstAmount = BigDecimal.ZERO;
        BigDecimal igstAmount = BigDecimal.ZERO;
        
        for (GSTInvoiceItem item : invoice.getItems()) {
            taxableAmount = taxableAmount.add(item.getTaxableValue());
            cgstAmount = cgstAmount.add(item.getCgstAmount());
            sgstAmount = sgstAmount.add(item.getSgstAmount());
            igstAmount = igstAmount.add(item.getIgstAmount());
        }
        
        invoice.setTaxableAmount(taxableAmount);
        invoice.setCgstAmount(cgstAmount);
        invoice.setSgstAmount(sgstAmount);
        invoice.setIgstAmount(igstAmount);
        invoice.setTotalAmount(taxableAmount.add(cgstAmount).add(sgstAmount).add(igstAmount));
    }
}
