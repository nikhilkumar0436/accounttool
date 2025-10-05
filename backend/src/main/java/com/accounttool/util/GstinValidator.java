package com.accounttool.util;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class GstinValidator {
    
    private static final Pattern GSTIN_PATTERN = Pattern.compile("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$");
    
    /**
     * Validates GSTIN format according to Indian GST standards
     * Format: 2 digits (State Code) + 10 digits/chars (PAN) + 1 digit (Entity Number) + Z + 1 check digit
     */
    public boolean isValidGstin(String gstin) {
        if (gstin == null || gstin.length() != 15) {
            return false;
        }
        
        return GSTIN_PATTERN.matcher(gstin).matches();
    }
    
    /**
     * Extract state code from GSTIN
     */
    public String getStateCode(String gstin) {
        if (isValidGstin(gstin)) {
            return gstin.substring(0, 2);
        }
        return null;
    }
    
    /**
     * Extract PAN from GSTIN
     */
    public String getPan(String gstin) {
        if (isValidGstin(gstin)) {
            return gstin.substring(2, 12);
        }
        return null;
    }
}
